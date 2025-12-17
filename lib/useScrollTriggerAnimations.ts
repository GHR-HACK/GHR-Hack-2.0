'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollTriggerConfig {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  once?: boolean;
  toggleActions?: string;
}

/**
 * Reusable hook for ScrollTrigger animations with proper cleanup
 * Prevents memory leaks and multiple registrations
 * 
 * @param sectionRef - Reference to the section element
 * @param animationSetup - Function that sets up animations within a context
 * @param dependencyArray - Optional dependency array for the effect
 */
export const useScrollTriggerAnimations = (
  sectionRef: React.RefObject<HTMLElement>,
  animationSetup: (ctx: gsap.Context) => void,
  dependencyArray: React.DependencyList = []
) => {
  useEffect(() => {
    // Only create animations if section exists
    if (!sectionRef.current) return;

    // Create context and run animation setup
    const ctx = gsap.context(() => {
      animationSetup(ctx);
    }, sectionRef);

    // Cleanup function
    return () => {
      ctx.revert();
    };
  }, dependencyArray);
};

/**
 * Safe DOM query with error handling
 * @param selector - CSS selector string
 * @param context - Optional context element (defaults to document)
 * @returns HTMLElement or null
 */
export const safeQuery = (
  selector: string,
  context?: Document | Element
): HTMLElement | null => {
  try {
    if (!selector) return null;
    return (context || document).querySelector(selector) as HTMLElement | null;
  } catch (error) {
    console.warn(`Invalid selector: "${selector}"`, error);
    return null;
  }
};

/**
 * Safe query all with error handling
 * @param selector - CSS selector string
 * @param context - Optional context element (defaults to document)
 * @returns Array of HTMLElements (empty array if no matches)
 */
export const safeQueryAll = (
  selector: string,
  context?: Document | Element
): HTMLElement[] => {
  try {
    if (!selector) return [];
    return Array.from((context || document).querySelectorAll(selector));
  } catch (error) {
    console.warn(`Invalid selector: "${selector}"`, error);
    return [];
  }
};

/**
 * Check if user prefers reduced motion for accessibility
 * @returns boolean - true if user has prefers-reduced-motion enabled
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Animate elements with reduced motion accessibility support
 * Skips animations if user prefers reduced motion
 * 
 * @param targets - GSAP targets
 * @param vars - GSAP animation variables
 * @returns GSAP Tween or Tween-like object
 */
export const gsapAnimateWithA11y = (
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars
) => {
  if (prefersReducedMotion()) {
    // Skip animations for accessibility - just set final state
    const staticVars: Record<string, any> = {};
    
    // Copy all non-timing properties
    Object.entries(vars).forEach(([key, value]) => {
      if (!['duration', 'delay', 'ease', 'stagger', 'onComplete', 'onUpdate'].includes(key)) {
        staticVars[key] = value;
      }
    });

    return gsap.set(targets, staticVars);
  }
  
  return gsap.to(targets, vars);
};

/**
 * Create a managed ScrollTrigger with cleanup support
 * @param config - ScrollTrigger configuration
 * @returns ScrollTrigger instance
 */
export const createManagedScrollTrigger = (
  config: ScrollTriggerConfig & { 
    onEnter?: () => void; 
    onUpdate?: (progress: number) => void;
    onLeave?: () => void;
  }
) => {
  const trigger = ScrollTrigger.create({
    ...config,
    onEnter: config.onEnter,
    onLeave: config.onLeave,
    onUpdate: config.onUpdate ? (self) => config.onUpdate?.(self.progress) : undefined,
  });

  return trigger;
};

/**
 * Batch query helper - safely get multiple elements
 * @param selectors - Array of CSS selectors
 * @param context - Optional context element
 * @returns Object with selector keys and HTMLElement values
 */
export const safeQueryBatch = (
  selectors: Record<string, string>,
  context?: Document | Element
): Record<string, HTMLElement | null> => {
  const result: Record<string, HTMLElement | null> = {};
  
  Object.entries(selectors).forEach(([key, selector]) => {
    result[key] = safeQuery(selector, context);
  });

  return result;
};

/**
 * Debounce function for resize/scroll events
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = (fn: () => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(fn, delay);
  };
};

/**
 * Throttle function for frequent events
 * @param fn - Function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled function
 */
export const throttle = (fn: () => void, delay: number) => {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  
  return () => {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      fn();
      lastCall = now;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn();
        lastCall = Date.now();
      }, delay - (now - lastCall));
    }
  };
};

/**
 * Check if element is in viewport
 * @param element - Element to check
 * @param threshold - Optional intersection threshold (0-1)
 * @returns boolean - true if element is in viewport
 */
export const isInViewport = (element: HTMLElement, threshold: number = 0.1): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
};

/**
 * Cleanup helper - removes element from DOM safely
 * @param element - Element to remove
 */
export const safeRemoveElement = (element: HTMLElement | null | undefined) => {
  if (element?.parentNode) {
    try {
      element.parentNode.removeChild(element);
    } catch (error) {
      console.warn('Failed to remove element:', error);
    }
  }
};

/**
 * Kill all animations on a target
 * @param target - Animation target
 */
export const killAnimations = (target: gsap.TweenTarget) => {
  gsap.killTweensOf(target);
};

/**
 * Performance monitoring for scroll animations
 * @param enable - Whether to enable performance monitoring
 */
export const enableScrollPerformanceMonitoring = (enable: boolean = true) => {
  if (!enable || typeof window === 'undefined') return;

  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 60;

  const measureFPS = () => {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      frameCount = 0;
      lastTime = currentTime;

      // Log low FPS warnings
      if (fps < 30) {
        console.warn(`Low FPS detected: ${fps}. Scroll animations may be causing performance issues.`);
      }
    }

    requestAnimationFrame(measureFPS);
  };

  requestAnimationFrame(measureFPS);

  // Monitor ScrollTrigger instances
  const checkScrollTriggerCount = () => {
    const triggerCount = ScrollTrigger.getAll().length;
    if (triggerCount > 20) {
      console.warn(`High number of ScrollTrigger instances: ${triggerCount}. Consider optimizing animations.`);
    }
  };

  // Check every 5 seconds
  setInterval(checkScrollTriggerCount, 5000);
};