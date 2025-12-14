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
      // Animate sections coming from left and right sides
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          const leftItem = document.querySelector('.about-item[data-side="left"]');
          const rightItem = document.querySelector('.about-item[data-side="right"]');

          // Animate left item from left
          if (leftItem) {
            gsap.fromTo(leftItem,
              { x: -50, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
            );
          }

          // Animate right item from right
          if (rightItem) {
            gsap.fromTo(rightItem,
              { x: 50, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.2 }
            );
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
    >
      <Container>
        {/* About Section - 2 Column Layout */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 xl:gap-32 items-center">
            {/* Left Side - Lottie Animation/Image */}
            <div className="about-item order-2 lg:order-1" data-side="left">
              <div className="relative w-full h-80 lg:h-96 bg-black/5 rounded-lg flex items-center justify-center border-2 border-dashed border-black/20">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-black/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-black/50 text-sm font-medium">Lottie Animation</p>
                  <p className="text-xs text-black/30">Coming Soon</p>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="about-item order-1 lg:order-2 text-left" data-side="right">
              <Title level={2} variant="gradient" size="lg" className="mb-6">
                {aboutEvent.title}
              </Title>
              <div className="prose prose-lg max-w-none">
                <p className="text-black text-lg leading-relaxed text-justify font-red-hat-display group-hover:text-black/90 transition-colors duration-300">
                  {aboutEvent.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}