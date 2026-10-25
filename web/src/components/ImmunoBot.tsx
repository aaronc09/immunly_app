import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IMMUNOBOT_URL, askImmunoBot, clientWaitMs, BotError, BotMessage,
  MAX_QUESTION_CHARS, MAX_CONTEXT_CHARS,
} from '../lib/immunobot';
import './ImmunoBot.css';

interface ChatEntry extends BotMessage {
  /** Set on a failed request; the bubble then offers "Try again". */
  failed?: { code: BotError['code']; message: string; retryAfter?: number; context?: string };
  context?: string;
  /** Set when ImmunoBot declined the topic, so the bubble is styled calmly. */
  guard?: string;
}

interface TextSelection { text: string; x: number; y: number; below: boolean }

const SUGGESTIONS = [
  'What does a T cell actually do?',
  'How do vaccines train the immune system?',
  'Explain antibodies like I’m new to this',
];

const EXPLAIN_PROMPT = 'Can you explain this in simple terms?';

/** Friendly wording for each failure, shown in the chat. */
function failureText(code: BotError['code'], fallback: string) {
  switch (code) {
    case 'busy': return 'Request failed: ImmunoBot is busy right now because lots of students are asking at once.';
    case 'rate_limited':
    case 'cooldown': return "You're asking a little quickly. Give it a moment.";
    case 'timeout': return 'Request failed: ImmunoBot took too long to answer.';
    case 'network': return "Request failed: couldn't reach ImmunoBot. Check your internet connection.";
    case 'not_configured': return "ImmunoBot isn't switched on yet. Check back soon.";
    case 'upstream_error': return "Request failed: ImmunoBot's AI service had a problem.";
    default: return `Request failed: ${fallback}`;
  }
}

/** The page a question was asked from, so answers can refer to it. */
function pageTitle() {
  const h1 = document.querySelector('.page-transition h1');
  return (h1?.textContent || document.title).trim().slice(0, 120);
}

