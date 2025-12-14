'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeCard } from './ui/ThemeCard';
import Title from './ui/Title';
import Container from './ui/Container';
import { hackathonThemes } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function HackathonThemesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Simple fade-in animation for theme cards
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.fromTo('.theme-card',
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.05
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const accentColorSequence = ['orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange'];

  return (
    <section
      id="themes-list"
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
    >
     
        <div className="themes-section px-4 sm:px-6 md:px-8">
          <Title level={3} variant="gradient" size="lg" className="text-center mb-12">
            Hackathon Themes
          </Title>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 max-w-7xl mx-auto">
            {hackathonThemes.map((theme, index) => {
              const isLeft = index % 2 === 0;
              return (
                <ThemeCard
                  key={theme.name}
                  title={theme.name}
                  onClickHere={() => console.log(`Clicked on ${theme.name}`)}
                />
              );
            })}
          </div>
        </div>     
    </section>
  );
}

