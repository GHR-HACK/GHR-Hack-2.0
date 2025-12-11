'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Container from './ui/Container';
import { eventTimeline } from '../lib/data';

gsap.registerPlugin(ScrollTrigger, Physics2DPlugin);

export default function EventTimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline items reveal
      ScrollTrigger.batch('.timeline-item', {
        interval: 0.1,
        batchMax: 6,
        start: 'top 85%',
        onEnter: (batch) => {
          (batch as HTMLElement[]).forEach((el, idx) => {
            const dot = el.querySelector('.timeline-dot');
            const side = el.getAttribute('data-side');
            const fromX = side === 'left' ? -40 : 40;
            gsap.from(el, {
              x: fromX,
              autoAlpha: 0,
              duration: 0.8,
              ease: 'power3.out',
              delay: idx * 0.05,
            });
            if (dot) {
              gsap.fromTo(dot, { scale: 0.7, background: 'linear-gradient(180deg, #1f2937, #111827)' }, {
                scale: 1,
                background: 'linear-gradient(135deg, #FB923C, #8B5CF6)',
                duration: 0.6,
                ease: 'back.out(1.7)',
                delay: 0.1 + idx * 0.05,
              });
            }
          });
        },
      });

      // Timeline progress line tracking
      const container = document.querySelector('.timeline-container') as HTMLElement | null;
      const progressEl = document.querySelector('.timeline-progress') as HTMLElement | null;
      if (container && progressEl) {
        const computeStopHeights = () => {
          const cRect = container.getBoundingClientRect();
          const items = gsap.utils.toArray('.timeline-item') as HTMLElement[];
          return items.map((item) => {
            const iRect = item.getBoundingClientRect();
            return iRect.top - cRect.top + iRect.height / 2;
          }).sort((a, b) => a - b);
        };
        let stopHeights = computeStopHeights();
        gsap.set(progressEl, { height: 0 });

        ScrollTrigger.create({
          trigger: container,
          start: 'top center',
          onEnter: () => gsap.set(progressEl, { height: 0 }),
          onLeaveBack: () => gsap.set(progressEl, { height: 0 }),
        });
        const alignDots = () => {
          const axisEl = progressEl;
          const axisRect = axisEl.getBoundingClientRect();
          const axisCenterX = axisRect.left + axisRect.width / 2;
          document.querySelectorAll('.timeline-item').forEach((el) => {
            const itemRect = (el as HTMLElement).getBoundingClientRect();
            const dot = (el as HTMLElement).querySelector('.timeline-dot') as HTMLElement | null;
            if (dot) {
              const leftPx = axisCenterX - itemRect.left;
              dot.style.left = `${leftPx}px`;
              dot.style.transform = 'translate(-50%, -50%)';
            }
          });
          stopHeights = computeStopHeights();
        };
        alignDots();
        const onResize = () => alignDots();
        window.addEventListener('resize', onResize);
        ScrollTrigger.addEventListener('refresh', alignDots);
        (container as HTMLElement & { __alignDotsCleanup?: () => void }).__alignDotsCleanup = () => {
          window.removeEventListener('resize', onResize);
          ScrollTrigger.removeEventListener('refresh', alignDots);
        };

        const dots = gsap.utils.toArray('.timeline-dot') as HTMLElement[];
        dots.forEach((dot) => {
          ScrollTrigger.create({
            trigger: dot,
            start: 'center 80%',
            once: true,
            onEnter: () => {
              gsap.fromTo(dot, { scale: 1.0, boxShadow: '0 0 0 0 rgba(251,146,60,0)' }, {
                scale: 1.15,
                boxShadow: '0 0 0 10px rgba(251,146,60,0.25)',
                duration: 0.5,
                ease: 'back.out(1.7)',
              });
              gsap.to(dot, {
                scale: 1,
                boxShadow: '0 0 0 0 rgba(251,146,60,0)',
                duration: 0.4,
                delay: 0.5,
                ease: 'power2.out',
              });
            },
          });
        });

        const items = gsap.utils.toArray('.timeline-item') as HTMLElement[];
        items.forEach((item, index) => {
          ScrollTrigger.create({
            trigger: item,
            start: 'top center',
            onEnter: () => {
              const h = stopHeights[index] ?? 0;
              gsap.to(progressEl, { height: h, duration: 0.45, ease: 'power2.out' });
            },
            onLeaveBack: () => {
              const prev = stopHeights[index - 1] ?? 0;
              gsap.to(progressEl, { height: prev, duration: 0.45, ease: 'power2.out' });
            },
          });
        });
      }

      // Physics 2D sparks around timeline dots
      const physicsLayer = document.querySelector('.timeline-physics-layer') as HTMLElement | null;
      const makeSparkBurst = (dot: HTMLElement) => {
        if (!physicsLayer) return;
        const lr = physicsLayer.getBoundingClientRect();
        const dr = dot.getBoundingClientRect();
        const originX = dr.left - lr.left + dr.width / 2;
        const originY = dr.top - lr.top;
        const count = 12;
        for (let i = 0; i < count; i++) {
          const spark = document.createElement('div');
          spark.style.position = 'absolute';
          spark.style.left = `${originX}px`;
          spark.style.top = `${originY}px`;
          const size = gsap.utils.random(3, 6);
          spark.style.width = `${size}px`;
          spark.style.height = `${size}px`;
          spark.style.borderRadius = '50%';
          const hue = gsap.utils.random(260, 40);
          spark.style.background = `hsl(${hue}, 80%, 60%)`;
          physicsLayer.appendChild(spark);
          gsap.to(spark, {
            physics2D: {
              velocity: gsap.utils.random(200, 400),
              angle: gsap.utils.random(230, 310),
              gravity: 900,
            },
            rotation: gsap.utils.random(-180, 180),
            duration: gsap.utils.random(0.8, 1.4),
            ease: 'none',
            opacity: 0,
            onComplete: () => spark.remove(),
          });
        }
      };
      if (physicsLayer) {
        const dotsForSparks = gsap.utils.toArray('.timeline-dot') as HTMLElement[];
        dotsForSparks.forEach((dot) => {
          ScrollTrigger.create({
            trigger: dot,
            start: 'center 80%',
            once: true,
            onEnter: () => makeSparkBurst(dot),
          });
        });
      }
    }, sectionRef);

    return () => {
      const container = document.querySelector('.timeline-container') as HTMLElement & { __alignDotsCleanup?: () => void };
      if (container && container.__alignDotsCleanup) container.__alignDotsCleanup();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="schedule"
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-900 to-black"
    >
      <Container>
        {/* Event Timeline (copied) */}
        <div className="max-w-4xl mx-auto">
          <Card variant="gradient" className="p-8">
            <div className="relative timeline-container">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[6px] bg-white/20 rounded-full" />
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[6px] rounded-full bg-linear-to-b from-primary-orange via-primary-purple to-primary-purple shadow-[0_0_16px_rgba(139,92,246,0.35)] timeline-progress" style={{ height: 0 }} />
              <div className="absolute inset-0 pointer-events-none timeline-physics-layer" />
              <div className="space-y-10 md:space-y-8">
                {eventTimeline.map((item, idx) => {
                  const isLeft = idx % 2 === 0;
                  return (
                    <div
                      key={item.title}
                      className="timeline-item relative group"
                      data-side={isLeft ? 'left' : 'right'}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
                        {isLeft ? (
                          <div className="pr-0 md:pr-10">
                            <div className="p-4 rounded-lg bg-black/20">
                              <div className="flex items-center justify-between">
                                <h4 className="text-white font-redhat font-bold text-base md:text-lg">{item.title}</h4>
                                <span className="text-primary-orange font-redhat text-sm md:text-base">{item.time}</span>
                              </div>
                              <p className="text-white/70 font-redhat mt-2 text-sm md:text-base">{item.detail}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="md:col-start-2 pl-0 md:pl-10">
                            <div className="p-4 rounded-lg bg-black/20 md:text-right">
                              <div className="flex items-center justify-between">
                                <span className="text-primary-orange font-redhat text-sm md:text-base">{item.time}</span>
                                <h4 className="text-white font-redhat font-bold text-base md:text-lg">{item.title}</h4>
                              </div>
                              <p className="text-white/70 font-redhat mt-2 text-sm md:text-base">{item.detail}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="timeline-dot absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white/10 ring-4 ring-white/10 group-hover:scale-110 transition-transform" />
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        
      </Container>
    </section>
  );
}