/** Minimal, safe formatting for replies: paragraphs, "- " lists, **bold**. */
function FormattedReply({ text }: { text: string }) {
  // **bold** and bare https:// links (helpline links must be clickable).
  const inline = (line: string, key: number) => (
    <React.Fragment key={key}>
      {line.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (/^https?:\/\//.test(part)) {
          return (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer">
              {part.replace(/^https?:\/\//, '')}
            </a>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </React.Fragment>
  );

  // Group consecutive lines into paragraphs and bullet lists, so a sentence
  // followed by "- " lines renders as a paragraph and then a list.
  const BULLET = /^\s*([-*•]|\d+[.)])\s+/;
  const groups: { list: boolean; lines: string[] }[] = [];
  for (const raw of text.split('\n')) {
    if (!raw.trim()) { groups.push({ list: false, lines: [] }); continue; }
    const list = BULLET.test(raw);
    const prev = groups[groups.length - 1];
    if (prev && prev.list === list && prev.lines.length) prev.lines.push(raw);
    else groups.push({ list, lines: [raw] });
  }
  return (
    <>
      {groups.filter(g => g.lines.length).map((g, b) => g.list ? (
        <ul key={b}>
          {g.lines.map((l, i) => <li key={i}>{inline(l.replace(BULLET, ''), i)}</li>)}
        </ul>
      ) : (
        <p key={b}>{g.lines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{inline(l, i)}</React.Fragment>)}</p>
      ))}
    </>
  );
}

/** The ImmunoBot mark: a small round bot with an antenna. */
function BotMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <line x1="16" y1="4.5" x2="16" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="4" r="2" fill="currentColor" />
      <rect x="5" y="9" width="22" height="17" rx="8.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="17.5" r="2.2" fill="currentColor" />
      <circle cx="20" cy="17.5" r="2.2" fill="currentColor" />
      <path d="M13 22.2c1.8 1.1 4.2 1.1 6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function ImmunoBot() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<TextSelection | null>(null);
  const [now, setNow] = useState(Date.now());
  const [blockedUntil, setBlockedUntil] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Tick once a second while a wait is running, for countdowns.
  const waiting = blockedUntil > now;
  useEffect(() => {
    if (!waiting) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [waiting]);
  const waitSeconds = Math.max(0, Math.ceil((blockedUntil - now) / 1000));

  // Keep the newest message in view.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [entries, loading]);

  // Esc closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Offer "Ask ImmunoBot" when page text is highlighted.
  useEffect(() => {
    let t = 0;
    const read = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const sel = window.getSelection();
        const text = sel?.toString().replace(/\s+/g, ' ').trim() ?? '';
        if (!sel || sel.rangeCount === 0 || text.length < 3) { setSelection(null); return; }
        const node = sel.anchorNode instanceof Element ? sel.anchorNode : sel.anchorNode?.parentElement;
        // Only content on the page, not inputs or the chat itself.
        if (!node?.closest('.page-transition') || node.closest('input, textarea, .immunobot')) {
          setSelection(null);
          return;
        }
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        if (!rect.width && !rect.height) { setSelection(null); return; }
        const below = rect.top < 120;
        setSelection({
          text: text.slice(0, MAX_CONTEXT_CHARS),
          x: Math.min(window.innerWidth - 90, Math.max(90, rect.left + rect.width / 2)),
          y: below ? rect.bottom + 10 : rect.top - 10,
          below,
        });
      }, 120);
    };
    const clear = () => setSelection(null);
    document.addEventListener('selectionchange', read);
    window.addEventListener('scroll', clear, { passive: true });
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('selectionchange', read);
      window.removeEventListener('scroll', clear);
    };
  }, []);

  const openPanel = useCallback(() => {
    setOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  function askAboutSelection() {
    if (!selection) return;
    setContext(selection.text);
    setInput(EXPLAIN_PROMPT);
    setSelection(null);
    window.getSelection()?.removeAllRanges();
    openPanel();
  }

  async function send(question: string, passage: string | null, history: ChatEntry[]) {
    const text = question.trim().slice(0, MAX_QUESTION_CHARS);
    if (!text || loading) return;

    const wait = clientWaitMs();
    if (wait > 0) {
      setBlockedUntil(Date.now() + wait);
      setNow(Date.now());
      return;
    }

    const userEntry: ChatEntry = { role: 'user', content: text, context: passage ?? undefined };
    const clean = history.filter(e => !e.failed);
    setEntries([...clean, userEntry]);
    setInput('');
    setContext(null);
    setLoading(true);

    try {
      const reply = await askImmunoBot({
        messages: [...clean, userEntry].map(({ role, content, sig }) => ({ role, content, sig })),
        context: passage ?? undefined,
        page: pageTitle(),
      });
      setEntries(prev => [...prev, { role: 'assistant', content: reply.text, sig: reply.sig, guard: reply.guard }]);
    } catch (e) {
      const err = e instanceof BotError ? e : new BotError('network', 'Something went wrong.');
      if (err.retryAfter) {
        setBlockedUntil(Date.now() + err.retryAfter * 1000);
        setNow(Date.now());
      }
      setEntries(prev => [...prev, {
        role: 'assistant',
        content: failureText(err.code, err.message),
        failed: { code: err.code, message: err.message, retryAfter: err.retryAfter, context: passage ?? undefined },
      }]);
    } finally {
      setLoading(false);
    }
  }

  function retry() {
    // Re-send the question that failed, without the failure bubble.
    const lastFail = entries[entries.length - 1];
    const lastUser = [...entries].reverse().find(e => e.role === 'user');
    if (!lastFail?.failed || !lastUser) return;
    const history = entries.slice(0, entries.lastIndexOf(lastUser));
    send(lastUser.content, lastFail.failed.context ?? null, history);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input, context, entries);
  }

  // Hidden on the live site until the Worker URL is configured; visible in dev.
  if (!IMMUNOBOT_URL && !import.meta.env.DEV) return null;

  const last = entries[entries.length - 1];
  const canSend = input.trim().length > 0 && !loading && !waiting;

  return (
    <div className="immunobot">
      {selection && !open && (
        <button
          className={`immunobot-ask ${selection.below ? 'immunobot-ask--below' : ''}`}
          style={{ left: selection.x, top: selection.y }}
          // Keep the highlight alive until the click lands.
          onMouseDown={e => e.preventDefault()}
          onClick={askAboutSelection}
        >
          <BotMark size={16} /> Ask ImmunoBot
        </button>
      )}

      {open && (
        <div ref={panelRef} className="immunobot-panel" role="dialog" aria-label="ImmunoBot chat">
          <header className="immunobot-panel__head">
            <span className="immunobot-panel__mark"><BotMark size={22} /></span>
            <div className="immunobot-panel__title">
              <strong>ImmunoBot</strong>
              <span>Your immunology tutor</span>
            </div>
            <button className="immunobot-panel__close" onClick={() => setOpen(false)} aria-label="Close ImmunoBot">
              Close
            </button>
          </header>

          <div ref={listRef} className="immunobot-panel__list" aria-live="polite">
            {entries.length === 0 && (
              <div className="immunobot-intro">
                <p>Ask anything about immunology, or highlight text on any page and choose <strong>Ask ImmunoBot</strong>.</p>
                <div className="immunobot-intro__chips">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => send(s, null, entries)} disabled={loading || waiting}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {entries.map((e, i) => (
              <div
                key={i}
                className={`immunobot-msg immunobot-msg--${e.role} ${e.failed ? 'immunobot-msg--failed' : ''} ${e.guard ? 'immunobot-msg--guard' : ''}`}
              >
                {e.context && <blockquote className="immunobot-msg__quote">{e.context}</blockquote>}
                {e.role === 'assistant' && !e.failed ? <FormattedReply text={e.content} /> : <p>{e.content}</p>}
                {e.failed && e === last && e.failed.code !== 'not_configured' && (
                  <button className="immunobot-msg__retry" onClick={retry} disabled={loading || waiting}>
                    {waiting ? `Try again in ${waitSeconds}s` : 'Try again'}
                  </button>
                )}
              </div>
            ))}

            {loading && (
              <div className="immunobot-msg immunobot-msg--assistant immunobot-msg--typing" aria-label="ImmunoBot is typing">
                <span /><span /><span />
              </div>
            )}
          </div>

          <form className="immunobot-panel__form" onSubmit={onSubmit}>
            {context && (
              <div className="immunobot-context">
                <span className="immunobot-context__label">About this passage</span>
                <p>{context}</p>
                <button type="button" onClick={() => setContext(null)} aria-label="Remove passage">Remove</button>
              </div>
            )}
            <div className="immunobot-panel__row">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value.slice(0, MAX_QUESTION_CHARS))}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (canSend) send(input, context, entries); }
                }}
                placeholder="Ask about immunology…"
                rows={1}
                aria-label="Your question"
              />
              <button type="submit" className="btn btn-primary" disabled={!canSend}>
                {waiting && !loading ? `${waitSeconds}s` : 'Send'}
              </button>
            </div>
            <p className="immunobot-panel__note">
              AI answers can be wrong and aren't medical advice. Don't share personal details.{' '}
              <Link to="/privacy" onClick={() => setOpen(false)}>Privacy</Link>
            </p>
          </form>
        </div>
      )}

      <button
        className={`immunobot-launcher ${open ? 'immunobot-launcher--open' : ''}`}
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-label={open ? 'Close ImmunoBot' : 'Ask ImmunoBot'}
        aria-expanded={open}
        title="Ask ImmunoBot"
      >
        <BotMark />
      </button>
    </div>
  );
}
