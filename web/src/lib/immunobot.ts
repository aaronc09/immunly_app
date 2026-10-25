// Client for the ImmunoBot Worker (web/worker). The Worker holds the AI keys;
// this file only knows its public URL, set at build time.
export const IMMUNOBOT_URL: string | undefined = import.meta.env.VITE_IMMUNOBOT_URL || undefined;

export interface BotMessage {
  role: 'user' | 'assistant';
  content: string;
  /** Proof the server wrote this reply; sent back so history can't be faked. */
  sig?: string;
}

export interface BotReply {
  text: string;
  sig?: string;
  /** Set when the answer is one of ImmunoBot's fixed topic-limit replies. */
  guard?: string;
}

export type BotErrorCode =
  | 'not_configured' | 'rate_limited' | 'cooldown' | 'busy'
  | 'upstream_error' | 'network' | 'timeout' | 'bad_request' | 'forbidden';

export class BotError extends Error {
  code: BotErrorCode;
  /** Seconds to wait before trying again, when known. */
  retryAfter?: number;
  constructor(code: BotErrorCode, message: string, retryAfter?: number) {
    super(message);
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

// ── Browser-side limits ─────────────────────────────────────────────────────
// The Worker enforces the real limits; these stop one tab from hammering it
// and give instant feedback without a round trip.
export const MAX_QUESTION_CHARS = 1000;
export const MAX_CONTEXT_CHARS = 1500;
const COOLDOWN_MS = 3_000;
const WINDOW_MS = 5 * 60_000;
const MAX_PER_WINDOW = 10;
const REQUEST_TIMEOUT_MS = 30_000;

let inFlight = false;
const sentAt: number[] = [];

/** Milliseconds until this browser may send another question (0 = now). */
export function clientWaitMs(now = Date.now()): number {
  while (sentAt.length && now - sentAt[0] > WINDOW_MS) sentAt.shift();
  const last = sentAt[sentAt.length - 1];
  const cooldown = last ? Math.max(0, last + COOLDOWN_MS - now) : 0;
  const windowFull = sentAt.length >= MAX_PER_WINDOW ? sentAt[0] + WINDOW_MS - now : 0;
  return Math.max(cooldown, windowFull);
}

export async function askImmunoBot(input: {
  messages: BotMessage[];
  context?: string;
  page?: string;
}): Promise<BotReply> {
  if (!IMMUNOBOT_URL) {
    throw new BotError('not_configured', "ImmunoBot isn't switched on yet.");
  }
  if (inFlight) throw new BotError('cooldown', 'Wait for the current answer first.', 2);
  const wait = clientWaitMs();
  if (wait > 0) {
    throw new BotError('cooldown', "You're asking quickly.", Math.ceil(wait / 1000));
  }

  inFlight = true;
  sentAt.push(Date.now());
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    let res: Response;
    try {
      res = await fetch(IMMUNOBOT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: input.messages.slice(-12).map(m => ({ role: m.role, content: m.content, sig: m.sig })),
          context: input.context?.slice(0, MAX_CONTEXT_CHARS),
          page: input.page,
        }),
        signal: controller.signal,
      });
    } catch {
      throw controller.signal.aborted
        ? new BotError('timeout', 'ImmunoBot took too long to answer.')
        : new BotError('network', "Couldn't reach ImmunoBot. Check your connection.");
    }

    const data = await res.json().catch(() => null) as
      | { reply?: string; sig?: string; guard?: string; error?: { code?: BotErrorCode; message?: string; retryAfter?: number } }
      | null;

    if (res.ok && data?.reply) return { text: data.reply, sig: data.sig, guard: data.guard };

    const retryHeader = Number(res.headers.get('Retry-After'));
    const retryAfter = data?.error?.retryAfter ?? (Number.isFinite(retryHeader) && retryHeader > 0 ? retryHeader : undefined);
    const code: BotErrorCode = data?.error?.code
      ?? (res.status === 429 ? 'rate_limited' : res.status >= 500 ? 'upstream_error' : 'bad_request');
    throw new BotError(code, data?.error?.message || `Request failed (${res.status}).`, retryAfter);
  } finally {
    window.clearTimeout(timer);
    inFlight = false;
  }
}
