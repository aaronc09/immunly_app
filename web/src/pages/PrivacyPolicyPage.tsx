import { Link } from 'react-router-dom';
import './CookiePolicyPage.css';

const LAST_UPDATED = '25 October 2026';

export default function PrivacyPolicyPage() {
  return (
    <div className="cookie-page page-content">
      <div className="container">
        <div className="cookie-header">
          <h1>Privacy Policy</h1>
          <p>What Immunly collects, where it goes, and the choices you have. Last updated {LAST_UPDATED}.</p>
        </div>

        <article className="cookie-body legal-body">
          <section className="legal-summary">
            <h2>The short version</h2>
            <ul>
              <li>Your progress, theme and any account you create are saved in your own browser, not on our servers.</li>
              <li>We only use Google Analytics if you choose "Accept all" in the cookie banner.</li>
              <li>If you use ImmunoBot, the question you type (and any text you highlighted) is sent to an AI service to write the answer. We don't save your conversations.</li>
              <li>We never sell your information or share it with advertisers.</li>
            </ul>
          </section>

          <section>
            <h2>Who we are</h2>
            <p>
              Immunly (immunly.org) is a free website that teaches immunology and biomedical research. You can reach
              us at <a href="mailto:contact@immunly.org">contact@immunly.org</a>.
            </p>
          </section>

          <section>
            <h2>Information saved in your browser</h2>
            <p>
              Immunly saves a few things in your browser's local storage so the site works: your cookie choice, your
              light or dark mode choice, and your learning progress (XP, streak, completed lessons and quiz scores).
            </p>
            <p>
              If you create an Immunly account, your name, email and password are also saved in this browser only.
              They are not sent to a server, so an account doesn't follow you to another device, and anyone using
              this browser could see it. Please use a password you don't use anywhere else.
            </p>
            <p>The full list, with how long each item is kept, is in our <Link to="/cookies">Cookie Policy</Link>.</p>
          </section>

          <section>
            <h2>Analytics (only if you agree)</h2>
            <p>
              If you choose "Accept all", Google Analytics records the pages you visit, your browser and device type,
              and an approximate location worked out from your IP address. We look at this only as totals, such as how
              many people opened a lesson. If you choose "Necessary only", the analytics script isn't loaded at all.
              You can change your choice at any time in the <Link to="/cookies">Cookie Policy</Link>.
            </p>
          </section>

          <section>
            <h2>ImmunoBot, our AI tutor</h2>
            <p>When you send ImmunoBot a message, these things are sent to get an answer:</p>
            <ul>
              <li>your question and the earlier messages in the same chat;</li>
              <li>any passage you highlighted and asked about;</li>
              <li>the title of the page you were on.</li>
            </ul>
            <p>
              They go first to a small Immunly server function run on <strong>Cloudflare</strong>, which forwards them
              to an AI provider: <strong>Groq</strong> first. If Groq is busy or unavailable, it goes
              to <strong>OpenRouter</strong>, which passes it to one of the AI companies whose models it offers,
              or to <strong>Google (Gemini API)</strong>. The answer comes back the same way.
            </p>
            <ul>
              <li>
                <strong>We don't store conversations.</strong> Your chat lives only on the open page and disappears when
                you close or reload it. ImmunoBot doesn't set cookies or save anything in your browser.
              </li>
              <li>
                To stop overuse, Cloudflare uses your IP address to count how many questions are coming from it. These
                counters are temporary and are not linked to who you are.
              </li>
              <li>
                To keep ImmunoBot fast, answers to common first questions may be stored for up to 24 hours. Only the
                question and answer are stored, not who asked.
              </li>
              <li>
                The AI providers process your message under their own terms. Some free AI services, including
                Google's free Gemini API and some free models on OpenRouter, may keep or use what is sent to improve
                their products. <strong>Don't type names, contact details, health information or anything else
                personal into ImmunoBot.</strong>
              </li>
            </ul>
            <p>
              Provider policies: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare</a>,{' '}
              <a href="https://groq.com/privacy-policy/" target="_blank" rel="noopener noreferrer">Groq</a>,{' '}
              <a href="https://openrouter.ai/privacy" target="_blank" rel="noopener noreferrer">OpenRouter</a>,{' '}
              <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer">Gemini API</a>.
            </p>
          </section>

          <section>
            <h2>Contact form</h2>
            <p>
              Messages sent through our <Link to="/contact">contact form</Link> are delivered by Formspree. That
              includes the name, email address and message you enter. We use them only to reply to you.
            </p>
          </section>

          <section>
            <h2>Other services</h2>
            <p>
              Like most websites, your browser connects to services that supply parts of the page: GitHub Pages hosts
              the site and may keep standard server logs such as IP addresses, Google Fonts supplies the typefaces,
              and Wikimedia Commons hosts many lesson images.
            </p>
          </section>

          <section>
            <h2>Children</h2>
            <p>
              Immunly is written for students aged 13 and older. If you're under 13, please use Immunly with a parent,
              guardian or teacher, and don't use ImmunoBot or the contact form. If you believe a child under 13 has sent
              us personal information, email us and we'll delete it.
            </p>
          </section>

          <section>
            <h2>Your choices</h2>
            <ul>
              <li>Change your cookie choice at any time on the <Link to="/cookies">Cookie Policy</Link> page.</li>
              <li>Delete everything Immunly saved in your browser by clearing this site's data in your browser settings.</li>
              <li>Ask us to delete a message you sent through the contact form by emailing us.</li>
            </ul>
          </section>

          <section>
            <h2>Changes to this policy</h2>
            <p>If we change how Immunly handles information, we'll update this page and the date at the top.</p>
          </section>

          <section>
            <h2>Questions</h2>
            <p>
              Email <a href="mailto:contact@immunly.org">contact@immunly.org</a>. See also our{' '}
              <Link to="/terms">Terms of Use</Link>.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
