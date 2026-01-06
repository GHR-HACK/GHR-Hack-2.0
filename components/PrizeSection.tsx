'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, ChevronRight, ChevronLeft } from 'lucide-react';
import Title from './ui/Title';
import Container from './ui/Container';
import { prizes } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

const prizeDetails = [
  {
    id: 1,
    title: "First Prize",
    amount: "₹1,50,000",
    subtitle: "Grand Champion",
    color: "#ff6b35",
    position: "center"
  },
  {
    id: 2,
    title: "Second Prize",
    amount: "₹1,00,000",
    subtitle: "Runner Up",
    color: "#5C0F8B",
    position: "left"
  },
  {
    id: 3,
    title: "Third Prize",
    amount: "₹50,000",
    subtitle: "Second Runner Up",
    color: "#4C1D95",
    position: "right"
  }
];

export default function PrizeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const secondCardRef = useRef<HTMLDivElement>(null);
  const thirdCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          // Main card animation
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

      // Set initial positions for side cards (hidden behind main card)
      gsap.set([secondCardRef.current, thirdCardRef.current], {
        scale: 0.9,
        opacity: 0,
        zIndex: 0,
        rotateY: 90
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    // Flip main card to show first prize
    gsap.to(cardRef.current, {
      rotateY: 180,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        // Animate second card to left
        gsap.to(secondCardRef.current, {
          x: -220,
          rotateY: 0,
          scale: 1,
          opacity: 1,
          zIndex: 10,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.2
        });

        // Animate third card to right
        gsap.to(thirdCardRef.current, {
          x: 220,
          rotateY: 0,
          scale: 1,
          opacity: 1,
          zIndex: 10,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.3
        });
      }
    });

    // Change trophy badge color to gold for first prize
    gsap.to(".trophy-badge", {
      backgroundColor: "#FFD700",
      duration: 0.8,
      ease: "power2.inOut"
    });
  };

  const handleMouseLeave = () => {
    // Animate side cards back to hidden position
    gsap.to([secondCardRef.current, thirdCardRef.current], {
      x: 0,
      rotateY: 90,
      scale: 0.9,
      opacity: 0,
      zIndex: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        // Flip main card back to original
        gsap.to(cardRef.current, {
          rotateY: 0,
          duration: 0.8,
          ease: "power2.inOut"
        });
      }
    });

    // Reset trophy badge color
    gsap.to(".trophy-badge", {
      backgroundColor: "#ff6b35",
      duration: 0.8,
      ease: "power2.inOut"
    });
  };

  // Render a single prize card with the exact same UI
  const renderPrizeCard = (prize: typeof prizeDetails[0], isMain: boolean = false) => {
    const CardContent = () => (
      <>
        {/* Content - Same structure for all cards */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <p className="text-sm font-red-hat-display font-semibold text-gray-600 uppercase tracking-wide">
            {prize.title}
          </p>
          <div className="prize-amount text-4xl md:text-5xl lg:text-6xl font-red-hat-display font-bold gradient-text text-center">
            {prize.amount}
          </div>
          <p className="text-gray-500 text-lg mt-2">{prize.subtitle}</p>
          
          {/* Add directional arrows for side cards */}
          {!isMain && (
            <div className={`absolute top-1/2 ${prize.position === 'left' ? '-right-6' : '-left-6'}`}>
              <div className={`bg-white rounded-full p-2 shadow-lg ${prize.position === 'left' ? 'rotate-180' : ''}`}>
                {prize.position === 'left' ? (
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Decorative Curve - Same SVG but with dynamic color */}
        <div className="absolute bottom-0 right-0 w-full h-[200px] pointer-events-none">
          <svg
            width="100%"
            height="200"
            viewBox="0 0 480 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 right-0 opacity-90"
            preserveAspectRatio="none"
          >
            <path d="M285.5 200C325.5 186.667 371 182.167 411 155.5C448 127 463.5 95.5 480 20.5V200H285.5Z" fill={prize.color} />
          </svg>
        </div>
      </>
    );

    return (
      <div
        className={`relative bg-white rounded-[24px] shadow-2xl overflow-hidden pt-16 pb-10 px-10 h-full ${
          isMain ? 'cursor-pointer' : ''
        }`}
        style={{
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden'
        }}
      >
        <CardContent />
      </div>
    );
  };

  return (
    <section
      id="prize"
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
    >
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-16">
            <Title level={2} variant="gradient" size="xl" className="mb-4">
              Prize Pool
            </Title>
            <p className="text-gray-600 font-red-hat-display text-lg">
              Compete and win amazing prizes
            </p>
          </div>

          {/* Main container with relative positioning */}
          <div className="relative w-full max-w-[480px] mx-auto h-[400px]">
            {/* Trophy Badge - Fixed position */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="trophy-badge bg-[#ff6b35] rounded-[20px] p-5 shadow-lg transition-all duration-500">
                <Trophy className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Main Card Container with 3D perspective */}
            <div 
              className="relative w-full h-full"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Second Prize Card (Left) */}
              <div
                ref={secondCardRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px]"
                style={{ perspective: 1000 }}
              >
                {renderPrizeCard(prizeDetails[1])}
              </div>

              {/* Third Prize Card (Right) */}
              <div
                ref={thirdCardRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px]"
                style={{ perspective: 1000 }}
              >
                {renderPrizeCard(prizeDetails[2])}
              </div>

              {/* Main Card with flip animation */}
              <div
                ref={cardRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px]"
                style={{
                  perspective: 1000,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Front of Card (Total Prize) */}
                <div className="absolute w-full h-full backface-hidden">
                  <div className="relative bg-white rounded-[24px] shadow-2xl overflow-hidden pt-16 pb-10 px-10 h-full transition-all duration-500 group">
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
                      <p className="text-gray-500 text-lg mt-2">Hover to see breakdown</p>
                    </div>

                    <div className="absolute bottom-0 right-0 w-full h-[200px] pointer-events-none">
                      <svg
                        width="100%"
                        height="200"
                        viewBox="0 0 480 200"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute bottom-0 right-0 opacity-90 transition-opacity duration-300"
                        preserveAspectRatio="none"
                      >
                        <path d="M285.5 200C325.5 186.667 371 182.167 411 155.5C448 127 463.5 95.5 480 20.5V200H285.5Z" fill="#5C0F8B" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Back of Card (First Prize) */}
                <div className="absolute w-full h-full backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                  {renderPrizeCard(prizeDetails[0], true)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <style jsx global>{`
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
}
