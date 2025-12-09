'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';

gsap.registerPlugin(ScrollTrigger);

export default function EventTimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.timeline-card', {
        scrollTrigger: {
          trigger: '.timeline-card',
          start: 'top 90%',
          toggleActions: 'play none none none',
          once: true,
        },
        y: 30,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="schedule"
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-900 to-black"
    >
      <Container>
        <div className="max-w-4xl mx-auto px-4">
          <Title level={3} variant="gradient" size="lg" className="text-center mb-12">
            Event Timeline
          </Title>
          <Card variant="gradient" className="p-8 timeline-card">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                <span className="text-white font-rajdhani text-lg">Registration</span>
                <span className="text-primary-orange font-orbitron font-bold">Open Now</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                <span className="text-white font-rajdhani text-lg">Event Date</span>
                <span className="text-primary-purple font-orbitron font-bold">March 8-9, 2025</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                <span className="text-white font-rajdhani text-lg">Duration</span>
                <span className="text-primary-orange font-orbitron font-bold">28 Hours</span>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

