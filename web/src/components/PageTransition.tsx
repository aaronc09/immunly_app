import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getConsent } from '../lib/cookieConsent';
import './PageTransition.css';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fades in routed page content on every navigation instead of the instant,
 * jarring swap React Router does by default. Keying on pathname forces a
 * remount, which re-triggers the CSS fade-in animation each time.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // GA's automatic pageview only fires once on initial load (send_page_view
    // is off in index.html); React Router navigations don't trigger a real
    // page load, so each route change has to be reported manually — and only
    // when the visitor accepted analytics cookies.
    if (getConsent() !== 'granted') return;
    window.gtag?.('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  return (
    <div key={location.pathname} className="page-transition">
      {children}
    </div>
  );
}
