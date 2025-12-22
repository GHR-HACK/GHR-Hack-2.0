'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
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
            {/* Left Side - Lottie Animation */}
            <div className="about-item order-2 lg:order-1" data-side="left">
              <div className="relative w-full h-80 lg:h-96 flex items-center justify-center">
                <DotLottieReact
                  src="/AboutEvent.lottie"
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="about-item order-1 lg:order-2 text-left" data-side="right">
              <Title level={2} variant="gradient" size="lg" className="mb-6">
                {aboutEvent.title}
              </Title>
              <div className="prose prose-lg max-w-none">
                <p
                  className="text-black text-lg leading-relaxed text-justify font-red-hat-display group-hover:text-black/90 transition-colors duration-300"
                  dangerouslySetInnerHTML={{ __html: aboutEvent.description }}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}