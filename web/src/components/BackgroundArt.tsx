import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './BackgroundArt.css';

/** Which piece of artwork sits behind each section of the site. */
function artFor(path: string): string {
  if (path === '/') return '/intro2.webp';
  if (path.startsWith('/courses') || path.startsWith('/module')) return '/intro1.webp';
  if (path.startsWith('/research')) return '/intro2.webp';
  if (path.startsWith('/progress')) return '/intro1.webp';
  return '/pic2.webp';
}

/**
 * A fixed, translucent layer of immune-cell artwork behind every page, so the
 * background is never just a flat fill. It crossfades when the route changes
 * and drifts slightly slower than the page as you scroll.
 */
export default function BackgroundArt() {
  const { pathname } = useLocation();
  const src = artFor(pathname);
  // Two stacked layers: the new image fades in over the previous one
  const [layers, setLayers] = useState<{ src: string; key: number }[]>([{ src, key: 0 }]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLayers((prev) => {
      if (prev[prev.length - 1].src === src) return prev;
      return [prev[prev.length - 1], { src, key: prev[prev.length - 1].key + 1 }];
    });
  }, [src]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        rootRef.current?.style.setProperty('--art-shift', `${Math.min(window.scrollY, 2400) * -0.04}px`);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="bg-art" ref={rootRef} aria-hidden="true">
      {layers.map((l, i) => (
        <div
          key={l.key}
          className={`bg-art__layer ${i === layers.length - 1 ? 'bg-art__layer--in' : ''}`}
          style={{ backgroundImage: `url('${l.src}')` }}
        />
      ))}
    </div>
  );
}
