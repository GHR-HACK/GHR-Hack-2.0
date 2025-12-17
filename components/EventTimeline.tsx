'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Title from './ui/Title';
import Container from './ui/Container';
import { eventTimeline } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function EventTimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Optimized timeline animations
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%', // Increased from 80%
        once: true,
        onEnter: () => {
          gsap.fromTo('.timeline-item',
            { opacity: 0, scale: 0.9 }, // Reduced scale change
            {
              opacity: 1,
              scale: 1,
              duration: 0.4, // Reduced from 0.6
              ease: 'power1.out', // Changed from power2.out for better performance
              stagger: 0.1 // Reduced from 0.15
            }
          );

          // Optimized path drawing animation
          if (pathRef.current) {
            const pathLength = pathRef.current.getTotalLength();
            pathRef.current.style.strokeDasharray = `${pathLength}`;
            pathRef.current.style.strokeDashoffset = `${pathLength}`;

            gsap.to(pathRef.current, {
              strokeDashoffset: 0,
              duration: 1.5, // Reduced from 2
              ease: 'power1.inOut', // Changed from power2.inOut
              delay: 0.2 // Reduced from 0.3
            });
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Calculate positions along the snake path
  const getItemPosition = (index: number, total: number) => {
    const progress = index / (total - 1);
    
    // Snake pattern: curves between bottom (320) and top (280) as it goes left to right
    // Path: starts at 320 (bottom), curves to 280 (top), curves to 320 (bottom), curves to 280 (top)
    let y;
    
    // Calculate position along the curved path
    // The path has 3 main curves: 0-33%, 33-66%, 66-100%
    if (progress < 0.33) {
      // First curve: 320 (bottom) -> 280 (top)
      const localProgress = progress / 0.33;
      y = 320 - (localProgress * 40); // 320 to 280
    } else if (progress < 0.66) {
      // Second curve: 280 (top) -> 320 (bottom)
      const localProgress = (progress - 0.33) / 0.33;
      y = 280 + (localProgress * 40); // 280 to 320
    } else {
      // Third curve: 320 (bottom) -> 300 (slightly up at end)
      const localProgress = (progress - 0.66) / 0.34;
      y = 320 - (localProgress * 20); // 320 to 300
    }
    
    // Convert SVG coordinates (0-1000) to percentage (0-100)
    const x = progress * 100;
    const yPercent = (y / 400) * 100;
    
    // Determine if item is on top or bottom curve
    const isTop = y < 300;
    
    return { x, y: yPercent, isTop };
  };

  return (
    <section
      id="schedule"
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
    >
      <Container>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <Title level={2} variant="gradient" size="xl" className="text-center mb-16">
            Event Timeline
          </Title>
          
          {/* Snake Path Timeline */}
          <div className="relative w-full min-h-[500px] md:min-h-[450px]">
            {/* SVG Path - Snake-like horizontal zigzag */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
            >
              {/* Background path (lighter) */}
              <path
                d="M 50 320 Q 250 280, 450 320 Q 650 280, 850 320 Q 950 300, 950 320"
                fill="none"
                stroke="rgba(92, 15, 139, 0.1)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              
              {/* Animated path (glowing) - Snake pattern: left-bottom -> right-top -> left-bottom -> right-top */}
              <path
                ref={pathRef}
                d="M 50 320 Q 250 280, 450 320 Q 650 280, 850 320 Q 950 300, 950 320"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="10"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 12px rgba(92, 15, 139, 0.6))' }}
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff5100" />
                  <stop offset="50%" stopColor="#9d4edd" />
                  <stop offset="100%" stopColor="#5c0f8b" />
                </linearGradient>
              </defs>
            </svg>

            {/* Timeline Items positioned along the path */}
            <div className="relative w-full h-full">
              {eventTimeline.map((item, idx) => {
                const { x, y, isTop } = getItemPosition(idx, eventTimeline.length);
                
                return (
                  <div
                    key={item.title}
                    className="timeline-item absolute"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Dot on path */}
                    <div className="relative">
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-primary-orange to-primary-purple ring-4 ring-white shadow-lg z-10" />
                      
                      {/* Content Card */}
                      <div
                        className={`w-64 md:w-72 ${
                          isTop ? '-mt-32 md:-mt-36' : 'mt-10'
                        }`}
                      >
                        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-primary-purple font-red-hat-display font-bold text-sm md:text-base">
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-primary-orange font-red-hat-display text-xs md:text-sm font-semibold mb-2">
                            {item.time}
                          </p>
                          <p className="text-gray-600 font-red-hat-display text-xs md:text-sm leading-relaxed">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

