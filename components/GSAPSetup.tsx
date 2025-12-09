'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { TextPlugin } from 'gsap/TextPlugin';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, TextPlugin, SplitText);

export default function GSAPSetup() {
  useEffect(() => {
    // Initialize ScrollSmoother
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 0.9, // lighter smoothing for better performance
      effects: false, // disable extra effects to reduce GPU load
      normalizeScroll: true,
    });

    // Custom scrollbar animation
    const updateScrollbar = () => {
      const scrollbarThumb = document.querySelector('.custom-scrollbar-thumb') as HTMLElement | null;
      if (!scrollbarThumb) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const viewport = window.innerHeight;
      const scrollTop = smoother.scrollTop();
      const maxScroll = scrollHeight - viewport || 1;
      const ratio = Math.max(viewport / scrollHeight, 0.05); // min thumb size
      const thumbHeightPct = ratio * 100;
      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      const translatePct = progress * (100 - thumbHeightPct);

      scrollbarThumb.style.height = `${thumbHeightPct}%`;
      scrollbarThumb.style.transform = `translateY(${translatePct}%)`;
    };

    // Update scrollbar on scroll
    let rafId: number | null = null;
    const handleScrollStart = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateScrollbar();
        rafId = null;
      });
    };
    const handleScrollEnd = () => updateScrollbar();

    ScrollTrigger.addEventListener("scrollStart", handleScrollStart);
    ScrollTrigger.addEventListener("scrollEnd", handleScrollEnd);
    updateScrollbar();

    // Global GSAP settings
    gsap.set("html", { scrollBehavior: "unset" });

    // Cleanup function
    return () => {
      smoother.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ScrollTrigger.removeEventListener("scrollStart", handleScrollStart);
      ScrollTrigger.removeEventListener("scrollEnd", handleScrollEnd);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
