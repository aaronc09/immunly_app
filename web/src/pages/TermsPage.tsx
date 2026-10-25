import { Link } from 'react-router-dom';
import './CookiePolicyPage.css';

const LAST_UPDATED = '25 October 2026';

export default function TermsPage() {
  return (
    <div className="cookie-page page-content">
      <div className="container">
        <div className="cookie-header">
          <h1>Terms of Use</h1>
          <p>The rules for using Immunly and ImmunoBot. Last updated {LAST_UPDATED}.</p>
        </div>

        <article className="cookie-body legal-body">
          <section>
            <h2>Using Immunly</h2>
            <p>
              Immunly is a free educational website. By using it you agree to these terms and to our{' '}
              <Link to="/privacy">Privacy Policy</Link> and <Link to="/cookies">Cookie Policy</Link>. If you don't
              agree, please don't use the site.
            </p>
          </section>

          <section>
            <h2>Education, not medical advice</h2>
            <p>
              Everything on Immunly, including ImmunoBot's answers, is for learning only. It is not medical advice and
              isn't a substitute for a doctor or other qualified professional. Don't use it to diagnose or treat
              yourself or anyone else. In an emergency, contact your local emergency services.
            </p>
          </section>

          <section>
            <h2>ImmunoBot</h2>
            <ul>
              <li>
                ImmunoBot's answers are written by AI and can be wrong, incomplete or out of date. Check important facts
                against the lessons or a trusted source.
              </li>
              <li>Don't enter personal or sensitive information into ImmunoBot (see our <Link to="/privacy">Privacy Policy</Link>).</li>
              <li>
                ImmunoBot only answers questions about immunology, biology and science research. It will not write code,
                give counselling or emotional support, or help with anything that could put someone in danger, and it
                won't respond to abusive messages.
              </li>
              <li>
                <strong>ImmunoBot is not a crisis service.</strong> If someone mentions harming themselves, it replies
                with helpline details and nothing more. If you are struggling, please talk to a trusted adult, or call
                or text 988 in the US (<a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">findahelpline.com</a> lists free
                helplines elsewhere). In an emergency, call your local emergency number.
              </li>
              <li>
                To keep ImmunoBot available for everyone, it limits how many questions can be sent in a short time.
                When it's busy or a request fails, it will tell you and you can try again shortly.
              </li>
              <li>We may change, limit or switch off ImmunoBot at any time.</li>
            </ul>
          </section>

          <section>
            <h2>Fair use</h2>
            <p>Please don't:</p>
            <ul>
              <li>try to overload the site or ImmunoBot, get around its limits, or access it with bots or scripts;</li>
              <li>use ImmunoBot to create harmful, hateful or unlawful content, or for things unrelated to learning;</li>
              <li>copy the site's content in bulk or present it as your own.</li>
            </ul>
          </section>

          <section>
            <h2>Accounts</h2>
            <p>
              Immunly accounts are saved only in your browser (see the <Link to="/privacy">Privacy Policy</Link>). They
              aren't protected like an online account, so use a password you don't use elsewhere. Clearing your
              browser data deletes the account and its progress.
            </p>
          </section>

          <section>
            <h2>Content and links</h2>
            <p>
              Lesson text and the site's design belong to Immunly unless stated otherwise. Images from Wikimedia Commons
              are used under their own licences, which are credited beside each image. Links to research papers and
              outside programs point to other websites. We don't control those sites and aren't responsible for them.
            </p>
          </section>

          <section>
            <h2>No guarantees</h2>
            <p>
              We work to keep Immunly accurate and available, but we provide it "as is", without guarantees that it is
              error-free or always online. To the extent the law allows, Immunly isn't liable for losses that come from
              using the site or relying on its content.
            </p>
          </section>

          <section>
            <h2>Changes</h2>
            <p>
              We may update these terms. When we do, we'll change the date at the top. Using Immunly after an update
              means you accept the new terms.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>Questions about these terms: <a href="mailto:contact@immunly.org">contact@immunly.org</a>.</p>
          </section>
        </article>
      </div>
    </div>
  );
}
