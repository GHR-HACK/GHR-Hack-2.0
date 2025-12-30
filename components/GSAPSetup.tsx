'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { TextPlugin } from 'gsap/TextPlugin';
import { SplitText } from 'gsap/SplitText';
import { enableScrollPerformanceMonitoring } from '../lib/useScrollTriggerAnimations';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, TextPlugin, SplitText);

export default function GSAPSetup() {
  useEffect(() => {
    // Ensure DOM elements are ready before initializing ScrollSmoother
    const wrapper = document.getElementById('smooth-wrapper');
    const content = document.getElementById('smooth-content');

    if (!wrapper || !content) {
      console.warn('ScrollSmoother: DOM elements not ready, using native scroll as fallback');
      return;
    }

    let smoother: ScrollSmoother | null = null;

    try {
      // Initialize ScrollSmoother with optimized settings
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5, // Reduced for better performance (was 0.9)
        effects: false, // disable extra effects to reduce GPU load
        normalizeScroll: true,
      });

      console.log('ScrollSmoother initialized successfully');

      // Optimized custom scrollbar animation - throttled updates
      let scrollbarUpdateTimeout: number | null = null;
      const updateScrollbar = () => {
        const scrollbarThumb = document.querySelector('.custom-scrollbar-thumb') as HTMLElement | null;
        if (!scrollbarThumb) return;

        const scrollHeight = document.documentElement.scrollHeight;
        const viewport = window.innerHeight;
        const scrollTop = smoother?.scrollTop() || 0;
        const maxScroll = scrollHeight - viewport || 1;
        const ratio = Math.max(viewport / scrollHeight, 0.05); // min thumb size
        const thumbHeightPct = ratio * 100;
        const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
        const translatePct = progress * (100 - thumbHeightPct);

        scrollbarThumb.style.height = `${thumbHeightPct}%`;
        scrollbarThumb.style.transform = `translateY(${translatePct}%)`;
      };

      // Throttled scrollbar update for better performance
      const throttledUpdateScrollbar = () => {
        if (scrollbarUpdateTimeout) return;
        scrollbarUpdateTimeout = requestAnimationFrame(() => {
          updateScrollbar();
          scrollbarUpdateTimeout = null;
        });
      };

      // Only update scrollbar on scroll end, not continuously
      ScrollTrigger.addEventListener("scrollEnd", throttledUpdateScrollbar);
      updateScrollbar();

      // Global GSAP settings
      gsap.set("html", { scrollBehavior: "unset" });

      // Enable performance monitoring in development
      if (process.env.NODE_ENV === 'development') {
        enableScrollPerformanceMonitoring(true);
      }

      // Add CSS class to animated elements for performance optimization
      gsap.set("[data-gsap]", { className: "+=gsap-animated" });

      // Cleanup function
      return () => {
        if (smoother) {
          smoother.kill();
        }
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        ScrollTrigger.removeEventListener("scrollEnd", throttledUpdateScrollbar);
        if (scrollbarUpdateTimeout !== null) cancelAnimationFrame(scrollbarUpdateTimeout);
      };
    } catch (error) {
      console.error('ScrollSmoother initialization failed:', error);

      // Cleanup any partial initialization
      if (smoother) {
        try {
          smoother.kill();
        } catch (e) {
          console.error('Error during ScrollSmoother cleanup:', e);
        }
      }
    }
  }, []);

  return null;
}
