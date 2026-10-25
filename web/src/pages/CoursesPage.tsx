import { Link } from 'react-router-dom';
import { MODULES, MODULE_COLORS, tint } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';
import './CoursesPage.css';

const MODULE_DESCRIPTIONS = [
  'Start here. Understand DNA, the cell, blood cell development, and the lymphatic system — the hardware the immune system runs on.',
  'Explore the two arms of immunity: the fast innate system and the slower, specific adaptive response, including T cells, B cells, and antibodies.',
  'What happens when immunity goes wrong? Examine autoimmune disease, allergy, HIV/AIDS, and how cancer evades immune surveillance.',
  'The cutting edge. Discover how scientists are harnessing immunity through mRNA vaccines, CAR-T cell therapy, and checkpoint inhibitors.',
  'Build real scientific literacy. Learn to read papers, interpret flow cytometry, and understand RNA sequencing data.',
  'Turn knowledge into discovery. How immunology becomes medicine, the core lab methods, and exactly how students get into research.',
  'How computers learn patterns from data — supervised and unsupervised learning, the right models, and how to validate without fooling yourself.',
];

export default function CoursesPage() {
  const { progress } = useProgress();

  const totalLessons = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const completedCount = progress.completedLessons.length;

  return (
    <div className="courses-page page-content">
      <div className="container">
        {/* Header */}
        <div className="courses-header">
          <h1>Courses</h1>
          <p>{MODULES.length} modules · {totalLessons} lessons · Free forever</p>
          {completedCount > 0 && (
            <div className="courses-overall">
              <span>{completedCount} / {totalLessons} lessons completed</span>
              <div className="progress-track courses-overall__bar">
                <div className="progress-fill" style={{
                  width: `${Math.round((completedCount / totalLessons) * 100)}%`,
                  background: 'var(--accent)'
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Module cards */}
        <div className="courses-list">
          {MODULES.map((mod, i) => {
            const color = MODULE_COLORS[mod.id] || 'var(--accent)';
            const completedInMod = mod.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
            const pct = Math.round((completedInMod / mod.lessons.length) * 100);
            const quizScore = progress.quizScores[mod.id];

            return (
              <div key={mod.id} className="course-card card">
                {/* Color stripe */}
                <div className="course-card__stripe" style={{ background: color }} />

                <div className="course-card__body">
                  {/* Left: info */}
                  <div className="course-card__info">
                    <div className="course-card__head">
                      <div>
                        <div className="course-card__tag" style={{ color, background: tint(color, 12) }}>
                          Module {i + 1}
                        </div>
                        <h2 className="course-card__title">{mod.title}</h2>
                      </div>
                    </div>
                    <p className="course-card__desc">{MODULE_DESCRIPTIONS[i]}</p>

                    {/* Lesson pills */}
                    <div className="course-card__lessons">
                      {mod.lessons.map(lesson => {
                        const done = progress.completedLessons.includes(lesson.id);
                        return (
                          <Link
                            key={lesson.id}
                            to={`/module/${mod.id}/lesson/${lesson.id}`}
                            className={`lesson-pill ${done ? 'lesson-pill--done' : ''}`}
                            style={done ? { borderColor: color, color } : {}}
                          >
                            {done && <span>✓</span>}
                            {lesson.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: stats + CTA */}
                  <div className="course-card__aside">
                    <div className="course-card__stats">
                      <div className="stat-item">
                        <span className="stat-label">Lessons</span>
                        <span className="stat-value" style={{ color }}>{mod.lessons.length}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Completed</span>
                        <span className="stat-value" style={{ color }}>{completedInMod}/{mod.lessons.length}</span>
                      </div>
                      {quizScore !== undefined && (
                        <div className="stat-item">
                          <span className="stat-label">Quiz</span>
                          <span className="stat-value" style={{ color }}>{quizScore}%</span>
                        </div>
                      )}
                    </div>

                    {pct > 0 && (
                      <div style={{ margin: '12px 0' }}>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                          {pct}% complete
                        </span>
                      </div>
                    )}

                    <Link
                      to={`/module/${mod.id}`}
                      className="btn btn-primary course-card__btn"
                      style={{ background: color, borderColor: color }}
                    >
                      {completedInMod === 0 ? 'Start Module' : completedInMod === mod.lessons.length ? 'Review' : 'Continue'} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
