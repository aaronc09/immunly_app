import { Link, useParams, Navigate } from 'react-router-dom';
import { getModule, MODULE_COLORS, tint } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';
import './ModulePage.css';

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const mod = moduleId ? getModule(moduleId) : null;
  const { progress } = useProgress();

  if (!mod) return <Navigate to="/courses" replace />;

  const color = MODULE_COLORS[mod.id] || 'var(--accent)';
  const completedInMod = mod.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
  const allDone = completedInMod === mod.lessons.length;
  const quizScore = progress.quizScores[mod.id];
  const pct = Math.round((completedInMod / mod.lessons.length) * 100);

  return (
    <div className="module-page page-content">
      {/* Header */}
      <div className="module-page__header" style={{ background: tint(color, 7) }}>
        <div className="container">
          <Link to="/courses" className="module-page__back">← All Courses</Link>
          <div className="module-page__title-row">
            <div>
              <div className="badge" style={{ background: tint(color, 12), color }}>
                {mod.id.replace('mod', 'Module ')}
              </div>
              <h1 style={{ color: 'var(--text)', marginTop: 8 }}>{mod.title}</h1>
            </div>
            <div className="module-page__progress-box">
              <div className="stat-row" style={{ paddingTop: 0, borderTop: 'none' }}>
                <div className="stat-item">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value" style={{ color }}>{completedInMod}/{mod.lessons.length}</span>
                </div>
                {quizScore !== undefined && (
                  <div className="stat-item">
                    <span className="stat-label">Quiz best</span>
                    <span className="stat-value" style={{ color }}>{quizScore}%</span>
                  </div>
                )}
              </div>
              <div className="progress-track" style={{ marginTop: 10 }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons list */}
      <div className="container">
        <div className="module-page__lessons">
          {mod.lessons.map((lesson, i) => {
            const done = progress.completedLessons.includes(lesson.id);
            // Lock if previous lesson not done (except first)
            const locked = i > 0 && !progress.completedLessons.includes(mod.lessons[i - 1].id);

            return (
              <div key={lesson.id} className={`lesson-row ${locked ? 'lesson-row--locked' : ''}`}>
                <div className="lesson-row__num" style={done ? { background: color, color: 'var(--on-accent)', borderColor: color } : locked ? {} : { borderColor: color, color }}>
                  {done ? '✓' : i + 1}
                </div>
                <div className="lesson-row__info">
                  <div>
                    <h3 className="lesson-row__title">{lesson.title}</h3>
                    <span className="lesson-row__meta">{lesson.duration} · {lesson.quiz.length} quiz questions</span>
                  </div>
                </div>
                <div className="lesson-row__action">
                  {done && <span className="lesson-row__done-badge" style={{ background: tint(color, 12), color }}>Done</span>}
                  {!locked && (
                    <Link
                      to={`/module/${mod.id}/lesson/${lesson.id}`}
                      className="btn btn-outline lesson-row__btn"
                      style={done ? { borderColor: color, color } : {}}
                    >
                      {done ? 'Review' : 'Start'} →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quiz CTA */}
        {allDone && (
          <div className="module-page__quiz-cta card" style={{ borderColor: color }}>
            <div>
              <h3>Module complete! Take the quiz.</h3>
              <p>Test your knowledge across all {mod.lessons.length} lessons.</p>
            </div>
            <Link to={`/module/${mod.id}/quiz`} className="btn btn-primary" style={{ background: color, borderColor: color }}>
              Take Quiz →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
