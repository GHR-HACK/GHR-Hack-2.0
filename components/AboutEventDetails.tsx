'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { aboutEvent } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function AboutEventDetails() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Batch animation for about items - alternating left/right
      ScrollTrigger.batch('.about-item', {
        interval: 0.1,
        batchMax: 2,
        start: 'top 85%',
        once: true,
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
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="themes"
      ref={sectionRef}
      className="py-20 md:py-32 bg-gradient-to-b from-black via-gray-900 to-black"
    >
      <Container>
        {/* About Section */}
        <div className="text-center mb-8 md:mb-12 max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          <Title level={2} variant="gradient" size="xl" className="about-item mb-6 md:mb-8" data-side="left">
            {aboutEvent.title}
          </Title>
          <div className="max-w-4xl mx-auto">
            <p className="about-item text-lg md:text-xl text-white/80 font-red-hat-display leading-relaxed" data-side="right">
              {aboutEvent.description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}