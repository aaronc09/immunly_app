import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCookieConsent } from '../lib/cookieConsent';
import { CLOSE_INTRO_EVENT } from './WelcomeIntro';
import './CookieConsent.css';

/** CSS variable the welcome tour reads to keep its controls above this banner. */
const HEIGHT_VAR = '--cookie-banner-h';

// Pops up for first-time visitors, on top of the welcome tour, until they choose.
export default function CookieConsent() {
  const [consent, setConsent] = useCookieConsent();
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  // The policy page has its own choice buttons.
  const visible = consent === null && pathname !== '/cookies';

  // Publish the banner's height (plus its bottom gap) while it's on screen.
  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!visible || !el) {
      root.style.removeProperty(HEIGHT_VAR);
      return;
    }
    const update = () => root.style.setProperty(HEIGHT_VAR, `${el.offsetHeight + 16}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty(HEIGHT_VAR);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div ref={ref} className="cookie-consent" role="dialog" aria-label="Cookie consent">
      <div className="cookie-consent__title">
        <h4>Cookies on Immunly</h4>
      </div>
      <p>
        We use necessary cookies and browser storage to keep you signed in and save your theme and
        learning progress. With your permission we also use Google Analytics to see which pages are
        popular and roughly where visitors are from. No data is sold or shared with advertisers.{' '}
        {/* Close the tour too, or the policy page would open hidden behind it */}
        <Link to="/cookies" onClick={() => window.dispatchEvent(new Event(CLOSE_INTRO_EVENT))}>
          Read our Cookie Policy
        </Link>
      </p>
      <div className="cookie-consent__actions">
        <button className="btn btn-outline" onClick={() => setConsent('denied')}>Necessary only</button>
        <button className="btn btn-primary" onClick={() => setConsent('granted')}>Accept all</button>
      </div>
    </div>
  );
}
