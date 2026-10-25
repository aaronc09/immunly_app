import { useEffect, useState } from 'react';

// The visitor's cookie choice. index.html reads the same key before React
// starts, so analytics only loads on later visits if the choice was 'granted'.
export const CONSENT_KEY = 'immunly_cookie_consent';
export const GA_MEASUREMENT_ID = 'G-TPJ9F0QZKH';

// 'denied'  = necessary only (shown to visitors as "Necessary only")
// 'granted' = necessary + Google Analytics ("Accept all")
export type ConsentValue = 'granted' | 'denied';

const CHANGE_EVENT = 'immunly:consent-change';

export function getConsent(): ConsentValue | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: ConsentValue) {
  const wasGranted = getConsent() === 'granted';
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  window.gtag?.('consent', 'update', { analytics_storage: value });
  if (value === 'granted') {
    loadAnalytics();
    // PageTransition skipped this page while consent was missing; count it now.
    if (!wasGranted) {
      window.gtag?.('event', 'page_view', {
        page_path: window.location.pathname + window.location.search,
        page_title: document.title,
      });
    }
  } else {
    clearAnalyticsCookies();
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: value }));
}

/** Injects gtag.js once. Until this runs, no request reaches Google Analytics. */
export function loadAnalytics() {
  if (document.querySelector('script[data-immunly-ga]')) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.dataset.immunlyGa = 'true';
  document.head.appendChild(script);
}

/** Removes the _ga cookies Google Analytics set while consent was granted. */
function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const parts = host.split('.');
  const domains = ['', host, `.${host}`];
  if (parts.length > 2) domains.push(`.${parts.slice(-2).join('.')}`);

  document.cookie.split(';').forEach(c => {
    const name = c.split('=')[0].trim();
    if (!name.startsWith('_ga')) return;
    domains.forEach(d => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ''}`;
    });
  });
}

/** Current choice, kept in sync between the banner and the policy page. */
export function useCookieConsent(): [ConsentValue | null, (value: ConsentValue) => void] {
  const [consent, setLocal] = useState<ConsentValue | null>(getConsent);

  useEffect(() => {
    const onChange = (e: Event) => setLocal((e as CustomEvent<ConsentValue>).detail);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, []);

  return [consent, setConsent];
}
