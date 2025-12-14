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
      // Ultra-light animation - just fade in once
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to('.highlight-card', {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power1.out',
            stagger: 0.05
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="highlights"
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
    >
      <Container>
        <div className="mb-12 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
         <Title level={3} variant="gradient" size="lg" className="text-center mb-12">
            Event Highlights
          </Title>
          <div className="highlights-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 max-w-6xl mx-auto">
            {Object.entries(eventHighlights).map(([key, value], index) => {
              return (
              <Card
                key={key}
                variant="elevated"
                hover
                className="highlight-card min-h-[280px] flex flex-col justify-between"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-purple to-primary-orange rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <span className="text-2xl font-red-hat-display font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <h4 className="text-xl font-red-hat-display font-bold text-black mb-3 capitalize group-hover:text-primary-purple transition-colors duration-300">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-black/60 font-red-hat-display text-sm leading-relaxed group-hover:text-black/80 transition-colors duration-300">
                    {value}
                  </p>
                </div>
              </Card>
            );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

