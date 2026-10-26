import { useState, useRef, useEffect, useCallback } from 'react';

export type ScrollSpeedPreset = 'slow' | 'normal' | 'fast' | 'custom';

const SPEED_FACTORS: Record<Exclude<ScrollSpeedPreset, 'custom'>, number> = {
  slow: 0.5,
  normal: 1.2,
  fast: 2.4,
};

export function useAutoScroll() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speedPreset, setSpeedPreset] = useState<ScrollSpeedPreset>('normal');
  const [customSpeed, setCustomSpeed] = useState<number>(1.2); // px per frame

  const animationFrameRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);
  const isPausedRef = useRef(false);
  const speedRef = useRef(1.2);

  // Sync refs with state
  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (speedPreset === 'custom') {
      speedRef.current = customSpeed;
    } else {
      speedRef.current = SPEED_FACTORS[speedPreset];
    }
  }, [speedPreset, customSpeed]);

  const stop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsScrolling(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsPaused(true);
  }, []);

  const step = useCallback(() => {
    if (!isScrollingRef.current || isPausedRef.current) return;

    window.scrollBy({
      top: speedRef.current,
      behavior: 'auto',
    });

    // Check if reached bottom of document
    const isAtBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;

    if (isAtBottom) {
      stop();
      return;
    }

    animationFrameRef.current = requestAnimationFrame(step);
  }, [stop]);

  const resume = useCallback(() => {
    if (!isScrollingRef.current) {
      setIsScrolling(true);
    }
    setIsPaused(false);
    isPausedRef.current = false;
    isScrollingRef.current = true;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(step);
  }, [step]);

  const start = useCallback(() => {
    setIsScrolling(true);
    setIsPaused(false);
    isScrollingRef.current = true;
    isPausedRef.current = false;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(step);
  }, [step]);

  const setSpeed = useCallback((preset: ScrollSpeedPreset, customValue?: number) => {
    setSpeedPreset(preset);
    if (preset === 'custom' && customValue !== undefined) {
      setCustomSpeed(customValue);
      speedRef.current = customValue;
    } else if (preset !== 'custom') {
      speedRef.current = SPEED_FACTORS[preset];
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isScrolling,
    isPaused,
    speedPreset,
    customSpeed,
    start,
    pause,
    resume,
    stop,
    setSpeed,
  };
}
