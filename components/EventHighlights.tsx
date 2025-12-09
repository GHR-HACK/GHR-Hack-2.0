'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { eventHighlights } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function EventHighlightsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.highlight-card', {
        interval: 0.1,
        batchMax: 6,
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          (batch as HTMLElement[]).forEach((el, idx) => {
            const fromX = idx % 2 === 0 ? -60 : 60;
            gsap.from(el, {
              x: fromX,
              y: 20,
              autoAlpha: 0,
              duration: 0.9,
              ease: 'power3.out',
              delay: idx * 0.04,
            });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="highlights"
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-900 to-black"
    >
      <Container>
        <div className="mb-12 max-w-6xl mx-auto px-4">
          <Title level={3} variant="default" size="lg" className="text-center mb-8">
            Event Highlights
          </Title>
          <div className="highlights-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(eventHighlights).map(([key, value], index) => (
              <Card key={key} variant="glass" hover className="highlight-card">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-purple to-primary-orange rounded-full flex items-center justify-center">
                    <span className="text-2xl font-orbitron font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <h4 className="text-xl font-orbitron font-bold text-white mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-white/70 font-rajdhani">
                    {value}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

