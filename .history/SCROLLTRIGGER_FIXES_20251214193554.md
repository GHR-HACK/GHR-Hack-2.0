# ScrollTrigger Fixes - Complete Implementation Guide

## Setup: Create a Reusable ScrollTrigger Hook

First, create a custom hook to standardize ScrollTrigger usage across all components:

### File: `lib/useScrollTriggerAnimations.ts`

```tsx
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
  markerToggle?: string;
}

/**
 * Reusable hook for ScrollTrigger animations with proper cleanup
 * Prevents memory leaks and multiple registrations
 */
export const useScrollTriggerAnimations = (
  sectionRef: React.RefObject<HTMLElement>,
  animationSetup: (ctx: gsap.Context) => void,
  dependencyArray: React.DependencyList = []
) => {
  useEffect(() => {
    // Only create animations if section is visible in viewport
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Section is in viewport, create context and animations
            const ctx = gsap.context(() => {
              animationSetup(ctx);
            }, sectionRef);

            // Store context for cleanup
            (sectionRef.current as any).__gsapContext = ctx;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% is visible
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      
      // Clean up context properly
      if ((sectionRef.current as any)?.__gsapContext) {
        (sectionRef.current as any).__gsapContext.revert();
        delete (sectionRef.current as any).__gsapContext;
      }

      // Kill any remaining ScrollTriggers created for this section
      ScrollTrigger.getAll().forEach((trigger) => {
        if (
          trigger.trigger === sectionRef.current ||
          (trigger.trigger as Element)?.closest?.('[data-scroll-section]') === sectionRef.current
        ) {
          trigger.kill();
        }
      });
    };
  }, dependencyArray);
};

/**
 * Safe DOM query with error handling
 */
export const safeQuery = (
  selector: string,
  context?: Document | Element
): HTMLElement | null => {
  try {
    return (context || document).querySelector(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return null;
  }
};

/**
 * Safe query all with error handling
 */
export const safeQueryAll = (
  selector: string,
  context?: Document | Element
): HTMLElement[] => {
  try {
    return Array.from((context || document).querySelectorAll(selector));
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return [];
  }
};

/**
 * Create ScrollTrigger with automatic cleanup
 */
export const createManagedScrollTrigger = (
  config: ScrollTriggerConfig & { onEnter?: () => void; onUpdate?: (progress: number) => void }
) => {
  const trigger = ScrollTrigger.create({
    ...config,
    onEnter: config.onEnter,
    onUpdate: config.onUpdate ? (self) => config.onUpdate?.(self.progress) : undefined,
  });

  return trigger;
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Animate elements with reduced motion support
 */
export const gsapAnimateWithA11y = (
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars
) => {
  if (prefersReducedMotion()) {
    // Skip animations for accessibility
    return gsap.set(targets, {
      ...Object.fromEntries(
        Object.entries(vars)
          .filter(([key]) => !['duration', 'delay', 'ease'].includes(key))
      ),
    });
  }
  return gsap.to(targets, vars);
};
```

---

## Fixed Components

### 1. Fix: PrizeSection.tsx

**Changes:**
- Remove created DOM elements after animation
- Use safe queries
- Add cleanup
- Remove Physics2D memory leak

