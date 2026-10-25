/**
 * ImmunoBot topic limits.
 *
 * Two layers:
 *  1. screen(): quick checks on the student's own words, run BEFORE any AI
 *     call, for the cases we must never pass along: anything suggesting the
 *     student may be in crisis, requests for counselling, requests to write
 *     code, and abuse. These get a fixed reply and never reach the model.
 *  2. The model is instructed to reply with a bare [[TAG]] for anything else
 *     out of scope (including unsafe requests, which are the model's own
 *     judgment call). fromModel() turns that tag — or any reply that slipped
 *     through containing code — into the same fixed reply, so the model can't
 *     be argued into a long answer.
 *
 * A possible crisis is never ignored: it always gets a caring, fixed reply
 * with helpline details, but ImmunoBot does not counsel or continue the topic.
 */

export type Guard = 'crisis' | 'unsafe' | 'therapy' | 'coding' | 'abuse' | 'off_topic';

export const GUARD_REPLIES: Record<Guard, string> = {
  crisis:
    "I'm really sorry you're feeling this way. I'm only a study helper, so I can't give you the support you deserve — but you don't have to go through this alone.\n\n" +
    '- In the US, call or text **988** (Suicide & Crisis Lifeline), any time, day or night.\n' +
    '- Or text **HOME** to **741741** (Crisis Text Line).\n' +
    '- Outside the US, find a free helpline at https://findahelpline.com\n' +
    '- If you are in immediate danger, call your local emergency number (911 in the US).\n\n' +
    'Please also tell someone you trust today — a parent, teacher or school counsellor.',
  unsafe:
    "I can't help with that. If anyone is in danger right now, call your local emergency number (911 in the US) or tell a trusted adult.\n\n" +
    "I'm happy to explain how the immune system protects us instead.",
  therapy:
    "I'm a study helper for immunology, so I can't offer counselling or emotional support — a school counsellor, a trusted adult or a doctor is a much better person to talk to.\n\n" +
    'If things ever feel overwhelming or unsafe, you can call or text **988** (US) or visit https://findahelpline.com to talk to someone free, any time.',
  coding:
    "I can't write, fix or review code — I'm here for immunology and biology. I can explain the science behind a research method, like what RNA-seq measures or how flow cytometry works, if that helps.",
  abuse:
    "Let's keep things respectful. I'm happy to help with any immunology or biology question.",
  off_topic:
    'I can only help with immunology, biology and science research. Try asking me something like "How do vaccines work?" or "What does a B cell do?"',
};

// ── Layer 1: quick checks on the student's message ──────────────────────────
// Checked in order, so safety wins over everything else.

/** Phrases a student in crisis is likely to use about themselves. */
const CRISIS = new RegExp(
  [
    String.raw`\bsuicid(e|al)\b`,
    String.raw`\bkill(ing)?\s+my\s?self\b`,
    String.raw`\bend(ing)?\s+(my\s+life|it\s+all)\b`,
    String.raw`\btake\s+my\s+own\s+life\b`,
    String.raw`\b(want|wanted|going|plan(ning)?)\s+to\s+die\b`,
    String.raw`\bwanna\s+die\b`,
    String.raw`\bself[\s-]?harm`,
    String.raw`\b(harm|hurt|cut|cutting)\s+my\s?self\b`,
    String.raw`\bno\s+reason\s+to\s+live\b`,
    String.raw`\bbetter\s+off\s+dead\b`,
    String.raw`\bdon'?t\s+want\s+to\s+(live|exist|be\s+alive)\b`,
  ].join('|'),
  'i',
);

/** Biology uses "cell suicide" for apoptosis — that's a lesson, not a crisis. */
const CELL_BIOLOGY = /\b(cell|cells|cellular|programmed|apoptosis|apoptotic)\b[^.?!]{0,40}\bsuicid|\bsuicid[^.?!]{0,40}\b(cell|cells|apoptosis)\b/i;

/** Asking ImmunoBot to act as a counsellor or talk through feelings. */
const THERAPY = new RegExp(
  [
    String.raw`\b(be|act as|pretend to be|you'?re)\s+(my\s+)?(therapist|counsell?or|psychiatrist|psychologist)\b`,
    String.raw`\b(therapy|counsell?ing)\s+(session|for\s+me)\b`,
    String.raw`\bdiagnose\s+(me|my)\b`,
    String.raw`\b(i\s+(feel|am|'m)\s+(so\s+)?(depressed|hopeless|worthless|suicidal))\b`,
    String.raw`\bi\s+(have|think\s+i\s+have)\s+(depression|anxiety|an?\s+eating\s+disorder)\b`,
    String.raw`\bhelp\s+me\s+(with\s+)?(my\s+)?(depression|anxiety|mental\s+health)\b`,
    String.raw`\btalk\s+to\s+(you|someone)\s+about\s+my\s+(feelings|problems)\b`,
  ].join('|'),
  'i',
);

