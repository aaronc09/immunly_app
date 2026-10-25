import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { MODULES } from '../data/curriculum';
import '../pages/LoginPage.css';
import './WelcomeIntro.css';

/** Fired by the home page's "Watch intro" button to replay this tour. */
export const PLAY_INTRO_EVENT = 'immunly:play-intro';
/** Fired by the cookie banner's policy link so the policy page isn't hidden. */
export const CLOSE_INTRO_EVENT = 'immunly:close-intro';

const BACKGROUNDS = ['/intro1.webp', '/intro2.webp'];
const CLOSE_MS = 450;
const SWIPE_PX = 50;

type AuthMode = 'login' | 'register';

interface TourSlide {
  key: string;
  tag: string;
  heading: React.ReactNode;
  body: string;
  extra?: React.ReactNode;
}

const TOUR: TourSlide[] = [
  {
    key: 'welcome',
    tag: 'Welcome to Immunly',
    heading: <>Unlock the power of your <span>immune system.</span></>,
    body: 'Immunly is your interactive guide to immunology, designed for curious minds, future researchers and lifelong learners.',
  },
  {
    key: 'learn',
    tag: `${MODULES.length} modules`,
    heading: <>From DNA to <span>CAR-T.</span></>,
    body: 'Start with genes and cells, then work up to how immunity fails, how we treat it, and how researchers study it.',
    extra: (
      <ul className="welcome-slide__chips">
        {MODULES.slice(0, 6).map(m => <li key={m.id}>{m.title}</li>)}
        <li className="welcome-slide__chips-more">+{MODULES.length - 6} more</li>
      </ul>
    ),
  },
  {
    key: 'how',
    tag: 'How it works',
    heading: <>Short lessons. <span>Real research.</span></>,
    body: 'Each lesson takes under ten minutes and links to the landmark papers behind it.',
    extra: (
      <ol className="welcome-slide__steps">
        <li><strong>Read</strong> a bite-sized lesson with real microscopy and diagrams.</li>
        <li><strong>Check</strong> yourself with a quick quiz at the end.</li>
        <li><strong>Keep</strong> a daily streak and earn XP as you level up.</li>
      </ol>
    ),
  },
  {
    key: 'research',
    tag: 'Beyond the classroom',
    heading: <>Find your way <span>into a lab.</span></>,
    body: 'A step-by-step research path: dry-lab projects you can start today, mentorship programs, competitions and in-person opportunities across the US.',
  },
];

