import { Link } from 'react-router-dom';
import { useCookieConsent, CONSENT_KEY, GA_MEASUREMENT_ID } from '../lib/cookieConsent';
import './CookiePolicyPage.css';

const LAST_UPDATED = '25 October 2026';

interface StoredItem {
  name: string;
  type: string;
  category: 'Necessary' | 'Analytics';
  purpose: string;
  duration: string;
}

const STORED_ITEMS: StoredItem[] = [
  {
    name: CONSENT_KEY,
    type: 'Browser storage',
    category: 'Necessary',
    purpose: 'Remembers whether you chose "Necessary only" or "Accept all", so we don\'t ask on every visit.',
    duration: 'Until you clear your browser data',
  },
  {
    name: 'immunly_theme',
    type: 'Browser storage',
    category: 'Necessary',
    purpose: 'Remembers if you switched between dark and light mode. Only saved when you use the toggle.',
    duration: 'Until you clear your browser data',
  },
  {
    name: 'immunly_progress_guest, immunly_progress_<account>',
    type: 'Browser storage',
    category: 'Necessary',
    purpose: 'Saves your XP, level, streak, completed lessons and quiz scores so your progress is still here next time.',
    duration: 'Until you clear your browser data',
  },
  {
    name: 'immunly_accounts, immunly_user',
    type: 'Browser storage',
    category: 'Necessary',
    purpose: 'If you create an Immunly account, holds your account (name, email and password) and keeps you signed in. Accounts exist only in this browser; they are not sent to a server.',
    duration: 'Until you log out (sign-in) or clear your browser data (accounts)',
  },
  {
    name: '_ga',
    type: 'Cookie (Google Analytics)',
    category: 'Analytics',
    purpose: 'Gives your browser a random ID so Google Analytics can count visitors and visits without knowing who you are.',
    duration: '2 years',
  },
  {
    name: `_ga_${GA_MEASUREMENT_ID.replace('G-', '')}`,
    type: 'Cookie (Google Analytics)',
    category: 'Analytics',
    purpose: 'Keeps track of your current visit (session) for Google Analytics.',
    duration: '2 years',
  },
];

const CHOICE_LABELS = {
  denied: 'Necessary only',
  granted: 'All cookies accepted',
} as const;

export default function CookiePolicyPage() {
  const [consent, setConsent] = useCookieConsent();

  return (
    <div className="cookie-page page-content">
      <div className="container">
        <div className="cookie-header">
          <h1>Cookie Policy</h1>
          <p>How Immunly uses cookies and browser storage, and how to change your choice. Last updated {LAST_UPDATED}.</p>
        </div>

        <div className="cookie-layout">
          <article className="cookie-body">
            <section>
              <h2>What are cookies?</h2>
              <p>
                Cookies are small text files a website saves in your browser. Websites can also save information
                in your browser's local storage, which works in a similar way. In this policy, "cookies" means both.
              </p>
            </section>

            <section>
              <h2>The two kinds we use</h2>
              <p>
                <strong>Necessary</strong> cookies make the site work: they remember your theme, your sign-in and your
                learning progress. They are always on, and everything they hold stays in your browser.
              </p>
              <p>
                <strong>Analytics</strong> cookies come from Google Analytics and are only used if you choose
                "Accept all". They tell us which pages are popular, how people move through lessons, and roughly
                which country or region visitors are from, so we can improve Immunly.
              </p>
            </section>

            <section>
              <h2>Everything we store</h2>
              <div className="cookie-table-wrap">
                <table className="cookie-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Purpose</th>
                      <th>How long</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STORED_ITEMS.map(item => (
                      <tr key={item.name}>
                        <td>
                          <code>{item.name}</code>
                          <span className="cookie-table__type">{item.type}</span>
                        </td>
                        <td>
                          <span className={`cookie-tag ${item.category === 'Analytics' ? 'cookie-tag--optional' : ''}`}>
                            {item.category}
                          </span>
                        </td>
                        <td>{item.purpose}</td>
                        <td>{item.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2>How we use this information</h2>
              <ul>
                <li>Your progress, theme and account stay in your browser. Immunly does not keep them on a server.</li>
                <li>
                  If you accept analytics, Google Analytics receives the pages you visit, your browser and device type,
                  and an approximate location worked out from your IP address. We only look at this as totals, such as
                  how many people opened a lesson.
                </li>
                <li>We don't use advertising cookies, and we never sell or share this information with advertisers.</li>
                <li>
                  If you choose "Necessary only", the Google Analytics script is not loaded at all, so nothing is sent
                  to Google Analytics.
                </li>
              </ul>
            </section>

            <section>
              <h2>ImmunoBot</h2>
              <p>
                ImmunoBot, the AI tutor in the bottom-left corner, doesn't set cookies or save anything in your browser.
                Your chat disappears when you close or reload the page. When you send a question, it's passed through an
                Immunly server function on Cloudflare to an AI provider (Groq, with OpenRouter and Google's Gemini API
                as backups).
                Cloudflare briefly counts requests per IP address to prevent overuse. Details are in
                our <Link to="/privacy">Privacy Policy</Link>.
              </p>
            </section>

            <section>
              <h2>Other services the site uses</h2>
              <p>These don't set cookies on Immunly, but your browser connects to them, as with most websites:</p>
              <ul>
                <li><strong>Google Fonts</strong> supplies the site's typeface.</li>
                <li><strong>Wikimedia Commons</strong> hosts many of the photos in lessons.</li>
                <li>
                  <strong>Formspree</strong> delivers messages sent through the <Link to="/contact">Contact</Link> form,
                  including the name and email address you enter.
                </li>
                <li><strong>GitHub Pages</strong> hosts the website and may keep standard server logs, such as IP addresses.</li>
                <li>
                  <strong>Cloudflare</strong>, <strong>Groq</strong>, <strong>OpenRouter</strong> and{' '}
                  <strong>Google (Gemini API)</strong> handle ImmunoBot questions, only when you send one.
                </li>
              </ul>
            </section>

            <section>
              <h2>Changing your mind</h2>
              <p>
                You can change your choice at any time with the buttons on this page, which you can reach from the
                "Cookie Policy" link at the bottom of every page. Switching to "Necessary only" stops analytics and
                deletes the Google Analytics cookies from your browser. You can also clear everything Immunly has stored
                by deleting this site's data in your browser settings. That also removes your progress and any
                account you created.
              </p>
            </section>

            <section>
              <h2>Changes to this policy</h2>
              <p>If we change what Immunly stores, we'll update this page and the date at the top.</p>
            </section>

            <section>
              <h2>Questions</h2>
              <p>
                Email <a href="mailto:contact@immunly.org">contact@immunly.org</a> or use
                the <Link to="/contact">contact form</Link>. See also our <Link to="/privacy">Privacy Policy</Link> and{' '}
                <Link to="/terms">Terms of Use</Link>.
              </p>
            </section>
          </article>

          <aside className="cookie-choice card">
            <span className="cookie-choice__eyebrow">Your cookie settings</span>
            <strong className="cookie-choice__status">
              {consent ? CHOICE_LABELS[consent] : 'You haven\'t chosen yet'}
            </strong>
            <p>Necessary cookies are always on. Analytics are only used if you accept all.</p>
            <div className="cookie-choice__actions">
              <button
                className={`btn btn-outline ${consent === 'denied' ? 'cookie-choice__btn--active' : ''}`}
                onClick={() => setConsent('denied')}
                aria-pressed={consent === 'denied'}
              >
                Necessary only
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setConsent('granted')}
                aria-pressed={consent === 'granted'}
              >
                Accept all
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
