'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { eventTimeline, prizes } from '../lib/data';

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
              gsap.fromTo(dot, { scale: 0.9, boxShadow: '0 0 0 0 rgba(251,146,60,0)' }, {
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
      }

      // Prize amount counter + physics pool spawn
      const amountEl = document.querySelector('.prize-amount') as HTMLElement | null;
      if (amountEl) {
        const obj = { val: 1 };
        const target = 80000;
        ScrollTrigger.create({
          trigger: amountEl,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: target,
              duration: 1.4,
              ease: 'power3.out',
              onUpdate: () => {
                amountEl.textContent = `₹${Math.floor(obj.val).toLocaleString()}+`;
              },
            });

            const poolLayer = document.querySelector('.prize-pool-layer') as HTMLElement | null;
            const pool = document.querySelector('.prize-pool') as HTMLElement | null;
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
              const coinCount = 100;
              const noteCount = 100;

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
                poolLayer.appendChild(coin);
                gsap.to(coin, {
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
              }

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
                gsap.to(note, {
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
              }
            }
          },
        });
      }

      // Continuous spawn while pool is in view
      const poolLayer2 = document.querySelector('.prize-pool-layer') as HTMLElement | null;
      const pool2 = document.querySelector('.prize-pool') as HTMLElement | null;
      let spawnTimer: number | null = null;
      const spawnOne = () => {
        if (!(poolLayer2 && pool2)) return;
        const lr = poolLayer2.getBoundingClientRect();
        const pr = pool2.getBoundingClientRect();
        const floorY = pr.bottom - lr.top - 12;
        const leftBound = pr.left - lr.left + 10;
        const rightBound = pr.right - lr.left - 10;
        const green = '#22c55e';
        const darkGreen = '#16a34a';
        const gold = '#f59e0b';
        const lightGold = '#fbbf24';
        const makeCoin = Math.random() < 0.6;
        if (makeCoin) {
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
          poolLayer2.appendChild(coin);
          gsap.to(coin, {
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
        } else {
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
          const band = document.createElement('div');
          band.style.position = 'absolute';
          band.style.left = '20%';
          band.style.top = '35%';
          band.style.width = '60%';
          band.style.height = '30%';
          band.style.background = 'rgba(255,255,255,0.25)';
          band.style.borderRadius = '2px';
          note.appendChild(band);
          poolLayer2.appendChild(note);
          gsap.to(note, {
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
        }
      };
      const startSpawner = () => {
        if (spawnTimer) return;
        spawnTimer = window.setInterval(() => {
          const burst = gsap.utils.random(1, 3);
          for (let i = 0; i < burst; i++) spawnOne();
        }, gsap.utils.random(400, 800));
      };
      const stopSpawner = () => {
        if (spawnTimer) {
          clearInterval(spawnTimer);
          spawnTimer = null;
        }
      };
      if (pool2) {
        ScrollTrigger.create({
          trigger: pool2,
          start: 'top 85%',
          end: 'bottom 10%',
          onEnter: startSpawner,
          onEnterBack: startSpawner,
          onLeave: stopSpawner,
          onLeaveBack: stopSpawner,
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
                                <h4 className="text-white font-orbitron font-bold text-base md:text-lg">{item.title}</h4>
                                <span className="text-primary-orange font-rajdhani text-sm md:text-base">{item.time}</span>
                              </div>
                              <p className="text-white/70 font-rajdhani mt-2 text-sm md:text-base">{item.detail}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="md:col-start-2 pl-0 md:pl-10">
                            <div className="p-4 rounded-lg bg-black/20 md:text-right">
                              <div className="flex items-center justify-between">
                                <span className="text-primary-orange font-rajdhani text-sm md:text-base">{item.time}</span>
                                <h4 className="text-white font-orbitron font-bold text-base md:text-lg">{item.title}</h4>
                              </div>
                              <p className="text-white/70 font-rajdhani mt-2 text-sm md:text-base">{item.detail}</p>
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

        {/* Exciting Prizes (copied) */}
        <div id="prize" className="mt-20">
          <Title level={3} variant="gradient" size="lg" className="text-center mb-12">
            {prizes.description}
          </Title>
          <div className="max-w-4xl mx-auto">
            <Card variant="gradient" className="p-8 relative overflow-hidden">
              <div className="text-center">
                <div className="mb-6">
                  <div className="prize-amount text-6xl font-orbitron font-bold gradient-text mb-2">
                    {prizes.cash}
                  </div>
                  <p className="text-white/70 font-rajdhani">Cash Prizes Worth</p>
                </div>
                <div className="relative mt-2">
                  <div className="prize-pool relative mx-auto w-64 h-40 rounded-[24px] border border-white/20 bg-black/20 overflow-hidden">
                    <div className="absolute inset-0 prize-pool-layer pointer-events-none z-[2]" />
                    <div className="prize-pool-fill absolute bottom-0 left-0 w-full h-0 bg-linear-to-t from-primary-purple/50 via-primary-orange/40 to-transparent z-[1]" />
                    <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent mix-blend-overlay z-[0] pointer-events-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 prize-perks-grid">
                  {[
                    { key: 'meal', text: "Free Meals" },
                    { key: 'certificate', text: "Certificates" },
                    { key: 'networking', text: "Networking Opportunities" },
                  ].map(({ key, text }) => (
                    <Card key={key} variant="glass" hover className="perk-card p-4 bg-black/20 border border-white/10 rounded-lg">
                      <div className="flex items-center">
                        <span className="mr-3 inline-flex items-center justify-center w-8 h-8 bg-linear-to-r from-primary-purple/20 to-primary-orange/20 rounded-md border border-white/15">
                          {key === 'meal' && (
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3v8"/><path d="M8 3v8"/><path d="M6 3v8"/><path d="M20 3s-3 1-3 4 3 4 3 4V3Z"/><path d="M4 11v10"/><path d="M8 11v10"/></svg>
                          )}
                          {key === 'certificate' && (
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/></svg>
                          )}
                          {key === 'networking' && (
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="8" r="3"/><circle cx="18" cy="8" r="3"/><circle cx="12" cy="18" r="3"/><path d="M8.5 10.5 11 14"/><path d="M15.5 10.5 13 14"/></svg>
                          )}
                        </span>
                        <span className="text-white/90 font-rajdhani">{text}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}