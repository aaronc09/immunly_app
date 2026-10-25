import { useState, useEffect } from 'react';
import { getTodaysQuestion, getTodayKey } from '../data/streakQuestions';
import { useProgress } from '../context/ProgressContext';
import './StreakSaver.css';

export default function StreakSaver() {
  const { progress, saveStreak } = useProgress();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const todayKey = getTodayKey();
  const question = getTodaysQuestion();

  useEffect(() => {
    // Show if streak > 0 and saver not yet used today
    if (progress.streak > 0 && progress.streakSavedDate !== todayKey && !dismissed) {
      // Show after a short delay
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, [progress.streak, progress.streakSavedDate, todayKey, dismissed]);

  if (!visible) return null;

  const isCorrect = selected === question.correctIndex;
  const isAnswered = selected !== null;

  function handleSelect(idx: number) {
    if (isAnswered) return;
    setSelected(idx);
    if (idx === question.correctIndex) {
      saveStreak();
    }
  }

  function dismiss() {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      setDismissed(true);
    }, 250);
  }

  return (
    <div className={`streak-overlay ${closing ? 'streak-overlay--closing' : ''}`}>
      <div className="streak-modal">
        <div className="streak-modal__header">
          <div>
            <h3>Streak Saver</h3>
            <p>Answer today's question to keep your {progress.streak}-day streak alive!</p>
          </div>
          <button className="streak-modal__close" onClick={dismiss}>✕</button>
        </div>

        <div className="streak-modal__q">
          <p>{question.question}</p>
        </div>

        <div className="streak-modal__options">
          {question.options.map((opt, i) => {
            let cls = 'streak-opt';
            if (isAnswered) {
              if (i === question.correctIndex) cls += ' streak-opt--correct';
              else if (i === selected) cls += ' streak-opt--wrong';
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelect(i)}>
                <span className="streak-opt__letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`streak-modal__result ${isCorrect ? 'streak-modal__result--correct' : 'streak-modal__result--wrong'}`}>
            <div>
              <strong>{isCorrect ? 'Correct! Streak saved!' : 'Not quite — streak lost.'}</strong>
              <p>{question.explanation}</p>
            </div>
          </div>
        )}

        {isAnswered && (
          <button className="btn btn-primary streak-modal__done" onClick={dismiss}>
            {isCorrect ? 'Keep learning →' : 'Close'}
          </button>
        )}
      </div>
    </div>
  );
}
