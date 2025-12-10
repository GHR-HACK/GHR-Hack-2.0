'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { hackathonThemes } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function HackathonThemesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.theme-card', {
        interval: 0.1,
        batchMax: 6,
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          (batch as HTMLElement[]).forEach((el, idx) => {
            const fromX = idx % 2 === 0 ? -50 : 50;
            gsap.from(el, {
              x: fromX,
              y: 10,
              scale: 0.9,
              autoAlpha: 0,
              duration: 0.9,
              ease: 'power3.out',
              delay: idx * 0.05,
            });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="themes-list"
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-gray-900 via-black to-gray-900"
    >
      <Container>
        <div className="themes-section">
          <Title level={3} variant="gradient" size="lg" className="text-center mb-12">
            Hackathon Themes
          </Title>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {hackathonThemes.map((theme, index) => (
              <Card
                key={theme.name}
                variant="elevated"
                hover
                className="theme-card group"
              >
                <div className="text-center p-6 flex flex-col items-center gap-4">
                  {theme.image ? (
                    <img
                      src={theme.image}
                      alt={theme.name}
                      className="w-16 h-16 object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary-purple/20 to-primary-orange/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🚀</span>
                    </div>
                  )}
                  <h4 className="text-lg font-red-hat-display font-bold text-white group-hover:gradient-text transition-all duration-300">
                    {theme.name}
                  </h4>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