export default function WelcomeIntro() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  // Shown automatically to signed-out visitors, and on demand via "Watch intro".
  const [open, setOpen] = useState(() => !user);
  const [closing, setClosing] = useState(false);
  const [slide, setSlide] = useState(0);

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);

  // Signed-in visitors replaying the tour don't need the sign-up slide.
  const slideCount = TOUR.length + (user ? 0 : 1);
  const lastSlide = slideCount - 1;

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, CLOSE_MS);
  }, []);

  const go = useCallback((i: number) => setSlide(Math.max(0, Math.min(lastSlide, i))), [lastSlide]);

  // "Watch intro" replays the tour from the first slide.
  useEffect(() => {
    const replay = () => {
      setSlide(0);
      setClosing(false);
      setOpen(true);
    };
    window.addEventListener(PLAY_INTRO_EVENT, replay);
    window.addEventListener(CLOSE_INTRO_EVENT, close);
    return () => {
      window.removeEventListener(PLAY_INTRO_EVENT, replay);
      window.removeEventListener(CLOSE_INTRO_EVENT, close);
    };
  }, [close]);

  // Close once someone signs in or registers from the last slide.
  const hadUser = useRef(!!user);
  useEffect(() => {
    if (user && !hadUser.current && open) close();
    hadUser.current = !!user;
  }, [user, open, close]);

  // Lock page scroll and listen for keys while the tour is open.
  useEffect(() => {
    if (!open) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (e.key === 'Escape') close();
      else if (!typing && e.key === 'ArrowRight') setSlide(s => Math.min(lastSlide, s + 1));
      else if (!typing && e.key === 'ArrowLeft') setSlide(s => Math.max(0, s - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, lastSlide]);

  // Off-screen slides can't be tabbed into or read by screen readers.
  useEffect(() => {
    const slides = trackRef.current?.children;
    if (!slides) return;
    Array.from(slides).forEach((el, i) => {
      if (i === slide) el.removeAttribute('inert');
      else el.setAttribute('inert', '');
    });
  }, [slide, open, slideCount]);

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === 'mouse') return; // mouse users have arrows and dots
    pointerStart.current = e.clientX;
  }

  function onPointerUp(e: React.PointerEvent) {
    if (pointerStart.current === null) return;
    const dx = e.clientX - pointerStart.current;
    pointerStart.current = null;
    if (dx <= -SWIPE_PX) go(slide + 1);
    else if (dx >= SWIPE_PX) go(slide - 1);
  }

  function continueAsGuest() {
    close();
    navigate('/');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let result;
      if (mode === 'login') {
        result = await login(email, password);
      } else {
        if (!name.trim()) {
          setError('Please enter your name.');
          return;
        }
        result = await register(name, email, password);
      }
      if (!result.ok) setError(result.error || 'Something went wrong.');
      // On success `user` updates and the effect above closes the tour.
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className={`welcome-overlay ${closing ? 'welcome-overlay--closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-roledescription="carousel"
      aria-label="Welcome to Immunly"
    >
      {/* Backgrounds alternate per slide and crossfade with a slow zoom */}
      {BACKGROUNDS.map((src, i) => (
        <div
          key={src}
          className={`welcome-overlay__bg ${slide % BACKGROUNDS.length === i ? 'welcome-overlay__bg--active' : ''}`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}
      <div className="welcome-overlay__scrim" />

      <div className="welcome-overlay__top">
        <Logo size={30} />
        <button className="welcome-overlay__skip" onClick={close}>
          {user ? 'Close' : 'Skip intro'}
        </button>
      </div>

      <div
        className="welcome-overlay__viewport"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { pointerStart.current = null; }}
      >
        <div
          ref={trackRef}
          className="welcome-overlay__track"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {TOUR.map((s, i) => (
            <section
              key={s.key}
              className={`welcome-slide ${i === slide ? 'welcome-slide--active' : ''}`}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slideCount}`}
            >
              <div className="welcome-slide__tag">{s.tag}</div>
              <h1 className="welcome-slide__heading">{s.heading}</h1>
              <p className="welcome-slide__body">{s.body}</p>
              {s.extra}
              <div className="welcome-slide__cta">
                {i === TOUR.length - 1 && user ? (
                  <button className="btn btn-primary" onClick={close}>Start learning →</button>
                ) : (
                  <button className="btn btn-primary" onClick={() => go(i + 1)}>
                    {i === 0 ? 'Take the tour →' : i === TOUR.length - 1 ? 'Get started →' : 'Next →'}
                  </button>
                )}
                {i === 0 && !user && (
                  <button className="btn btn-ghost" onClick={() => go(lastSlide)}>I have an account</button>
                )}
              </div>
            </section>
          ))}

          {!user && (
            <section
              className={`welcome-slide welcome-slide--auth ${slide === lastSlide ? 'welcome-slide--active' : ''}`}
              aria-roledescription="slide"
              aria-label={`${slideCount} of ${slideCount}`}
            >
              <div className="login-card card welcome-overlay__auth-card">
                <div className="login-card__logo">
                  <Logo size={36} />
                  <p>{mode === 'login' ? 'Welcome back!' : 'Create your free account'}</p>
                </div>

                <div className="login-tabs">
                  <button
                    className={`login-tab ${mode === 'login' ? 'login-tab--active' : ''}`}
                    onClick={() => { setMode('login'); setError(''); }}
                  >
                    Log in
                  </button>
                  <button
                    className={`login-tab ${mode === 'register' ? 'login-tab--active' : ''}`}
                    onClick={() => { setMode('register'); setError(''); }}
                  >
                    Register
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                  {mode === 'register' && (
                    <div className="login-field">
                      <label htmlFor="welcome-name">Your name</label>
                      <input
                        id="welcome-name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ada Lovelace"
                        required
                        autoComplete="name"
                      />
                    </div>
                  )}
                  <div className="login-field">
                    <label htmlFor="welcome-email">Email</label>
                    <input
                      id="welcome-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="login-field">
                    <label htmlFor="welcome-password">Password</label>
                    <input
                      id="welcome-password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'}
                      required
                      minLength={mode === 'register' ? 6 : 1}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                  </div>

                  {error && <div className="login-error">{error}</div>}

                  <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                    {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
                  </button>
                </form>

                <div className="login-footer-note">
                  {mode === 'login'
                    ? <>Don't have an account? <button className="login-switch" onClick={() => setMode('register')}>Register</button></>
                    : <>Already have an account? <button className="login-switch" onClick={() => setMode('login')}>Log in</button></>
                  }
                </div>

                <div className="login-divider"><span>or</span></div>

                <button className="btn btn-outline login-guest" onClick={continueAsGuest}>
                  Continue as guest →
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="welcome-overlay__nav">
        <span className="welcome-overlay__counter" aria-live="polite">
          {String(slide + 1).padStart(2, '0')} <span>/ {String(slideCount).padStart(2, '0')}</span>
        </span>
        <div className="welcome-overlay__controls">
          <button
            className="welcome-overlay__arrow"
            aria-label="Previous slide"
            disabled={slide === 0}
            onClick={() => go(slide - 1)}
          >
            ‹
          </button>
          <div className="welcome-overlay__dots">
            {Array.from({ length: slideCount }, (_, i) => (
              <button
                key={i}
                className={`welcome-overlay__dot ${i === slide ? 'welcome-overlay__dot--active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === slide}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button
            className="welcome-overlay__arrow"
            aria-label="Next slide"
            disabled={slide === lastSlide}
            onClick={() => go(slide + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
