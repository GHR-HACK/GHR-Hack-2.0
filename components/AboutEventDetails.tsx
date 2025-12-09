'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { eventHighlights, hackathonThemes, aboutEvent } from '../lib/data';

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

      // Highlight cards (batched, alternating left/right)
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

      // Theme cards (batched, alternating left/right)
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
      id="themes"
      ref={sectionRef}
      className="py-20 md:py-32 bg-gradient-to-b from-black via-gray-900 to-black"
    >
      <Container>
        {/* About Section */}
        <div className="text-center mb-20 max-w-5xl mx-auto px-4">
          <Title level={2} variant="gradient" size="xl" className="about-title mb-8">
            {aboutEvent.title}
          </Title>
          <div className="max-w-4xl mx-auto">
            <p className="about-description text-lg md:text-xl text-white/80 font-rajdhani leading-relaxed">
              {aboutEvent.description}
            </p>
          </div>
        </div>

        {/* Event Highlights */}
        <div className="mb-20 max-w-6xl mx-auto px-4">
          <Title level={3} variant="default" size="lg" className="text-center mb-12">
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

        {/* Hackathon Themes */}
        <div className="themes-section mt-20">
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
                <div className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-primary-purple/20 to-primary-orange/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h4 className="text-lg font-orbitron font-bold text-white group-hover:gradient-text transition-all duration-300">
                    {theme.name}
                  </h4>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Event Timeline & Prizes */}
        <div id="schedule" className="mt-20 mb-12">
          <Title level={3} variant="gradient" size="lg" className="text-center mb-12">
            Event Timeline
          </Title>
          <div className="max-w-4xl mx-auto">
            <Card variant="gradient" className="p-8">
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
        </div>

        {/* Exciting Prizes */}
        <div id="prize" className="mt-20">
          <Title level={3} variant="gradient" size="lg" className="text-center mb-12">
            Exciting Prizes Await!
          </Title>
          <div className="max-w-4xl mx-auto">
            <Card variant="gradient" className="p-8">
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
        </div>
      </Container>
    </section>
  );
}