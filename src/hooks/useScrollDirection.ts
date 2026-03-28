import { useState, useEffect, useCallback, useRef } from 'react';

type ScrollDirection = 'up' | 'down' | null;

export const useScrollDirection = (threshold = 10) => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollDir = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (Math.abs(currentScrollY - lastScrollY.current) < threshold) {
      ticking.current = false;
      return;
    }

    setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
    setScrollY(currentScrollY);
    lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
    ticking.current = false;
  }, [threshold]);

  const onScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(updateScrollDir);
      ticking.current = true;
    }
  }, [updateScrollDir]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return { scrollDirection, scrollY };
};
