"use client";
import { useEffect, useState } from "react";

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if user has "prefers-reduced-motion: reduce" set
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/**
 * Hook to get motion-safe transition config
 * Returns zero-duration transitions when reduced motion is preferred
 */
export function useMotionSafeTransition(config: { duration?: number; ease?: any } = {}) {
  const reduced = useReducedMotion();
  
  return reduced 
    ? { duration: 0, ...config }
    : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1], ...config };
}

/**
 * Hook for spring config that respects reduced motion
 */
export function useMotionSafeSpring(config: { damping?: number; stiffness?: number } = {}) {
  const reduced = useReducedMotion();
  
  return reduced
    ? { type: "tween", duration: 0 }
    : { type: "spring", damping: 25, stiffness: 200, ...config };
}