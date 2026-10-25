/**
 * ImmunoBot proxy: a Cloudflare Worker between immunly.org and the AI provider.
 *
 * The website is static, so an API key in its code would be visible to every
 * visitor. This Worker holds the keys as secrets and adds the protections a
 * public chat needs:
 *   - CORS: only the Immunly site may call it from a browser
 *   - input limits on message count and length
 *   - a per-visitor rate limit (Cloudflare Rate Limiting binding)
 *   - a cap on concurrent upstream calls per Worker instance
 *   - a shared cache, so repeated first questions don't hit the provider
 *   - provider fallback: Groq, then OpenRouter, then Gemini, when one is busy or down
 *   - clear JSON errors with a retry time, so the site can say what happened
 *
 * Nothing from the conversation is stored. Requests are forwarded and
 * the reply is returned; only repeat first questions are cached (no history).
 */

interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  GROQ_API_KEY?: string;
  GROQ_MODEL?: string;
  /** Any OpenAI-compatible chat endpoint; defaults to Groq's. */
  GROQ_API_URL?: string;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
  /** Override for testing; defaults to OpenRouter's chat endpoint. */
  OPENROUTER_API_URL?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  /** Comma-separated origins allowed to call the Worker from a browser. */
  ALLOWED_ORIGINS?: string;
  RATE_LIMITER?: RateLimiter;
}

type Role = 'user' | 'assistant';
interface ChatMessage { role: Role; content: string }
interface ChatRequest { messages: ChatMessage[]; context?: string; page?: string }

type ErrorCode =
  | 'bad_request' | 'forbidden' | 'rate_limited' | 'busy' | 'upstream_error' | 'not_configured';

// ── Limits ──────────────────────────────────────────────────────────────────
const MAX_BODY_CHARS = 20_000;
const MAX_MESSAGES = 12;          // accepted from the client
const HISTORY_SENT = 6;           // forwarded upstream (keeps token use low)
const MAX_MESSAGE_CHARS = 1_500;
const MAX_CONTEXT_CHARS = 1_500;
const MAX_REPLY_TOKENS = 500;
const UPSTREAM_TIMEOUT_MS = 20_000;
const MAX_IN_FLIGHT = 24;         // per Worker instance
const CACHE_TTL_S = 60 * 60 * 24;
const FALLBACK_PER_MINUTE = 6;    // used only when the Rate Limiting binding is absent (local dev)

const DEFAULT_ORIGINS = 'https://immunly.org,https://www.immunly.org,http://localhost:5173';
const DEFAULT_GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-20b';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
// OpenRouter's router that picks any currently-free model, so the default
// keeps working as individual free models come and go.
const DEFAULT_OPENROUTER_MODEL = 'openrouter/free';
const DEFAULT_GEMINI_MODEL = 'gemini-flash-latest';

const SYSTEM_PROMPT = `You are ImmunoBot, the tutor on Immunly, a free site that teaches immunology and biomedical research to curious students (mostly high school).
- Answer in plain, friendly language at a high-school level. Keep answers under 180 words unless asked for more.
- Use short paragraphs. Use "- " bullet lists and **bold** for key terms only when they help. No headings, tables or emojis.
- Stay on biology, immunology, medicine-as-science, lab methods and research careers. Politely steer other topics back.
- You are not a doctor. For personal symptoms, diagnoses or treatment decisions, say you can't advise and suggest a doctor or trusted adult.
- If the student shares a passage from the site, explain that passage first.
- If you're not sure, say so rather than guessing.`;

// ── Small helpers ───────────────────────────────────────────────────────────
let inFlight = 0;
const fallbackHits = new Map<string, number[]>();

function json(body: unknown, status: number, origin: string | null, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin), ...extra },
  });
}

function fail(code: ErrorCode, message: string, status: number, origin: string | null, retryAfter?: number) {
  const extra: Record<string, string> = retryAfter ? { 'Retry-After': String(retryAfter) } : {};
  return json({ error: { code, message, retryAfter } }, status, origin, extra);
}

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function allowedOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get('Origin');
  const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ORIGINS).split(',').map(s => s.trim());
  return origin && allowed.includes(origin) ? origin : null;
}

