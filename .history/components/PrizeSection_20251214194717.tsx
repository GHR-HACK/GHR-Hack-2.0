'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { prizes } from '../lib/data';

gsap.registerPlugin(ScrollTrigger, Physics2DPlugin);

export default function PrizeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Simplified prize card animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to('.prize-card', {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power1.out',
            stagger: 0.08
          });
        }
      });

      // Prize amount counter + falling coins/notes
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
              const coinCount = 20;
              const noteCount = 50;

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="prize"
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
    >
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <Title level={2} variant="gradient" size="lg" className="text-center mb-12">
            {prizes.description}
          </Title>
          <Card variant="gradient" className="p-8 prize-card relative overflow-hidden">
            <div className="text-center">
              <div className="mb-6">
                <div className="prize-amount text-6xl font-red-hat-display font-bold gradient-text mb-2">
                  {prizes.cash}
                </div>
                <p className="text-white/70 font-red-hat-display">Cash Prizes Worth</p>
              </div>
              <div className="relative mt-2">
                <div className="prize-pool relative mx-auto w-64 h-40 rounded-[24px] border border-black/20 bg-white overflow-hidden">
                  <div className="absolute inset-0 prize-pool-layer pointer-events-none z-[2]" />
                  <div className="prize-pool-fill absolute bottom-0 left-0 w-full h-0 bg-gradient-to-t from-primary-orange/50 to-primary-purple/40 to-transparent z-[1]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent mix-blend-overlay z-[0] pointer-events-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 prize-perks-grid">
                {[
                  { key: 'meal', text: "Free Meals" },
                  { key: 'certificate', text: "Certificates" },
                  { key: 'networking', text: "Networking Opportunities" },
                ].map(({ key, text }) => (
                  <Card key={key} variant="glass" hover className="perk-card p-4 bg-white border border-black/15 rounded-lg">
                    <div className="flex items-center">
                      <span className="mr-3 inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary-orange/20 to-primary-purple/20 rounded-md border border-white/15">
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
                      <span className="text-white/90 font-red-hat-display">{text}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