/** Requests to produce or debug code. */
const CODING = new RegExp(
  [
    String.raw`\b(write|give|show|make|generate|create|fix|debug|refactor|review)\s+(me\s+)?(a\s+|an\s+|some\s+|the\s+)?(code|script|program|function|class|app|website|query|regex|snippet)\b`,
    String.raw`\bcode\s+(this|that|it|for\s+me)\b`,
    String.raw`\bwrite\s+(it\s+)?in\s+(python|java|javascript|typescript|c\+\+|c#|rust|go|ruby|php|sql|r)\b`,
    String.raw`\b(python|javascript|typescript|java|sql|html|css)\s+(code|script|program|function|snippet)\b`,
    String.raw`\bleetcode\b|\bhomework\s+code\b`,
    String.raw`\b(implement|program)\s+(a|an|the)\s+\w+\s+(algorithm|function|class)\b`,
  ].join('|'),
  'i',
);

/** Slurs and abuse aimed at the bot or anyone else. Deliberately short. */
const ABUSE = new RegExp(
  [
    String.raw`\b(fuck|fucking|shit|bitch|bastard|asshole|dickhead|cunt)\b`,
    String.raw`\byou'?re\s+(so\s+)?(stupid|useless|dumb|trash|garbage|worthless)\b`,
    String.raw`\b(shut\s+up|stfu)\b`,
  ].join('|'),
  'i',
);

/** Attempts to replace the bot's rules ("ignore your instructions", etc.). */
const OVERRIDE = new RegExp(
  [
    String.raw`\bignore\s+(all\s+|your\s+|previous\s+|above\s+|prior\s+)*(instructions?|rules?|prompt|guidelines?)\b`,
    String.raw`\bdisregard\s+(your|all|previous)\s+(instructions?|rules?)\b`,
    String.raw`\b(you\s+are\s+no\s+longer|forget\s+(that\s+)?you(\s+are|'re))\b`,
    String.raw`\b(dan\s+mode|developer\s+mode|jailbreak)\b`,
    String.raw`\bsystem\s+prompt\b`,
    String.raw`\bpretend\s+(you\s+)?(are|have)\s+no\s+(rules|restrictions|limits)\b`,
    String.raw`\bwithout\s+(any\s+)?(restrictions|filters|rules)\b`,
  ].join('|'),
  'i',
);

/**
 * Checks the student's own words. Returns a Guard when ImmunoBot should give
 * a fixed reply without calling the AI at all, or null to continue.
 */
export function screen(text: string): Guard | null {
  const t = text.replace(/\s+/g, ' ').trim();
  if (CRISIS.test(t) && !CELL_BIOLOGY.test(t)) return 'crisis';
  if (THERAPY.test(t)) return 'therapy';
  if (CODING.test(t)) return 'coding';
  if (ABUSE.test(t)) return 'abuse';
  if (OVERRIDE.test(t)) return 'off_topic';
  return null;
}

// ── Layer 2: checking what the model produced ───────────────────────────────

const TAGS: Record<string, Guard> = {
  CRISIS: 'crisis',
  UNSAFE: 'unsafe',
  THERAPY: 'therapy',
  CODING: 'coding',
  ABUSE: 'abuse',
  OFFTOPIC: 'off_topic',
};

/** A fenced code block, or several lines that read like source code. */
const LOOKS_LIKE_CODE = /```|\n\s*(def |class |function |import |#include|<\?php|public static|console\.log\(|print\()/;

/**
 * Turns a model reply into either the text to send, or a Guard whose fixed
 * reply should be sent instead.
 */
export function fromModel(reply: string): { text: string } | { guard: Guard } {
  const tag = reply.trim().match(/^\[\[([A-Z]+)\]\]/);
  if (tag && TAGS[tag[1]]) return { guard: TAGS[tag[1]] };
  // A stray tag anywhere in the reply still means the model wanted to refuse.
  const loose = reply.match(/\[\[([A-Z]+)\]\]/);
  if (loose && TAGS[loose[1]]) return { guard: TAGS[loose[1]] };
  if (LOOKS_LIKE_CODE.test(reply)) return { guard: 'coding' };
  return { text: reply };
}
