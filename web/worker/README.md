# ImmunoBot setup

ImmunoBot is the floating chat in the bottom-left of immunly.org. The website is
static (GitHub Pages), so it can't hold an API key: anything in the site's code
is visible to every visitor. This folder is a small **Cloudflare Worker** that
holds the keys and talks to the AI provider for the site.

```
browser ──▶ Worker (Cloudflare, holds keys, rate limits) ──▶ Groq ─(busy/down)─▶ OpenRouter ─▶ Gemini
```

Until the Worker is deployed and its URL is set, the ImmunoBot button is hidden
on the live site (it still shows in `npm run dev`).

## 1. Get free accounts and keys

| What | Where | Notes |
|---|---|---|
| **Groq** (main AI provider) | https://console.groq.com/keys | No card needed. Free tier is about 30 requests/minute and 1,000/day for the default model, with a per-minute token cap. Limits are per account, so extra keys don't add capacity. |
| **OpenRouter** (optional backup) | https://openrouter.ai/keys | Uses `openrouter/free`, which picks any free model that's available. Free models allow about 20 requests/minute and 50/day, or 1,000/day once the account has bought $10 of credits. Some free models may log or train on prompts. Check OpenRouter's privacy settings for your account. |
| **Google Gemini** (optional second backup) | https://aistudio.google.com/apikey | No card needed. Free tier is about 10 requests/minute. On the free tier Google may use prompts to improve its products. The Privacy Policy already says so. Enable billing on the project to opt out. |
| **Cloudflare** (runs the Worker) | https://dash.cloudflare.com/sign-up | Workers free plan: 100,000 requests/day. |

Free limits change often. Check each provider's dashboard for the numbers on
your account. If a model ID stops working, change `GROQ_MODEL` /
`OPENROUTER_MODEL` / `GEMINI_MODEL` in `wrangler.toml` (Groq lists current
models at https://console.groq.com/docs/models).

Every key is optional, but you need at least one. They're tried in the order
Groq → OpenRouter → Gemini, and a provider is only used if the one before it is
busy or down.

## 2. Deploy the Worker

```bash
cd web/worker
npx wrangler login                     # opens Cloudflare in your browser
npx wrangler secret put GROQ_API_KEY       # paste the Groq key when asked
npx wrangler secret put OPENROUTER_API_KEY # optional backup
npx wrangler secret put GEMINI_API_KEY     # optional second backup
npx wrangler deploy
```

`deploy` prints the Worker's URL, e.g. `https://immunobot.<you>.workers.dev`.

## 3. Point the website at it

In GitHub: **Settings → Secrets and variables → Actions → Variables → New
repository variable**, name `IMMUNOBOT_URL`, value = the Worker URL. The next
push to `main` builds the site with ImmunoBot switched on.

For local development, create `web/.env.local`:

```
VITE_IMMUNOBOT_URL=https://immunobot.<you>.workers.dev
```

To run the Worker locally instead, put the keys in `web/worker/.dev.vars`
(git-ignored):

```
GROQ_API_KEY=...
OPENROUTER_API_KEY=...
GEMINI_API_KEY=...
```

then run `npx wrangler dev` (serves on http://localhost:8787) and set
`VITE_IMMUNOBOT_URL=http://localhost:8787`.

## Limits and what happens under load

Each layer protects the next one. Whatever fails, the student sees a clear
"Request failed" message in the chat, with a wait time when one is known and a
**Try again** button.

| Layer | Limit | When it's hit |
|---|---|---|
| Browser | One question at a time, 3 s between questions, 10 per 5 minutes, 1,000 characters per question | Send button counts down |
| Worker, per visitor | 6 questions per minute per IP (`[[ratelimits]]` in `wrangler.toml`) | "You're asking a little quickly" |
| Worker, per instance | 24 AI calls in flight at once | "ImmunoBot is busy", try again in 10 s |
| Worker, cache | Identical first questions are answered from cache for 24 h | No AI call used |
| AI provider | Groq, then OpenRouter, then Gemini, each only if the one before is busy or down | "ImmunoBot is busy", with the provider's wait time |
| Timeouts | 20 s for the AI, 30 s in the browser | "took too long to answer" |

**About 1,000 students at once.** The rate limiters keep things fair and stop
abuse. They can't create capacity the free tiers don't have. Free Groq's token cap
allows roughly 10 typical answers a minute. Free OpenRouter adds up to 20 a minute,
but only 50 a day without credits, and free Gemini roughly 10 a minute more.
If 1,000 students each asked one question a minute, about 30–40 would get an answer
and the rest would see "ImmunoBot is busy, try again in N seconds". Nothing would
crash or hang. To actually serve that many people, move Groq to its paid
Developer tier (about 10× the free limits, pay per token). Then raise the
per-IP limit in `wrangler.toml` and `MAX_IN_FLIGHT` in `src/index.ts` if needed.

## Privacy

The Worker doesn't store conversations or log message text. It keeps short-lived
per-IP rate-limit counters and caches answers to repeated first questions
(question and answer only) for 24 hours. The Privacy Policy, Terms of Use and
Cookie Policy pages describe this. Update them if you change providers or what
the Worker stores.
