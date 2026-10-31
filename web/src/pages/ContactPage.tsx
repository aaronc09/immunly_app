import { useState, type FormEvent } from 'react';
import './LoginPage.css';
import './ContactPage.css';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvznedqn';

const TEAM = [
  { role: 'CEO', name: 'Aaron Choi' },
  { role: 'CTO', name: 'Carter He' },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Something went wrong sending your message. Please try again or email contact@immunly.org directly.");
      }
    } catch {
      setError("Couldn't reach the server. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="contact-page page-content">
      <div className="container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Have a question, suggestion, or found an error? We'd love to hear from you.</p>
        </div>

        <div className="contact-layout">
          <div className="contact-form-wrap card">
            {sent ? (
              <div className="contact-success">
                <h3>Message received!</h3>
                <p>Thanks for reaching out. We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="login-field">
                  <label>Your name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ada Lovelace"
                    required
                  />
                </div>
                <div className="login-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="login-field">
                  <label>Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us what's on your mind…"
                    rows={5}
                    required
                  />
                </div>

                {error && <div className="login-error">{error}</div>}

                <button type="submit" className="btn btn-primary contact-submit" disabled={sending}>
                  {sending ? 'Sending…' : 'Send message'}
                </button>
              </form>
            )}
          </div>

          <div className="contact-info">
            <div className="contact-info-card card">
              <h3>About Immunly</h3>
              <p>
                Immunly is a free, open-access immunology and biomedical-research education platform.
                All lesson content is written for learners with a basic biology background.
                Research paper links point to the original published work — we don't reproduce their content.
              </p>
            </div>
            <div className="contact-info-card card">
              <h3>Team</h3>
              <dl className="contact-team">
                {TEAM.map(m => (
                  <div key={m.role} className="contact-team__member">
                    <dt>{m.role}</dt>
                    <dd>{m.name}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="contact-info-card card">
              <h3>Found an error?</h3>
              <p>
                Science is precise, and we take accuracy seriously. If you spot an error in any lesson,
                please let us know with the lesson name and what seems wrong.
              </p>
            </div>
            <div className="contact-info-card card">
              <h3>Educators</h3>
              <p>
                Using Immunly with students? We'd love to hear how it's working and what we can improve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
