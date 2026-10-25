import { useEffect, useRef } from 'react';
import './ScrollEffects.css';

/**
 * Site-wide scroll polish, added without touching each page:
 *  - content blocks fade and rise in as they enter the viewport (siblings stagger)
 *  - a thin progress bar under the navbar fills as you scroll
 *  - the navbar gains a lit edge once the page has scrolled
 *  - the home hero drifts slower than the page (parallax)
 * Everything is skipped when the visitor prefers reduced motion.
 */

// Blocks that reveal on scroll. Leaf-level pieces, so nothing reveals twice.
const REVEAL_SELECTOR = [
  '[data-reveal]',
  '.section-title',
  '.section-sub',
  '.card',
  '.stats-bar__item',
  '.hero__text > *',
  '.cookie-body > section',
  '.courses-header',
  '.reference-header',
  '.contact-header',
  '.cookie-header',
].join(', ');

const STAGGER_MS = 70;
const MAX_STAGGER_STEPS = 5;
const SCROLLED_PX = 8;
const PARALLAX_LIMIT_PX = 1000;

export default function ScrollEffects() {
  const barRef = useRef<HTMLDivElement>(null);

  // ── Reveal on scroll ────────────────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.getElementById('root');
    if (!root) return;

    const seen = new WeakSet<Element>();

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        el.classList.add('is-revealed');
        // Once in place, drop the reveal styles so hover transitions behave normally.
        const done = () => {
          el.classList.remove('reveal', 'is-revealed');
          el.style.removeProperty('--reveal-delay');
        };
        el.addEventListener('transitionend', done, { once: true });
        window.setTimeout(done, 1200); // in case transitionend never fires
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    const scan = () => {
      root.querySelectorAll<HTMLElement>(`.page-transition :is(${REVEAL_SELECTOR})`).forEach(el => {
        if (seen.has(el)) return;
        seen.add(el);
        // Stagger relative to sibling blocks, e.g. cards in the same grid.
        const siblings = el.parentElement
          ? Array.from(el.parentElement.children).filter(c => c.matches(REVEAL_SELECTOR))
          : [el];
        const step = Math.min(siblings.indexOf(el), MAX_STAGGER_STEPS);
        el.style.setProperty('--reveal-delay', `${Math.max(0, step) * STAGGER_MS}ms`);
        el.classList.add('reveal');
        io.observe(el);
      });
    };

    scan();
    // Pages load lazily and tabs swap content, so keep watching for new blocks.
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; scan(); });
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  // ── Progress bar, navbar edge, hero parallax ────────────────────────────────
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      document.querySelector('.navbar')?.classList.toggle('navbar--scrolled', y > SCROLLED_PX);
      if (!reduce && y < PARALLAX_LIMIT_PX) {
        document.querySelector<HTMLElement>('.hero')?.style.setProperty('--scroll-y', String(y));
      }
    };

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
}
