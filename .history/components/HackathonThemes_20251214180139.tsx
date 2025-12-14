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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            {hackathonThemes.map((theme, index) => {
              return (
              <div
                key={theme.name}
                className="theme-card relative bg-white rounded-2xl min-h-[200px] shadow-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:scale-[1.02] hover:translate-y-[-4px]"
                style={{
                  paddingTop: '80px',
                  paddingBottom: '24px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                }}
              >
                {/* Orange Icon/Badge at Top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary-orange to-primary-orange/90 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {theme.image ? (
                      <img
                        src={theme.image}
                        alt={theme.name}
                        className="w-10 h-10 object-contain filter brightness-0 invert"
                      />
                    ) : (
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Decorative purple curve at bottom-right */}
                <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-gradient-to-tl from-primary-purple/15 to-transparent rounded-full pointer-events-none" />

                {/* Content - Centered vertically and horizontally */}
                <div className="relative z-10 text-center flex flex-col items-center justify-center min-h-[100px]">
                  <h4 
                    className="text-base font-medium text-black/70 leading-relaxed mb-4 px-2 font-red-hat-display"
                  >
                    {theme.name}
                  </h4>
                  
                  {/* Purple Button */}
                  <button className="bg-primary-purple text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-purple/90 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 font-red-hat-display">
                    Click Here
                  </button>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

