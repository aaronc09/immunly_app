import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getLesson, getModule, MODULES, MODULE_COLORS, tint } from '../data/curriculum';
import { LESSON_PHOTOS } from '../data/lessonPhotos';
import { LESSON_PAPERS } from '../data/researchPapers';
import { useProgress } from '../context/ProgressContext';
import LessonContent from '../components/LessonContent';
import { ImageWithSkeleton } from '../components/Skeleton';
import './LessonPage.css';

export default function LessonPage() {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const mod = moduleId ? getModule(moduleId) : null;
  const lesson = mod && lessonId ? getLesson(moduleId!, lessonId) : null;

  const { progress, completeLesson } = useProgress();
  const [phase, setPhase] = useState<'lesson' | 'quiz' | 'done'>('lesson');
  const [selected, setSelected] = useState<number[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [score, setScore] = useState(0);

  if (!mod || !lesson) return <Navigate to="/courses" replace />;

  const color = MODULE_COLORS[mod.id] || 'var(--accent)';
  const photo = LESSON_PHOTOS[lessonId!];
  const papers = LESSON_PAPERS[lessonId!] || [];
  const isCompleted = progress.completedLessons.includes(lesson.id);

  // Find next lesson — falling through to the next module's first lesson
  // when this is the last lesson in the current one, so finishing a module
  // carries the learner straight into the next instead of dead-ending.
  const lessonIdx = mod.lessons.findIndex(l => l.id === lesson.id);
  const nextLesson = mod.lessons[lessonIdx + 1];
  const modIdx = MODULES.findIndex(m => m.id === mod.id);
  const nextModule = !nextLesson ? MODULES[modIdx + 1] : null;
  const nextModuleLesson = nextModule?.lessons[0];

  function handleCompleteLesson() {
    if (!isCompleted) {
      completeLesson(lesson!.id, 100); // 100 XP per lesson
    }
    if (lesson!.quiz.length > 0) {
      setPhase('quiz');
    } else {
      setPhase('done');
    }
  }

  function handleQuizSubmit() {
    let correct = 0;
    lesson!.quiz.forEach((q, i) => {
      if (selected[i] === q.correctIndex) correct++;
    });
    const pct = Math.round((correct / lesson!.quiz.length) * 100);
    setScore(pct);
    setQuizDone(true);
  }

  function handleSelect(qIdx: number, optIdx: number) {
    if (quizDone) return;
    setSelected(prev => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  }

  if (phase === 'quiz') {
    const allAnswered = lesson.quiz.every((_, i) => selected[i] !== undefined);
    return (
      <div className="quiz-page page-content">
        <div className="container quiz-page__inner">
          <div className="quiz-page__header">
            <Link to={`/module/${mod.id}`} className="quiz-page__back">← {mod.title}</Link>
            <h2>Quick Quiz — {lesson.title}</h2>
            <p>{lesson.quiz.length} questions to test your understanding</p>
          </div>

          <div className="quiz-questions">
            {lesson.quiz.map((q, qi) => (
              <div key={qi} className="quiz-q card">
                <p className="quiz-q__text"><strong>Q{qi + 1}.</strong> {q.question}</p>
                <div className="quiz-q__options">
                  {q.options.map((opt, oi) => {
                    let cls = 'quiz-opt';
                    if (quizDone) {
                      if (oi === q.correctIndex) cls += ' quiz-opt--correct';
                      else if (oi === selected[qi]) cls += ' quiz-opt--wrong';
                    } else if (selected[qi] === oi) {
                      cls += ' quiz-opt--selected';
                    }
                    return (
                      <button key={oi} className={cls} onClick={() => handleSelect(qi, oi)}
                        style={{ '--qcolor': color } as React.CSSProperties}>
                        <span className="quiz-opt__letter">{String.fromCharCode(65 + oi)}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quizDone && q.explanation && (
                  <div className="quiz-q__explanation">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!quizDone ? (
            <button
              className="btn btn-primary quiz-submit"
              style={{ background: color }}
              disabled={!allAnswered}
              onClick={handleQuizSubmit}
            >
              Submit Answers
            </button>
          ) : (
            <div className="quiz-result card">
              <div className="quiz-result__score" style={{ color }}>
                {score}%
              </div>
              <p>{score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good effort!' : 'Keep practising!'}</p>
              <div className="quiz-result__actions">
                {nextLesson ? (
                  <Link to={`/module/${mod.id}/lesson/${nextLesson.id}`} className="btn btn-primary" style={{ background: color }}>
                    Next Lesson →
                  </Link>
                ) : nextModule && nextModuleLesson ? (
                  <Link
                    to={`/module/${nextModule.id}/lesson/${nextModuleLesson.id}`}
                    className="btn btn-primary"
                    style={{ background: MODULE_COLORS[nextModule.id] || color }}
                  >
                    Module Complete! Start "{nextModule.title}" →
                  </Link>
                ) : (
                  <Link to="/courses" className="btn btn-primary" style={{ background: color }}>
                    All Modules Complete!
                  </Link>
                )}
                <button className="btn btn-outline" onClick={() => { setPhase('lesson'); setSelected([]); setQuizDone(false); }}>
                  Review Lesson
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-page page-content">
      <div className="container lesson-page__inner">
        {/* Breadcrumb */}
        <div className="lesson-page__breadcrumb">
          <Link to="/courses">Courses</Link>
          <span>›</span>
          <Link to={`/module/${mod.id}`}>{mod.title}</Link>
          <span>›</span>
          <span>{lesson.title}</span>
        </div>

        <div className="lesson-page__layout">
          {/* Main content */}
          <main className="lesson-main">
            {/* Hero */}
            <div className="lesson-hero" style={{ borderColor: color }}>
              <div className="lesson-hero__top" style={{ background: tint(color, 7) }}>
                <div className="lesson-hero__meta">
                  <span className="badge" style={{ background: tint(color, 12), color }}>
                    {mod.id.replace('mod', 'Module ')}
                  </span>
                  <span className="lesson-hero__duration">{lesson.duration}</span>
                  {isCompleted && (
                    <span className="badge" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>✓ Completed</span>
                  )}
                </div>
                <h1>{lesson.title}</h1>
              </div>

              {/* Photo */}
              {photo && (
                <div className="lesson-photo">
                  <ImageWithSkeleton key={photo.url} src={photo.url} alt={photo.alt} loading="lazy" aspectRatio="4 / 3" />
                  <div className="lesson-photo__caption">
                    <em>{photo.caption}</em>
                    <a href={photo.creditUrl} target="_blank" rel="noopener noreferrer" className="photo-credit">
                      {photo.credit}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson content */}
            <div className="lesson-body">
              <LessonContent sections={lesson.sections} />
            </div>

            {/* Key takeaways */}
            {lesson.takeaways && lesson.takeaways.length > 0 && (
              <div className="lesson-takeaways card">
                <h3>Key Takeaways</h3>
                <ul>
                  {lesson.takeaways.map((t, i) => (
                    <li key={i}><span style={{ color }}>✦</span> {t}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Complete button */}
            <div className="lesson-complete-btn">
              <button
                className="btn btn-primary lesson-complete-btn__inner"
                style={{ background: color }}
                onClick={handleCompleteLesson}
              >
                {isCompleted ? 'Take the Quiz →' : 'Complete & Take Quiz →'}
              </button>
              {isCompleted && nextLesson && (
                <Link to={`/module/${mod.id}/lesson/${nextLesson.id}`} className="btn btn-outline">
                  Skip to next lesson
                </Link>
              )}
              {isCompleted && !nextLesson && nextModule && nextModuleLesson && (
                <Link to={`/module/${nextModule.id}/lesson/${nextModuleLesson.id}`} className="btn btn-outline">
                  Skip to "{nextModule.title}" →
                </Link>
              )}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lesson-sidebar">
            {/* Module lessons */}
            <div className="sidebar-card card">
              <h4>Lessons in this module</h4>
              {mod.lessons.map((l, i) => {
                const done = progress.completedLessons.includes(l.id);
                const isCurrent = l.id === lesson.id;
                return (
                  <Link
                    key={l.id}
                    to={`/module/${mod.id}/lesson/${l.id}`}
                    className={`sidebar-lesson ${isCurrent ? 'sidebar-lesson--active' : ''} ${done ? 'sidebar-lesson--done' : ''}`}
                    style={isCurrent ? { borderColor: color, background: tint(color, 8) } : {}}
                  >
                    <span className="sidebar-lesson__icon">{done ? '✓' : i + 1}</span>
                    <span>{l.title}</span>
                  </Link>
                );
              })}
            </div>

            {/* Research papers */}
            {papers.length > 0 && (
              <div className="sidebar-card card">
                <h4>Key Papers</h4>
                <div className="papers-list">
                  {papers.map((p, i) => (
                    <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="paper-item">
                      <div className="paper-item__meta">{p.authors} · {p.year} · <em>{p.journal}</em></div>
                      <div className="paper-item__title">{p.title}</div>
                      <div className="paper-item__note">{p.note}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
