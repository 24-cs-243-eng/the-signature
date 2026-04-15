import { useEffect, useRef } from "react";

/**
 * Plays a video element only when it is at least 40% visible in the viewport,
 * and pauses it when it scrolls out of view. This prevents videos from
 * downloading and auto-playing before the user has scrolled to them.
 */
export function useVideoAutoplay() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay was blocked — silently ignore
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return videoRef;
}