async function withinRateLimit(env: Env, key: string): Promise<boolean> {
  if (env.RATE_LIMITER) return (await env.RATE_LIMITER.limit({ key })).success;
  // Local fallback: sliding one-minute window in memory.
  const now = Date.now();
  const hits = (fallbackHits.get(key) || []).filter(t => now - t < 60_000);
  if (hits.length >= FALLBACK_PER_MINUTE) return false;
  hits.push(now);
  fallbackHits.set(key, hits);
  return true;
}

function parseBody(raw: string): ChatRequest | string {
  if (raw.length > MAX_BODY_CHARS) return 'Request is too large.';
  let data: unknown;
  try { data = JSON.parse(raw); } catch { return 'Request is not valid JSON.'; }
  const body = data as Partial<ChatRequest>;
  if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > MAX_MESSAGES) {
    return 'Send between 1 and 12 messages.';
  }
  for (const m of body.messages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') {
      return 'Each message needs a role and text.';
    }
    if (m.content.length > MAX_MESSAGE_CHARS) return 'A message is too long (1,500 characters max).';
  }
  if (body.messages[body.messages.length - 1].role !== 'user') return 'The last message must be from the user.';
  if (body.context !== undefined && (typeof body.context !== 'string' || body.context.length > MAX_CONTEXT_CHARS)) {
    return 'The highlighted passage is too long (1,500 characters max).';
  }
  if (body.page !== undefined && typeof body.page !== 'string') return 'Invalid page.';
  return {
    messages: body.messages.slice(-HISTORY_SENT).map(m => ({ role: m.role, content: m.content.trim() })),
    context: body.context?.trim() || undefined,
    page: body.page?.slice(0, 200),
  };
}

/** Puts the highlighted passage and page title into the latest question. */
function withContext(req: ChatRequest): ChatMessage[] {
  const msgs = req.messages.slice();
  const last = msgs[msgs.length - 1];
  const parts = [];
  if (req.page) parts.push(`(Student is on the page: ${req.page})`);
  if (req.context) parts.push(`Passage from the site:\n"""${req.context}"""`);
  parts.push(last.content);
  msgs[msgs.length - 1] = { role: 'user', content: parts.join('\n\n') };
  return msgs;
}

async function cacheKey(req: ChatRequest): Promise<Request | null> {
  // Only first questions are cacheable; follow-ups depend on the conversation.
  if (req.messages.length !== 1) return null;
  const text = `${req.context || ''}|${req.messages[0].content}`.toLowerCase().replace(/\s+/g, ' ').trim();
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  const hex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  return new Request(`https://immunobot.cache/q/${hex}`);
}

function sharedCache(): Cache | null {
  // `caches.default` exists on Cloudflare; not in local Node runs.
  const c = (globalThis as { caches?: { default?: Cache } }).caches;
  return c?.default ?? null;
}

// ── Providers ───────────────────────────────────────────────────────────────
class UpstreamError extends Error {
  status: number;
  retryAfter?: number;
  constructor(status: number, message: string, retryAfter?: number) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

function retryAfterSeconds(res: Response): number | undefined {
  const v = res.headers.get('retry-after');
  const n = v ? Number.parseFloat(v) : NaN;
  return Number.isFinite(n) ? Math.ceil(n) : undefined;
}

/** Chat call for OpenAI-compatible APIs (Groq, OpenRouter). */
async function askOpenAICompatible(
  name: string,
  url: string,
  key: string,
  model: string,
  messages: ChatMessage[],
  extraHeaders: Record<string, string> = {},
): Promise<string> {
  const reasoning = model.startsWith('openai/gpt-oss');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, ...extraHeaders },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.4,
      // Reasoning models spend tokens thinking first, so give them more room.
      max_tokens: reasoning ? MAX_REPLY_TOKENS + 300 : MAX_REPLY_TOKENS,
      ...(reasoning ? { reasoning_effort: 'low' } : {}),
    }),
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!res.ok) throw new UpstreamError(res.status, `${name} ${res.status}`, retryAfterSeconds(res));
  const data = await res.json() as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new UpstreamError(502, `${name} returned no text`);
  return text;
}

