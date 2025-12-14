'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThemeCard from './ui/ThemeCard';
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
      <Container>
        <div className="themes-section px-4 sm:px-6 md:px-8">
          <Title level={3} variant="gradient" size="lg" className="text-center mb-12">
            Hackathon Themes
          </Title>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 max-w-7xl mx-auto">
            {hackathonThemes.map((theme, index) => {
              return (
                <ThemeCard
                  key={theme.name}
                  className="theme-card"
                  accentColor={accentColorSequence[index % accentColorSequence.length] as 'orange' | 'purple' | 'blue' | 'green'}
                  curveColor="purple"
                  icon={
                    theme.image ? (
                      <img
                        src={theme.image}
                        alt={theme.name}
                        className="h-8 w-8 object-contain filter brightness-0 invert"
                      />
                    ) : (
                      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    )
                  }
                >
                  {/* Content - Hidden for now as per request */}
                </ThemeCard>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

