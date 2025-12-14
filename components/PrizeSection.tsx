'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy } from 'lucide-react';
import Title from './ui/Title';
import Container from './ui/Container';
import { prizes } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function PrizeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate prize card
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          // Card animation
          gsap.fromTo(cardRef.current,
            { y: 30, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.8, 
              ease: 'power2.out'
            }
          );

          // Counter animation
          const amountText = prizes.cash;
          const match = amountText.match(/₹?([\d,]+)/);
          if (match && amountRef.current) {
            const targetValue = parseInt(match[1].replace(/,/g, ''));
            const obj = { value: 0 };
            
            gsap.to(obj, {
              value: targetValue,
              duration: 2,
              ease: 'power2.out',
              delay: 0.3,
              onUpdate: () => {
                if (amountRef.current) {
                  const formatted = `₹${Math.floor(obj.value).toLocaleString('en-IN')}+`;
                  amountRef.current.textContent = formatted;
                }
              }
            });
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="prize"
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
    >
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <Title level={2} variant="gradient" size="xl" className="mb-4">
              Prize Pool
            </Title>
            <p className="text-gray-600 font-red-hat-display text-lg">
              Compete and win amazing prizes
            </p>
          </div>

          {/* Prize Card - Using ThemeCard Design */}
          <div className="relative w-full max-w-[480px] mx-auto">
            {/* Trophy Badge */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-[#ff6b35] rounded-[20px] p-5 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
                <Trophy className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Main Card */}
            <div
              ref={cardRef}
              className="relative bg-white rounded-[24px] shadow-2xl hover:shadow-2xl hover:shadow-black/40 overflow-hidden pt-16 pb-10 px-10 transition-all duration-500 ease-in-out group"
            >
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <p className="text-sm font-red-hat-display font-semibold text-gray-600 uppercase tracking-wide">
                  Total Prize Pool
                </p>
                <div 
                  ref={amountRef}
                  className="prize-amount text-4xl md:text-5xl lg:text-6xl font-red-hat-display font-bold gradient-text text-center"
                >
                  {prizes.cash}
                </div>
              </div>

              {/* Decorative Curve */}
              <div className="absolute bottom-0 right-0 w-full h-[200px] pointer-events-none">
                <svg
                  width="100%"
                  height="200"
                  viewBox="0 0 480 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute bottom-0 right-0 group-hover:opacity-90 transition-opacity duration-300"
                  preserveAspectRatio="none"
                >
                  <path d="M285.5 200C325.5 186.667 371 182.167 411 155.5C448 127 463.5 95.5 480 20.5V200H285.5Z" fill="#5C0F8B" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

