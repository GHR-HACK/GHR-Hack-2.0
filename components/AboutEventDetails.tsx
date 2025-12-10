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
      // Title
      gsap.from('.about-title', {
        scrollTrigger: {
          trigger: '.about-title',
          start: 'top 90%',
          toggleActions: 'play none none none',
          once: true,
        },
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
      });

      // Description
      gsap.from('.about-description', {
        scrollTrigger: {
          trigger: '.about-description',
          start: 'top 90%',
          toggleActions: 'play none none none',
          once: true,
        },
        y: 30,
        autoAlpha: 0,
        duration: 0.9,
        delay: 0.1,
        ease: 'power3.out',
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
        <div className="text-center mb-8 md:mb-12 max-w-5xl mx-auto px-4">
          <Title level={2} variant="gradient" size="xl" className="about-title mb-6 md:mb-8">
            {aboutEvent.title}
          </Title>
          <div className="max-w-4xl mx-auto">
            <p className="about-description text-lg md:text-xl text-white/80 font-red-hat-display leading-relaxed">
              {aboutEvent.description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}