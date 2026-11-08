import { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import './IntroVideo.css';

/** Fired by the welcome tour's "Watch the video" button to open this player. */
export const PLAY_VIDEO_EVENT = 'immunly:play-video';

/**
 * Intro video modal, layered above the welcome tour. Shown only when something
 * dispatches PLAY_VIDEO_EVENT on `window`.
 */
export default function IntroVideo() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const replay = () => setVisible(true);
    window.addEventListener(PLAY_VIDEO_EVENT, replay);
    return () => window.removeEventListener(PLAY_VIDEO_EVENT, replay);
  }, []);

  // Escape closes the video only, not the welcome tour underneath it.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopImmediatePropagation();
      dismiss();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [visible]);

  useEffect(() => {
    if (visible && videoRef.current) {
      // Try to start playback; browsers may block autoplay with sound until the
      // user interacts, in which case the native controls / play button take over.
      const v = videoRef.current;
      v.currentTime = 0;
      v.play().catch(() => {/* autoplay blocked — user can press play */});
    }
  }, [visible]);

  function dismiss() {
    if (videoRef.current) videoRef.current.pause();
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 280);
  }

  if (!visible) return null;

  return (
    <div
      className={`intro-overlay ${closing ? 'intro-overlay--closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Immunly intro video"
    >
      <div className="intro-overlay__top">
        <Logo size={28} className="intro-overlay__logo" />
        <button className="intro-overlay__skip" onClick={dismiss}>Close ✕</button>
      </div>

      <div className="intro-overlay__video-wrap">
        <video
          ref={videoRef}
          className="intro-overlay__video"
          src="/intro.mp4"
          controls
          autoPlay
          playsInline
          onEnded={dismiss}
        />
      </div>

      <button className="btn btn-primary intro-overlay__enter" onClick={dismiss}>
        Close
      </button>
    </div>
  );
}
