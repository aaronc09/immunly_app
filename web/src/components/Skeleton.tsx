import React, { useState } from 'react';
import './Skeleton.css';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/** A shimmering placeholder block shown while real content loads. */
export function Skeleton({ width = '100%', height = 16, radius, className = '', style }: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

/** Several text lines; the last one is shorter so it reads like a paragraph. */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <span className="skeleton-text" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} height={12} width={i === lines - 1 ? '62%' : '100%'} />
      ))}
    </span>
  );
}

/** Generic page layout placeholder, used while a route's code downloads. */
export function PageSkeleton() {
  return (
    <div className="page-content" role="status" aria-label="Loading page">
      <div className="container page-skeleton">
        <Skeleton width={120} height={14} />
        <Skeleton width="min(520px, 80%)" height={44} radius={8} />
        <SkeletonText lines={2} />
        <div className="page-skeleton__grid">
          {[0, 1, 2].map(i => (
            <div key={i} className="page-skeleton__card">
              <Skeleton width={36} height={36} radius={8} />
              <Skeleton width="70%" height={20} />
              <SkeletonText lines={3} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Space to hold before the image arrives, e.g. '16 / 9'. */
  aspectRatio?: string;
}

/** An <img> that shows a skeleton until it has loaded (or failed). */
export function ImageWithSkeleton({ aspectRatio = '16 / 9', className = '', onLoad, onError, ...img }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className={`skeleton-image ${loaded ? 'skeleton-image--loaded' : ''}`} style={loaded ? undefined : { aspectRatio }}>
      {!loaded && <Skeleton className="skeleton-image__placeholder" height="100%" radius={0} />}
      <img
        {...img}
        className={className}
        onLoad={e => { setLoaded(true); onLoad?.(e); }}
        onError={e => { setLoaded(true); onError?.(e); }}
      />
    </span>
  );
}
