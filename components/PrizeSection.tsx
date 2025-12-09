'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';

gsap.registerPlugin(ScrollTrigger);

export default function PrizeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.prize-card', {
        scrollTrigger: {
          trigger: '.prize-card',
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
      id="prize"
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-gray-900 via-black to-gray-900"
    >
      <Container>
        <div className="max-w-4xl mx-auto px-4">
          <Title level={3} variant="gradient" size="lg" className="text-center mb-12">
            Exciting Prizes Await!
          </Title>
          <Card variant="gradient" className="p-8 prize-card">
            <div className="text-center">
              <div className="mb-6">
                <div className="text-6xl font-orbitron font-bold gradient-text mb-2">
                  ₹80,000+
                </div>
                <p className="text-white/70 font-rajdhani">Cash Prizes Worth</p>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-center text-white/80 font-rajdhani">
                  <span className="w-2 h-2 bg-primary-purple rounded-full mr-3"></span>
                  Goodies & Swag
                </div>
                <div className="flex items-center text-white/80 font-rajdhani">
                  <span className="w-2 h-2 bg-primary-orange rounded-full mr-3"></span>
                  Free Meals
                </div>
                <div className="flex items-center text-white/80 font-rajdhani">
                  <span className="w-2 h-2 bg-primary-purple rounded-full mr-3"></span>
                  Certificates
                </div>
                <div className="flex items-center text-white/80 font-rajdhani">
                  <span className="w-2 h-2 bg-primary-orange rounded-full mr-3"></span>
                  Networking Opportunities
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