function askGroq(env: Env, messages: ChatMessage[]) {
  return askOpenAICompatible(
    'Groq', env.GROQ_API_URL || DEFAULT_GROQ_URL, env.GROQ_API_KEY || '',
    env.GROQ_MODEL || DEFAULT_GROQ_MODEL, messages,
  );
}

function askOpenRouter(env: Env, messages: ChatMessage[]) {
  return askOpenAICompatible(
    'OpenRouter', env.OPENROUTER_API_URL || OPENROUTER_URL, env.OPENROUTER_API_KEY || '',
    env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL, messages,
    // Optional attribution headers OpenRouter asks apps to send.
    { 'HTTP-Referer': 'https://immunly.org', 'X-Title': 'Immunly ImmunoBot' },
  );
}

async function askGemini(env: Env, messages: ChatMessage[]): Promise<string> {
  const model = env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY || '' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
      generationConfig: { temperature: 0.4, maxOutputTokens: MAX_REPLY_TOKENS },
    }),
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!res.ok) throw new UpstreamError(res.status, `Gemini ${res.status}`, retryAfterSeconds(res));
  const data = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim();
  if (!text) throw new UpstreamError(502, 'Gemini returned no text');
  return text;
}

function providers(env: Env) {
  const list: { name: string; ask: (env: Env, m: ChatMessage[]) => Promise<string> }[] = [];
  // Tried in this order; the next one is used only if the previous is busy or down.
  if (env.GROQ_API_KEY) list.push({ name: 'groq', ask: askGroq });
  if (env.OPENROUTER_API_KEY) list.push({ name: 'openrouter', ask: askOpenRouter });
  if (env.GEMINI_API_KEY) list.push({ name: 'gemini', ask: askGemini });
  return list;
}

// ── Handler ─────────────────────────────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env, ctx?: { waitUntil(p: Promise<unknown>): void }): Promise<Response> {
    const origin = allowedOrigin(request, env);

    if (request.method === 'OPTIONS') {
      return origin ? new Response(null, { status: 204, headers: corsHeaders(origin) }) : new Response(null, { status: 403 });
    }
    if (request.method !== 'POST') return fail('bad_request', 'Use POST.', 405, origin);
    if (!origin) return fail('forbidden', 'This origin may not use ImmunoBot.', 403, null);

    const available = providers(env);
    if (available.length === 0) {
      return fail('not_configured', 'ImmunoBot has no AI provider key configured yet.', 503, origin);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'local';
    if (!(await withinRateLimit(env, ip))) {
      return fail('rate_limited', "You're sending questions quickly. Please wait a moment.", 429, origin, 30);
    }

    const parsed = parseBody(await request.text());
    if (typeof parsed === 'string') return fail('bad_request', parsed, 400, origin);

    const cache = sharedCache();
    const key = cache ? await cacheKey(parsed) : null;
    if (cache && key) {
      const hit = await cache.match(key);
      if (hit) return json({ ...(await hit.json() as object), cached: true }, 200, origin);
    }

    if (inFlight >= MAX_IN_FLIGHT) {
      return fail('busy', 'ImmunoBot is very busy right now.', 503, origin, 10);
    }

    inFlight++;
    let busyFor = 0;
    try {
      const messages = withContext(parsed);
      for (const p of available) {
        try {
          const reply = await p.ask(env, messages);
          const body = { reply, provider: p.name };
          if (cache && key) {
            const stored = new Response(JSON.stringify(body), {
              headers: { 'Content-Type': 'application/json', 'Cache-Control': `max-age=${CACHE_TTL_S}` },
            });
            const put = cache.put(key, stored);
            if (ctx) ctx.waitUntil(put); else await put;
          }
          return json(body, 200, origin);
        } catch (e) {
          // Any failure (busy, error, timeout, network) moves on to the next
          // provider; remember if it was "busy" so the client gets a wait time.
          if (e instanceof UpstreamError && e.status === 429) busyFor = Math.max(busyFor, e.retryAfter ?? 20);
        }
      }
    } finally {
      inFlight--;
    }

    if (busyFor > 0) {
      return fail('busy', 'ImmunoBot has hit its usage limit for the moment.', 503, origin, Math.min(busyFor, 120));
    }
    return fail('upstream_error', "ImmunoBot couldn't reach its AI service.", 502, origin, 15);
  },
};
