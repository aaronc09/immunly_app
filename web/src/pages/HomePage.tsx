import { Link } from 'react-router-dom';
import { MODULES, MODULE_COLORS, tint } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import { PLAY_INTRO_EVENT } from '../components/WelcomeIntro';
import './HomePage.css';

export default function HomePage() {
  const { user } = useAuth();
  const { progress } = useProgress();

  const totalLessons = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const completedCount = progress.completedLessons.length;
  const overallPct = Math.round((completedCount / totalLessons) * 100);

  // Find next lesson to do
  let nextModuleId = 'mod1';
  let nextLessonId = 'mod1-l1';
  outer: for (const mod of MODULES) {
    for (const lesson of mod.lessons) {
      if (!progress.completedLessons.includes(lesson.id)) {
        nextModuleId = mod.id;
        nextLessonId = lesson.id;
        break outer;
      }
    }
  }

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <div className="hero__text">
              <div className="hero__tag">Free · Science-backed · Open access</div>
              <h1>Learn Immunology,<br /><span>Simply</span></h1>
              <p>
                Master the immune system from DNA to cutting-edge cancer therapies —
                then translate it into biomedical research and machine learning.
                Bite-sized lessons, landmark research, and interactive quizzes.
              </p>
              <div className="hero__cta">
                <Link to={`/module/${nextModuleId}/lesson/${nextLessonId}`} className="btn btn-primary hero__btn">
                  {completedCount > 0 ? 'Continue Learning →' : 'Start Learning →'}
                </Link>
                <Link to="/courses" className="btn btn-outline hero__btn">Browse Courses</Link>
                <button
                  className="btn btn-ghost hero__btn"
                  onClick={() => window.dispatchEvent(new Event(PLAY_INTRO_EVENT))}
                >
                  Watch intro
                </button>
              </div>
            </div>
            {user && (
              <div className="hero__card">
                <div className="hero__card-inner">
                  <Avatar size="lg" showLabel />
                  <div className="divider" style={{ margin: '16px 0' }} />
                  <div className="stat-row">
                    <div className="stat-item">
                      <span className="stat-label">Streak</span>
                      <span className="stat-value">{progress.streak} {progress.streak === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">XP</span>
                      <span className="stat-value">{progress.xp}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Done</span>
                      <span className="stat-value">{overallPct}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="stats-bar">
        <div className="container stats-bar__inner">
          <div className="stats-bar__item">
            <span className="stats-bar__num">{MODULES.length}</span>
            <span className="stats-bar__label">Modules</span>
          </div>
          <div className="stats-bar__item">
            <span className="stats-bar__num">{totalLessons}</span>
            <span className="stats-bar__label">Lessons</span>
          </div>
          <div className="stats-bar__item">
            <span className="stats-bar__num">21+</span>
            <span className="stats-bar__label">Quiz questions</span>
          </div>
          <div className="stats-bar__item">
            <span className="stats-bar__num">30+</span>
            <span className="stats-bar__label">Research papers</span>
          </div>
          <div className="stats-bar__item">
            <span className="stats-bar__num">Free</span>
            <span className="stats-bar__label">Always</span>
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section className="home-modules">
        <div className="container">
          <div className="section-title">All Modules</div>
          <div className="section-sub">Work through them in order or jump to what interests you.</div>

          <div className="home-modules__grid">
            {MODULES.map((mod, i) => {
              const color = MODULE_COLORS[mod.id];
              const completedInMod = mod.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
              const pct = Math.round((completedInMod / mod.lessons.length) * 100);
              return (
                <Link key={mod.id} to={`/module/${mod.id}`} className="hm-card card">
                  <div className="hm-card__accent" style={{ background: color }} />
                  <div className="hm-card__body">
                    <div className="hm-card__num" style={{ color: tint(color, 12) }}>0{i + 1}</div>
                    <h3 style={{ color: 'var(--text)' }}>{mod.title}</h3>
                    <p>{mod.subtitle}</p>
                    <div className="hm-card__meta">
                      <span>{mod.lessons.length} lessons</span>
                      {pct > 0 && <span style={{ color }}>{pct}% done</span>}
                    </div>
                    {pct > 0 && (
                      <div className="progress-track" style={{ marginTop: 12 }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="why-section">
        <div className="container">
          <div className="section-title">Built differently</div>
          <div className="section-sub">Not just another textbook online.</div>
          <div className="why-grid">
            {[
              { title: 'Landmark papers', desc: 'Every lesson links to real published research — Watson & Crick, Karikó, Allison, and more.' },
              { title: 'Daily streaks', desc: 'A new question every day from a rotating bank keeps your streak alive and knowledge fresh.' },
              { title: 'XP & levels', desc: 'Earn XP as you learn. Rise from Novice to Immunologist as your knowledge deepens.' },
              { title: 'Real imagery', desc: 'Verified Wikimedia Commons photos — actual microscopy, diagrams, and scientific imagery.' },
            ].map((item) => (
              <div key={item.title} className="why-card card">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-box card">
              <h2>Ready to start?</h2>
              <p>Create a free account to track your progress, earn XP, and maintain a streak.</p>
              <div className="cta-box__btns">
                <Link to="/login" className="btn btn-primary">Create free account</Link>
                <Link to={`/module/${nextModuleId}/lesson/${nextLessonId}`} className="btn btn-outline">Try a lesson first</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
