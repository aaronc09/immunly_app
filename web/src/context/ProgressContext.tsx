import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface ProgressData {
  xp: number;
  streak: number;
  lastStreakDate: string; // YYYY-MM-DD
  streakSavedDate: string; // date when streak saver was used
  completedLessons: string[]; // lesson IDs
  quizScores: Record<string, number>; // moduleId → best score (0-100)
  flashcardsReviewed: number;
}

interface ProgressContextValue {
  progress: ProgressData;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  saveQuizScore: (moduleId: string, score: number) => void;
  addFlashcards: (count: number) => void;
  saveStreak: () => void; // called when streak saver question answered correctly
  level: number;
  levelTitle: string;
}

const LEVELS = [
  { min: 0,    max: 199,  title: 'Novice' },
  { min: 200,  max: 499,  title: 'Explorer' },
  { min: 500,  max: 999,  title: 'Analyst' },
  { min: 1000, max: 1999, title: 'Researcher' },
  { min: 2000, max: Infinity, title: 'Immunologist' },
];

const DEFAULT_PROGRESS: ProgressData = {
  xp: 0,
  streak: 0,
  lastStreakDate: '',
  streakSavedDate: '',
  completedLessons: [],
  quizScores: {},
  flashcardsReviewed: 0,
};

const ProgressContext = createContext<ProgressContextValue>({
  progress: DEFAULT_PROGRESS,
  completeLesson: () => {},
  saveQuizScore: () => {},
  addFlashcards: () => {},
  saveStreak: () => {},
  level: 0,
  levelTitle: 'Novice',
});

function getKey(userId: string | null) {
  return userId ? `immunly_progress_${userId}` : 'immunly_progress_guest';
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function computeStreak(progress: ProgressData): ProgressData {
  const today = todayStr();
  if (!progress.lastStreakDate) return progress;
  const last = new Date(progress.lastStreakDate);
  const now = new Date(today);
  const diffDays = Math.round((now.getTime() - last.getTime()) / 86400000);
  if (diffDays > 1) {
    // Streak broken (unless saver used)
    if (progress.streakSavedDate === today) return progress; // saver already used today
    return { ...progress, streak: 0 };
  }
  return progress;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [progress, setProgress] = useState<ProgressData>(() => {
    try {
      const raw = localStorage.getItem(getKey(user?.id ?? null));
      const p: ProgressData = raw ? { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } : { ...DEFAULT_PROGRESS };
      return computeStreak(p);
    } catch {
      return { ...DEFAULT_PROGRESS };
    }
  });

  // Reload when user changes (login/logout)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(getKey(user?.id ?? null));
      const p: ProgressData = raw ? { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } : { ...DEFAULT_PROGRESS };
      setProgress(computeStreak(p));
    } catch {
      setProgress({ ...DEFAULT_PROGRESS });
    }
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem(getKey(user?.id ?? null), JSON.stringify(progress));
  }, [progress, user?.id]);

  const completeLesson = useCallback((lessonId: string, xpEarned: number) => {
    setProgress(prev => {
      const today = todayStr();
      const alreadyDone = prev.completedLessons.includes(lessonId);
      const newXp = alreadyDone ? prev.xp : prev.xp + xpEarned;
      const newCompleted = alreadyDone ? prev.completedLessons : [...prev.completedLessons, lessonId];

      // Streak logic
      let newStreak = prev.streak;
      let newLastDate = prev.lastStreakDate;
      if (!alreadyDone) {
        if (prev.lastStreakDate === today) {
          // Already counted today
        } else {
          const diffDays = prev.lastStreakDate
            ? Math.round((new Date(today).getTime() - new Date(prev.lastStreakDate).getTime()) / 86400000)
            : 0;
          newStreak = diffDays <= 1 ? prev.streak + 1 : 1;
          newLastDate = today;
        }
      }

      return { ...prev, xp: newXp, completedLessons: newCompleted, streak: newStreak, lastStreakDate: newLastDate };
    });
  }, []);

  const saveQuizScore = useCallback((moduleId: string, score: number) => {
    setProgress(prev => {
      const best = Math.max(prev.quizScores[moduleId] ?? 0, score);
      return { ...prev, quizScores: { ...prev.quizScores, [moduleId]: best } };
    });
  }, []);

  const addFlashcards = useCallback((count: number) => {
    setProgress(prev => ({ ...prev, flashcardsReviewed: prev.flashcardsReviewed + count }));
  }, []);

  const saveStreak = useCallback(() => {
    const today = todayStr();
    setProgress(prev => ({
      ...prev,
      streakSavedDate: today,
      streak: Math.max(prev.streak, 1),
      lastStreakDate: today,
    }));
  }, []);

  const levelData = LEVELS.find(l => progress.xp >= l.min && progress.xp <= l.max) ?? LEVELS[0];

  return (
    <ProgressContext.Provider value={{
      progress,
      completeLesson,
      saveQuizScore,
      addFlashcards,
      saveStreak,
      level: LEVELS.indexOf(levelData),
      levelTitle: levelData.title,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}

export { LEVELS };
