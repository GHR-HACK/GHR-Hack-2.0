'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { eventTimeline } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

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
            const side = el.getAttribute('data-side');
            const fromX = side === 'left' ? -40 : 40;
            gsap.from(el, {
              x: fromX,
              autoAlpha: 0,
              duration: 0.8,
              ease: 'power3.out',
              delay: idx * 0.05,
            });
            const dot = el.querySelector('.timeline-dot');
            if (dot) {
              gsap.fromTo(
                dot,
                { scale: 0.7, background: 'linear-gradient(180deg, #1f2937, #111827)' },
                {
                  scale: 1.5,
                  background: 'linear-gradient(135deg, #e9552b, #680b7d)',
                  duration: 0.6,
                  ease: 'back.out(1.7)',
                  delay: 0.1 + idx * 0.05,
                }
              );
            }
          });
        },
      });

      // Timeline progress line tracking
      const container = document.querySelector('.timeline-container') as HTMLElement | null;
      const progressEl = document.querySelector('.timeline-progress') as HTMLElement | null;
      if (container && progressEl) {
        ScrollTrigger.create({
          trigger: container,
          start: 'top center',
          end: 'bottom center',
          onUpdate: (self) => {
            const height = self.progress * container.clientHeight;
            gsap.to(progressEl, { height, duration: 0.2, ease: 'power2.out' });
          },
        });

        const alignDots = () => {
          const axisRect = progressEl.getBoundingClientRect();
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
        };

        alignDots();
        const onResize = () => alignDots();
        window.addEventListener('resize', onResize);
        ScrollTrigger.addEventListener('refresh', alignDots);
        (container as unknown as { __alignDotsCleanup?: () => void }).__alignDotsCleanup = () => {
          window.removeEventListener('resize', onResize);
          ScrollTrigger.removeEventListener('refresh', alignDots);
        };
      }
    }, sectionRef);

    return () => {
      const container = document.querySelector('.timeline-container') as HTMLElement | null;
      if (container && (container as unknown as { __alignDotsCleanup?: () => void }).__alignDotsCleanup) {
        (container as unknown as { __alignDotsCleanup: () => void }).__alignDotsCleanup();
      }
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
                                <h4 className="text-white font-red-hat-display font-bold text-base md:text-lg">
                                  {item.title}
                                </h4>
                                <span className="text-primary-orange font-red-hat-display text-sm md:text-base">
                                  {item.time}
                                </span>
                              </div>
                              <p className="text-white/70 font-red-hat-display mt-2 text-sm md:text-base">
                                {item.detail}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="md:col-start-2 pl-0 md:pl-10">
                            <div className="p-4 rounded-lg bg-black/20 md:text-right">
                              <div className="flex items-center justify-between">
                                <span className="text-primary-orange font-red-hat-display text-sm md:text-base">
                                  {item.time}
                                </span>
                                <h4 className="text-white font-red-hat-display font-bold text-base md:text-lg">
                                  {item.title}
                                </h4>
                              </div>
                              <p className="text-white/70 font-red-hat-display mt-2 text-sm md:text-base">
                                {item.detail}
                              </p>
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

