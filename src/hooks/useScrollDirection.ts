import { useState, useEffect, useRef } from 'react';

interface ScrollDirectionOptions {
  threshold?: number;
  topThreshold?: number;
}

export function useScrollDirection({
  threshold = 12,
  topThreshold = 50,
}: ScrollDirectionOptions = {}) {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const prevScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const delta = currentScrollY - prevScrollY.current;

          setIsAtTop(currentScrollY <= topThreshold);
          setScrollY(currentScrollY);

          if (prefersReducedMotion) {
            // Keep header visible for reduced motion
            setScrollDirection('up');
          } else if (currentScrollY <= topThreshold) {
            setScrollDirection('up');
          } else if (Math.abs(delta) >= threshold) {
            setScrollDirection(delta > 0 ? 'down' : 'up');
          }

          prevScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, topThreshold]);

  // Header should be visible if at top, or scrolling up
  const isVisible = isAtTop || scrollDirection !== 'down';

  return {
    scrollDirection,
    isAtTop,
    scrollY,
    isVisible,
  };
}
