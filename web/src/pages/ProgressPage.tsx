import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress, LEVELS } from '../context/ProgressContext';
import { MODULES, MODULE_COLORS } from '../data/curriculum';
import Avatar from '../components/Avatar';
import './ProgressPage.css';

export default function ProgressPage() {
  const { user } = useAuth();
  const { progress, level } = useProgress();

  if (!user) return <Navigate to="/login" replace />;

  const totalLessons = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const completedCount = progress.completedLessons.length;
  const overallPct = Math.round((completedCount / totalLessons) * 100);

  const currentLevel = LEVELS[level];
  const nextLevel = LEVELS[level + 1];
  const xpInLevel = progress.xp - currentLevel.min;
  const xpForNext = nextLevel ? nextLevel.min - currentLevel.min : 1;
  const levelPct = nextLevel ? Math.min(100, Math.round((xpInLevel / xpForNext) * 100)) : 100;

  const quizModules = MODULES.filter(m => progress.quizScores[m.id] !== undefined);
  const weakModules = quizModules.filter(m => (progress.quizScores[m.id] ?? 0) < 75);

  const ACHIEVEMENTS = [
    { title: 'First Steps', desc: 'Complete your first lesson', done: completedCount >= 1 },
    { title: 'On a Roll', desc: 'Reach a 3-day streak', done: progress.streak >= 3 },
    { title: 'Scholar', desc: 'Complete 10 lessons', done: completedCount >= 10 },
    { title: 'Researcher', desc: 'Earn 500 XP', done: progress.xp >= 500 },
    { title: 'Perfect Score', desc: 'Score 100% on any quiz', done: Object.values(progress.quizScores).some(s => s === 100) },
    { title: 'Completionist', desc: 'Finish all lessons', done: completedCount >= totalLessons },
  ];

  return (
    <div className="progress-page page-content">
      <div className="container">
        <div className="progress-page__header">
          <h1>My Progress</h1>
          <p>Welcome back, {user.name.split(' ')[0]}!</p>
        </div>

        <div className="progress-layout">
          {/* Left column */}
          <div className="progress-main">
            {/* Hero card */}
            <div className="progress-hero card">
              <div className="progress-hero__left">
                <Avatar size="lg" showLabel />
                <div className="progress-hero__level">
                  <div className="progress-hero__level-bar">
                    <div className="progress-hero__level-fill" style={{ width: `${levelPct}%` }} />
                  </div>
                  <span className="progress-hero__level-label">
                    {nextLevel ? `${xpInLevel} / ${xpForNext} XP to ${nextLevel.title}` : 'Max level reached!'}
                  </span>
                </div>
              </div>
              <div className="stat-row progress-hero__stats">
                <div className="stat-item">
                  <span className="stat-label">Streak</span>
                  <span className="stat-value">{progress.streak} {progress.streak === 1 ? 'day' : 'days'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total XP</span>
                  <span className="stat-value">{progress.xp}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Lessons</span>
                  <span className="stat-value">{completedCount}/{totalLessons}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Overall</span>
                  <span className="stat-value">{overallPct}%</span>
                </div>
              </div>
            </div>

            {/* Module breakdown */}
            <div className="progress-section">
              <h2>Module Progress</h2>
              <div className="progress-modules">
                {MODULES.map((mod) => {
                  const color = MODULE_COLORS[mod.id] || 'var(--accent)';
                  const done = mod.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
                  const pct = Math.round((done / mod.lessons.length) * 100);
                  const quiz = progress.quizScores[mod.id];

                  return (
                    <div key={mod.id} className="pmod-row">
                      <div className="pmod-row__dot" style={{ background: color }} />
                      <div className="pmod-row__info">
                        <div className="pmod-row__header">
                          <span className="pmod-row__title">{mod.title}</span>
                          <div className="pmod-row__badges">
                            {quiz !== undefined && (
                              <span className="pmod-badge" style={{
                                background: quiz >= 80 ? 'var(--success-bg)' : quiz >= 60 ? 'var(--warning-bg)' : 'var(--error-bg)',
                                color: quiz >= 80 ? 'var(--success)' : quiz >= 60 ? 'var(--warning)' : 'var(--error)'
                              }}>Quiz {quiz}%</span>
                            )}
                            {pct === 100 && (
                              <span className="pmod-badge" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>✓ Done</span>
                            )}
                          </div>
                        </div>
                        <div className="pmod-row__bar-row">
                          <div className="progress-track" style={{ flex: 1 }}>
                            <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                          </div>
                          <span className="pmod-row__pct">{pct}%</span>
                        </div>
                        <span className="pmod-row__sub">{done}/{mod.lessons.length} lessons · <Link to={`/module/${mod.id}`} style={{ color }}>Continue →</Link></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weak areas */}
            {weakModules.length > 0 && (
              <div className="progress-section">
                <h2>Areas to review</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 16 }}>
                  Modules where your quiz score was below 75%.
                </p>
                <div className="weak-list">
                  {weakModules.map(mod => (
                    <Link key={mod.id} to={`/module/${mod.id}`} className="weak-item card">
                      <div>
                        <strong>{mod.title}</strong>
                        <span>Quiz score: {progress.quizScores[mod.id]}%</span>
                      </div>
                      <span className="weak-item__cta">Review →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: achievements */}
          <div className="progress-aside">
            <h2>Achievements</h2>
            <div className="achievements-grid">
              {ACHIEVEMENTS.map(a => (
                <div key={a.title} className={`achievement-card card ${a.done ? 'achievement-card--done' : 'achievement-card--locked'}`}>
                  <strong>{a.title}</strong>
                  <span>{a.desc}</span>
                  {a.done && <span className="achievement-card__check">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