```tsx
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { prizes } from '../lib/data';
import {
  useScrollTriggerAnimations,
  safeQuery,
  prefersReducedMotion,
  gsapAnimateWithA11y,
} from '../lib/useScrollTriggerAnimations';

gsap.registerPlugin(ScrollTrigger, Physics2DPlugin);

export default function PrizeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const animationKillersRef = useRef<(() => void)[]>([]);

  const setupAnimations = useCallback((ctx: gsap.Context) => {
    if (prefersReducedMotion()) {
      // Skip complex animations for accessibility
      gsap.set('.prize-card', { opacity: 1, y: 0 });
      return;
    }

    // Simplified prize card animation
    const prizeCards = safeQuery('[data-scroll-section] .prize-card');
    if (prizeCards) {
      gsapAnimateWithA11y('.prize-card', {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power1.out',
        stagger: 0.08,
      });
    }

    // Prize amount counter + falling coins/notes
    const amountEl = safeQuery('.prize-amount', sectionRef.current || undefined);
    if (!amountEl) return;

    const obj = { val: 1 };
    const target = 80000;

    ScrollTrigger.create({
      trigger: amountEl,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsapAnimateWithA11y(obj, {
          val: target,
          duration: 1.4,
          ease: 'power3.out',
          onUpdate: () => {
            if (amountEl) {
              amountEl.textContent = `₹${Math.floor(obj.val).toLocaleString()}+`;
            }
          },
        });

        // Falling coins and notes - WITH CLEANUP
        const poolLayer = safeQuery('.prize-pool-layer', sectionRef.current || undefined);
        const pool = safeQuery('.prize-pool', sectionRef.current || undefined);

        if (poolLayer && pool) {
          const lr = poolLayer.getBoundingClientRect();
          const pr = pool.getBoundingClientRect();
          const floorY = pr.bottom - lr.top - 12;
          const leftBound = pr.left - lr.left + 10;
          const rightBound = pr.right - lr.left - 10;
          const green = '#22c55e';
          const darkGreen = '#16a34a';
          const gold = '#f59e0b';
          const lightGold = '#fbbf24';
          const coinCount = prefersReducedMotion() ? 0 : 15; // Fewer elements
          const noteCount = prefersReducedMotion() ? 0 : 30;

          const createdElements: HTMLElement[] = [];

          // Coins
          for (let i = 0; i < coinCount; i++) {
            const coin = document.createElement('div');
            coin.style.position = 'absolute';
            coin.style.left = `${pr.left - lr.left + pr.width / 2}px`;
            coin.style.top = `${pr.top - lr.top - 20}px`;
            const size = gsap.utils.random(10, 16);
            coin.style.width = `${size}px`;
            coin.style.height = `${size}px`;
            coin.style.borderRadius = '50%';
            coin.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.75), transparent 40%), linear-gradient(135deg, ${gold}, ${lightGold})`;
            coin.style.boxShadow = '0 0 10px rgba(245,158,11,0.35)';
            coin.style.border = '1px solid rgba(245,158,11,0.5)';
            coin.style.pointerEvents = 'none'; // Prevent interaction
            poolLayer.appendChild(coin);
            createdElements.push(coin);

            const tween = gsap.to(coin, {
              physics2D: {
                velocity: gsap.utils.random(280, 520),
                angle: gsap.utils.random(80, 100),
                gravity: gsap.utils.random(900, 1200),
              },
              rotation: gsap.utils.random(-360, 360),
              duration: gsap.utils.random(1.0, 1.8),
              ease: 'none',
              onComplete: () => {
                const finalX = gsap.utils.random(leftBound, rightBound);
                const finalY = floorY - gsap.utils.random(6, pr.height * 0.25);
                gsap.set(coin, { left: `${finalX}px`, top: `${finalY}px`, x: 0, y: 0 });
                coin.style.opacity = '1';
              },
            });

            // Store kill function for cleanup
            animationKillersRef.current.push(() => {
              tween.kill();
            });
          }

          // Notes
          for (let i = 0; i < noteCount; i++) {
            const note = document.createElement('div');
            note.style.position = 'absolute';
            note.style.left = `${pr.left - lr.left + pr.width / 2}px`;
            note.style.top = `${pr.top - lr.top - 20}px`;
            const w = gsap.utils.random(18, 28);
            const h = gsap.utils.random(10, 14);
            note.style.width = `${w}px`;
            note.style.height = `${h}px`;
            note.style.borderRadius = '3px';
            note.style.background = `linear-gradient(135deg, ${green}, ${darkGreen})`;
            note.style.boxShadow = '0 0 8px rgba(34,197,94,0.25)';
            note.style.pointerEvents = 'none';
            
            const band = document.createElement('div');
            band.style.position = 'absolute';
            band.style.left = '20%';
            band.style.top = '35%';
            band.style.width = '60%';
            band.style.height = '30%';
            band.style.background = 'rgba(255,255,255,0.25)';
            band.style.borderRadius = '2px';
            note.appendChild(band);
            poolLayer.appendChild(note);
            createdElements.push(note);

            const tween = gsap.to(note, {
              physics2D: {
                velocity: gsap.utils.random(260, 480),
                angle: gsap.utils.random(80, 100),
                gravity: gsap.utils.random(900, 1200),
              },
              rotation: gsap.utils.random(-90, 90),
              duration: gsap.utils.random(1.0, 1.8),
              ease: 'none',
              onComplete: () => {
                const finalX = gsap.utils.random(leftBound, rightBound);
                const finalY = floorY - gsap.utils.random(6, pr.height * 0.22);
                gsap.set(note, { left: `${finalX}px`, top: `${finalY}px`, x: 0, y: 0 });
                note.style.opacity = '1';
              },
            });

            animationKillersRef.current.push(() => {
              tween.kill();
            });
          }

          // Store cleanup function for DOM removal
          const cleanupElements = () => {
            createdElements.forEach((el) => {
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
            });
          };
          animationKillersRef.current.push(cleanupElements);
        }
      },
    });
  }, []);

  useScrollTriggerAnimations(sectionRef, setupAnimations);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      animationKillersRef.current.forEach((killer) => {
        try {
          killer();
        } catch (error) {
          console.error('Error in animation cleanup:', error);
        }
      });
      animationKillersRef.current = [];
    };
  }, []);

  return (
    <section
      id="prizes"
      ref={sectionRef}
      data-scroll-section
      className="py-20 md:py-32 bg-white"
    >
      <Container>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <Title level={2} variant="gradient" size="xl" className="mb-8">
              Prize Pool
            </Title>
            <div className="inline-block px-8 py-4 bg-gradient-to-r from-primary-orange/10 to-primary-purple/10 rounded-lg border border-primary-orange/20">
              <p className="text-4xl md:text-5xl font-red-hat-display font-bold gradient-text">
                <span className="prize-amount">₹1+</span>
              </p>
            </div>
            <p className="text-lg text-white/70 font-red-hat-display max-w-2xl mx-auto mt-4">
              Compete and win amazing prizes
            </p>
          </div>

          <div className="prize-pool-layer relative w-full h-96 bg-gradient-to-b from-white/5 to-white/10 rounded-lg border border-white/10 overflow-hidden">
            <div className="prize-pool absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl px-8">
                {prizes.map((prize, index) => (
                  <Card
                    key={index}
                    variant="elevated"
                    className="prize-card text-center"
                  >
                    <div className="p-6">
                      <div className="text-3xl mb-2">
                        {['🥇', '🥈', '🥉'][index] || '🏆'}
                      </div>
                      <h5 className="text-lg font-bold text-white mb-2">
                        {prize.position}
                      </h5>
                      <p className="text-xl font-bold gradient-text">
                        {prize.amount}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

---

### 2. Fix: EventTimeline.tsx

**Changes:**
- Remove custom cleanup on DOM elements
- Use proper context cleanup
- Add throttling for resize
- Fix unsafe measurements

```tsx
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { eventTimeline } from '../lib/data';
import {
  useScrollTriggerAnimations,
  safeQuery,
  safeQueryAll,
  prefersReducedMotion,
  gsapAnimateWithA11y,
} from '../lib/useScrollTriggerAnimations';

gsap.registerPlugin(ScrollTrigger);

export default function EventTimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setupAnimations = useCallback((ctx: gsap.Context) => {
    if (prefersReducedMotion()) {
      gsap.set('.timeline-item', { opacity: 1, x: 0 });
      return;
    }

    // Ultra-light timeline animation
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsapAnimateWithA11y('.timeline-item', {
          x: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power1.out',
          stagger: 0.06,
        });
      },
    });

    // Timeline progress line tracking
    const container = safeQuery('.timeline-container', sectionRef.current || undefined);
    const progressEl = safeQuery('.timeline-progress', sectionRef.current || undefined);

    if (!container || !progressEl) return;

    ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      onUpdate: (self) => {
        const height = self.progress * (container as HTMLElement).clientHeight;
        gsap.to(progressEl, { height, duration: 0.2, ease: 'power2.out' });
      },
    });

    const alignDots = () => {
      const progressRect = progressEl.getBoundingClientRect();
      const progressCenterX = progressRect.left + progressRect.width / 2;

      safeQueryAll('.timeline-item', sectionRef.current || undefined).forEach((el) => {
        const itemRect = el.getBoundingClientRect();
        const dot = safeQuery('.timeline-dot', el);
        if (dot) {
          const leftPx = progressCenterX - itemRect.left;
          dot.style.left = `${leftPx}px`;
          dot.style.transform = 'translate(-50%, -50%)';
        }
      });
    };

    // Initial alignment
    alignDots();

    // Throttled resize handler
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        alignDots();
        resizeTimeoutRef.current = null;
      }, 150);
    };

    const handleRefresh = () => {
      alignDots();
    };

    window.addEventListener('resize', handleResize);
    ScrollTrigger.addEventListener('refresh', handleRefresh);

    // Cleanup function
    ctx.add(() => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.removeEventListener('refresh', handleRefresh);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    });
  }, []);

  useScrollTriggerAnimations(sectionRef, setupAnimations);

  return (
    <section
      id="schedule"
      ref={sectionRef}
      data-scroll-section
      className="py-16 md:py-24 bg-white"
    >
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <Title level={3} variant="gradient" size="lg" className="text-center mb-12">
            Event Timeline
          </Title>
          <Card variant="gradient" className="p-8">
            <div className="relative timeline-container">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[6px] bg-white/20 rounded-full" />
              <div
                className="absolute left-1/2 -translate-x-1/2 top-0 w-[6px] rounded-full bg-gradient-to-b from-primary-orange to-primary-purple shadow-[0_0_16px_rgba(104,11,125,0.35)] timeline-progress"
                style={{ height: 0 }}
              />
              <div className="space-y-10 md:space-y-8">
                {eventTimeline.map((event, index) => (
                  <div
                    key={index}
                    className="timeline-item flex gap-4 md:gap-8 items-start"
                    data-side={index % 2 === 0 ? 'left' : 'right'}
                  >
                    <div className="relative flex-shrink-0 pt-2">
                      <div
                        className="timeline-dot absolute w-4 h-4 rounded-full"
                        style={{
                          background: 'linear-gradient(180deg, #1f2937, #111827)',
                          left: 'calc(50% - 8px)',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-sm font-semibold text-primary-orange mb-1">
                          {event.time}
                        </p>
                        <h4 className="text-lg font-bold text-white mb-2">
                          {event.title}
                        </h4>
                        <p className="text-sm text-white/70">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
```

---

### 3. Fix: Sponsors.tsx

**Changes:**
- Remove conflicting animations
- Fix toggleActions
- Use safe queries
- Standardize timing

```tsx
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { sponsors } from '../lib/data';
import {
  useScrollTriggerAnimations,
  prefersReducedMotion,
  gsapAnimateWithA11y,
} from '../lib/useScrollTriggerAnimations';

gsap.registerPlugin(ScrollTrigger);

export default function Sponsors() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const setupAnimations = useCallback((ctx: gsap.Context) => {
    if (prefersReducedMotion()) {
      gsap.set('[data-scroll-section] .sponsor-tier, [data-scroll-section] .sponsor-card', {
        opacity: 1,
        y: 0,
      });
      return;
    }

    // Single coordinated animation for all sponsor elements
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsapAnimateWithA11y('[data-scroll-section] .sponsor-tier', {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
        });

        gsapAnimateWithA11y('[data-scroll-section] .sponsor-card', {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          stagger: 0.08,
          delay: 0.2,
        });
      },
    });
  }, []);

  useScrollTriggerAnimations(sectionRef, setupAnimations);

  const renderSponsorTier = (
    tier: string,
    sponsorList: any[],
    tierClass: string,
    titleColor: string
  ) => (
    <div key={tier} className={`sponsor-tier mb-12 ${tierClass}`}>
      <Title
        level={4}
        variant="default"
        size="md"
        className={`text-center mb-8 ${titleColor}`}
      >
        {tier} Sponsor{tier === 'Gold' ? '' : 's'}
      </Title>
      <div className="flex flex-wrap justify-center gap-8">
        {sponsorList.map((sponsor, index) => (
          <Card
            key={index}
            variant="elevated"
            hover
            className="sponsor-card group"
            style={{
              opacity: 0,
              transform: 'scale(0.8)',
            }}
          >
            <div className="p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-primary-orange/20 to-primary-purple/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl font-red-hat-display font-bold text-white">
                  {sponsor.name.charAt(0)}
                </span>
              </div>
              <h5 className="text-xl font-red-hat-display font-bold text-white group-hover:gradient-text transition-all duration-300">
                {sponsor.name}
              </h5>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <section
      id="sponsors"
      ref={sectionRef}
      data-scroll-section
      className="py-20 md:py-32 bg-white"
    >
      <Container>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <Title level={2} variant="gradient" size="xl" className="sponsors-title mb-8">
              Our Sponsors
            </Title>
            <p className="text-lg text-white/70 font-red-hat-display max-w-2xl mx-auto">
              Proudly supported by industry leaders and organizations that believe in fostering
              innovation and creativity.
            </p>
          </div>

          <div className="sponsors-grid space-y-16">
            {/* Organize sponsors by tier and render */}
            {renderSponsorTier(
              'Gold',
              sponsors.filter((s) => s.tier === 'gold'),
              'gold-sponsors',
              'text-yellow-400'
            )}
            {renderSponsorTier(
              'Silver',
              sponsors.filter((s) => s.tier === 'silver'),
              'silver-sponsors',
              'text-gray-400'
            )}
            {renderSponsorTier(
              'Bronze',
              sponsors.filter((s) => s.tier === 'bronze'),
              'bronze-sponsors',
              'text-orange-400'
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
```

---

### 4. Fix: Organizers.tsx

**Changes:**
- Remove toggleActions reverse
- Use safe queries
- Add accessibility
- Use custom hook

```tsx
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { organizers } from '../lib/data';
import {
  useScrollTriggerAnimations,
  safeQueryAll,
  prefersReducedMotion,
  gsapAnimateWithA11y,
} from '../lib/useScrollTriggerAnimations';

gsap.registerPlugin(ScrollTrigger);

export default function Organizers() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const setupAnimations = useCallback((ctx: gsap.Context) => {
    if (prefersReducedMotion()) {
      gsap.set('[data-scroll-section] .organizer-title, [data-scroll-section] .organizer-card', {
        opacity: 1,
        y: 0,
      });
      return;
    }

    // Animate section title
    gsapAnimateWithA11y('[data-scroll-section] .organizers-title', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    });

    // Animate organizer cards with ScrollTrigger.batch
    ScrollTrigger.batch('[data-scroll-section] .organizer-card', {
      trigger: '[data-scroll-section] .organizers-grid',
      start: 'top 80%',
      once: true,
      onEnter: (batch) => {
        (batch as HTMLElement[]).forEach((el, idx) => {
          gsapAnimateWithA11y(el, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: idx * 0.1,
          });
        });
      },
    });
  }, []);

  useScrollTriggerAnimations(sectionRef, setupAnimations);

  const teamRoles = [
    {
      key: 'technical',
      title: 'Technical Team',
      color: 'text-blue-400',
      icon: '💻',
    },
    {
      key: 'design',
      title: 'Design Team',
      color: 'text-pink-400',
      icon: '🎨',
    },
    {
      key: 'marketing',
      title: 'Marketing Team',
      color: 'text-green-400',
      icon: '📢',
    },
    {
      key: 'finance',
      title: 'Finance Team',
      color: 'text-yellow-400',
      icon: '💰',
    },
    {
      key: 'logistic',
      title: 'Logistics Team',
      color: 'text-purple-400',
      icon: '🚚',
    },
    {
      key: 'operations',
      title: 'Operations Team',
      color: 'text-red-400',
      icon: '⚙️',
    },
  ];

  return (
    <section
      id="team"
      ref={sectionRef}
      data-scroll-section
      className="py-20 md:py-32 bg-white"
    >
      <Container>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <Title
              level={2}
              variant="gradient"
              size="xl"
              className="organizers-title mb-8"
            >
              Meet Our Team
            </Title>
            <p className="text-lg text-gray-600 font-red-hat-display max-w-2xl mx-auto">
              The passionate individuals behind GHR Hack 2.0, working tirelessly to make this
              event unforgettable.
            </p>
          </div>

          <div className="organizers-grid space-y-16">
            {/* Render team members by role */}
            {teamRoles.map((role) => (
              <div key={role.key}>
                <Title
                  level={3}
                  variant="default"
                  size="lg"
                  className={`text-center mb-8 ${role.color}`}
                >
                  {role.icon} {role.title}
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(organizers[role.key as keyof typeof organizers] || []).map(
                    (member, index) => (
                      <Card
                        key={index}
                        variant="elevated"
                        className="organizer-card"
                        style={{
                          opacity: 0,
                          transform: 'translateY(30px)',
                        }}
                      >
                        <div className="p-6 text-center">
                          <h5 className="text-lg font-bold text-white mb-1">
                            {member.name}
                          </h5>
                          <p className="text-sm text-white/70">{member.role}</p>
                        </div>
                      </Card>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
```

---

### 5. Fix: FAQs.tsx

**Changes:**
- Remove autoAlpha workaround
- Fix with proper initialization
- Add accessibility
- Simplify code

```tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { faqs } from '../lib/data';
import {
  useScrollTriggerAnimations,
  safeQueryAll,
  prefersReducedMotion,
  gsapAnimateWithA11y,
} from '../lib/useScrollTriggerAnimations';

gsap.registerPlugin(ScrollTrigger);

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const faqRefs = useRef<HTMLDivElement[]>([]);

  const setupAnimations = useCallback((ctx: gsap.Context) => {
    if (prefersReducedMotion()) {
      gsap.set('[data-scroll-section] .faq-item', { opacity: 1, y: 0 });
      return;
    }

    // Animate section title
    gsapAnimateWithA11y('[data-scroll-section] .faqs-title', {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
    });

    // Animate FAQ items with batch for reliability
    ScrollTrigger.batch('[data-scroll-section] .faq-item', {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => {
        (batch as HTMLElement[]).forEach((el, idx) => {
          gsapAnimateWithA11y(el, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            delay: idx * 0.05,
          });
        });
      },
    });
  }, []);

  useScrollTriggerAnimations(sectionRef, setupAnimations);

  const toggleFAQ = (index: number) => {
    const currentRef = faqRefs.current[index];
    if (!currentRef) return;

    if (openIndex === index) {
      // Close current FAQ
      const answer = currentRef.querySelector('.faq-answer');
      const icon = currentRef.querySelector('.faq-icon');

      if (answer) {
        gsap.to(answer, {
          height: 0,
          opacity: 0,
          paddingTop: 0,
          paddingBottom: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => setOpenIndex(null),
        });
      }

      if (icon) {
        gsap.to(icon, {
          rotation: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        });
      }
    } else {
      // Close previously open FAQ
      if (openIndex !== null && faqRefs.current[openIndex]) {
        const prevRef = faqRefs.current[openIndex];
        const prevAnswer = prevRef.querySelector('.faq-answer');
        const prevIcon = prevRef.querySelector('.faq-icon');

        if (prevAnswer) {
          gsap.to(prevAnswer, {
            height: 0,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0,
            duration: 0.3,
            ease: 'power2.inOut',
          });
        }

        if (prevIcon) {
          gsap.to(prevIcon, {
            rotation: 0,
            duration: 0.3,
            ease: 'power2.inOut',
          });
        }
      }

      // Open new FAQ
      const answer = currentRef.querySelector('.faq-answer');
      const icon = currentRef.querySelector('.faq-icon');

      if (answer) {
        gsap.fromTo(
          answer,
          { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 },
          {
            height: 'auto',
            opacity: 1,
            paddingTop: 12,
            paddingBottom: 12,
            duration: 0.3,
            ease: 'power2.inOut',
          }
        );
      }

      if (icon) {
        gsap.to(icon, {
          rotation: 180,
          duration: 0.3,
          ease: 'power2.inOut',
        });
      }

      setOpenIndex(index);
    }
  };

  return (
    <section
      id="faqs"
      ref={sectionRef}
      data-scroll-section
      className="py-16 md:py-24 bg-white"
    >
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <Title
            level={3}
            variant="gradient"
            size="lg"
            className="faqs-title text-center mb-12"
            style={{
              opacity: 0,
              transform: 'translateY(50px)',
            }}
          >
            Frequently Asked Questions
          </Title>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                variant="elevated"
                className="faq-item cursor-pointer overflow-hidden"
                onClick={() => toggleFAQ(index)}
                style={{
                  opacity: 0,
                  transform: 'translateY(30px)',
                }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white flex-1">
                      {faq.question}
                    </h4>
                    <div
                      className="faq-icon flex-shrink-0 ml-4 transition-transform"
                      style={{
                        transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                        transformOrigin: 'center',
                      }}
                    >
                      <svg
                        className="w-6 h-6 text-primary-orange"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  </div>

                  {openIndex === index && (
                    <div
                      className="faq-answer mt-4 text-white/70"
                      style={{
                        height: 'auto',
                        opacity: 1,
                        paddingTop: 12,
                        paddingBottom: 12,
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
```

---

### 6. Fix: GSAPSetup.tsx

**Changes:**
- Don't kill all ScrollTriggers
- Proper cleanup
- Add safety checks
- Handle edge cases

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { TextPlugin } from 'gsap/TextPlugin';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, TextPlugin, SplitText);

export default function GSAPSetup() {
  const smoother Ref = useRef<InstanceType<typeof ScrollSmoother> | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize ScrollSmoother
    try {
      const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 0.9,
        effects: false,
        normalizeScroll: true,
      });
      smootherRef.current = smoother;
    } catch (error) {
      console.error('Failed to initialize ScrollSmoother:', error);
      return;
    }

    // Custom scrollbar animation
    const updateScrollbar = () => {
      const scrollbarThumb = document.querySelector('.custom-scrollbar-thumb') as
        | HTMLElement
        | null;
      if (!scrollbarThumb || !smootherRef.current) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const viewport = window.innerHeight;

      // Safety checks
      if (viewport <= 0 || scrollHeight <= 0) return;

      const scrollTop = smootherRef.current.scrollTop() ?? 0;
      const maxScroll = Math.max(scrollHeight - viewport, 1);
      const ratio = Math.max(Math.min(viewport / scrollHeight, 1), 0.05);
      const thumbHeightPct = ratio * 100;
      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      const translatePct = progress * (100 - thumbHeightPct);

      scrollbarThumb.style.height = `${thumbHeightPct}%`;
      scrollbarThumb.style.transform = `translateY(${translatePct}%)`;
    };

    // Update scrollbar on scroll with throttling
    let rafId: number | null = null;
    const handleScrollStart = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateScrollbar();
        rafId = null;
      });
      rafIdRef.current = rafId;
    };

    const handleScrollEnd = () => {
      updateScrollbar();
    };

    ScrollTrigger.addEventListener('scrollStart', handleScrollStart);
    ScrollTrigger.addEventListener('scrollEnd', handleScrollEnd);
    updateScrollbar();

    // Global GSAP settings
    gsap.set('html', { scrollBehavior: 'unset' });

    // Cleanup function
    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
        smootherRef.current = null;
      }

      ScrollTrigger.removeEventListener('scrollStart', handleScrollStart);
      ScrollTrigger.removeEventListener('scrollEnd', handleScrollEnd);

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      // Note: Do NOT kill all ScrollTriggers here - let each component manage its own
    };
  }, []);

  return null;
}
```

---

## Installation & Testing

1. **Create the new hook file**:
   ```bash
   touch lib/useScrollTriggerAnimations.ts
   ```

2. **Replace all component files** with the fixed versions above

3. **Test the following edge cases**:
   - ✅ Rapid scrolling
   - ✅ Component mount/unmount
   - ✅ Fast navigation between sections
   - ✅ Browser console - check for memory leaks (DevTools Memory Profiler)
   - ✅ Mobile viewport
   - ✅ Accessibility (keyboard navigation, reduced motion)

4. **Performance testing**:
   - Run Lighthouse audit
   - Check DevTools Performance tab during scroll
   - Monitor memory usage over time

