import React from 'react';
import { useProgress, LEVELS } from '../context/ProgressContext';
import './Avatar.css';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function Avatar({ size = 'md', showLabel = false }: AvatarProps) {
  const { progress, level, levelTitle } = useProgress();
  const levelData = LEVELS[level];
  const nextLevel = LEVELS[level + 1];
  const xpInLevel = progress.xp - levelData.min;
  const xpForNext = nextLevel ? nextLevel.min - levelData.min : 1;
  const pct = nextLevel ? Math.min(100, (xpInLevel / xpForNext) * 100) : 100;

  return (
    <div className={`avatar avatar--${size}`}>
      <div className="avatar__ring" style={{ '--pct': `${pct}%` } as React.CSSProperties}>
        <span className="avatar__level" aria-label={`Level ${level + 1}`}>{level + 1}</span>
      </div>
      {showLabel && (
        <div className="avatar__label">
          <span className="avatar__title">{levelTitle}</span>
          <span className="avatar__xp">{progress.xp} XP</span>
        </div>
      )}
    </div>
  );
}
