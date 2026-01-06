'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy } from 'lucide-react';
import Title from './ui/Title';
import Container from './ui/Container';
import { prizes } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

// Define prize items (you might want to move this to your data file)
const prizeDetails = [
  {
    id: 1,
    title: "First Prize",
    amount: "₹1,50,000",
    description: "Grand Champion",
    color: "from-[#FFD700] to-[#FFA500]",
    bgColor: "#FFD700"
  },
  {
    id: 2,
    title: "Second Prize",
    amount: "₹1,00,000",
    description: "Runner Up",
    color: "from-[#C0C0C0] to-[#808080]",
    bgColor: "#C0C0C0"
  },
  {
    id: 3,
    title: "Third Prize",
    amount: "₹50,000",
    description: "Second Runner Up",
    color: "from-[#CD7F32] to-[#8B4513]",
    bgColor: "#CD7F32"
  }
];

export default function PrizeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Original scroll animation
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

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    // Flip the main card to show first prize
    gsap.to(cardRef.current, {
      rotateY: 180,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        // After flip, animate second and third cards
        const secondCard = document.querySelector('.second-prize-card');
        const thirdCard = document.querySelector('.third-prize-card');
        
        if (secondCard) {
          gsap.fromTo(secondCard,
            {
              x: 100,
              y: -50,
              rotateY: -90,
              opacity: 0,
              scale: 0.8
            },
            {
              x: -180,
              y: 0,
              rotateY: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
              delay: 0.2
            }
          );
        }
        
        if (thirdCard) {
          gsap.fromTo(thirdCard,
            {
              x: -100,
              y: -50,
              rotateY: 90,
              opacity: 0,
              scale: 0.8
            },
            {
              x: 180,
              y: 0,
              rotateY: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
              delay: 0.3
            }
          );
        }
      }
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    // First, hide the second and third cards
    const secondCard = document.querySelector('.second-prize-card');
    const thirdCard = document.querySelector('.third-prize-card');
    
    if (secondCard) {
      gsap.to(secondCard, {
        x: 100,
        y: -50,
        rotateY: -90,
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.in"
      });
    }
    
    if (thirdCard) {
      gsap.to(thirdCard, {
        x: -100,
        y: -50,
        rotateY: 90,
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          // Then flip the main card back
          gsap.to(cardRef.current, {
            rotateY: 0,
            duration: 0.8,
            ease: "power2.inOut"
          });
        }
      });
    } else {
      // If cards aren't found, just flip back
      gsap.to(cardRef.current, {
        rotateY: 0,
        duration: 0.8,
        ease: "power2.inOut"
      });
    }
  };

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

          {/* Main Container with relative positioning for floating cards */}
          <div className="relative w-full max-w-[480px] mx-auto h-[400px]">
            {/* Second Prize Card (will appear on left) */}
            <div className="second-prize-card absolute left-0 top-1/2 -translate-y-1/2 z-20 opacity-0 pointer-events-none">
              <div className="bg-gradient-to-br from-[#C0C0C0] to-[#808080] rounded-[20px] p-6 shadow-2xl w-[200px] h-[240px] transform rotate-[-5deg]">
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <Trophy className="h-12 w-12 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-center">Second Prize</h3>
                  <div className="text-3xl font-bold mb-2">₹1,00,000</div>
                  <p className="text-sm text-center">Runner Up</p>
                </div>
              </div>
            </div>

            {/* Third Prize Card (will appear on right) */}
            <div className="third-prize-card absolute right-0 top-1/2 -translate-y-1/2 z-20 opacity-0 pointer-events-none">
              <div className="bg-gradient-to-br from-[#CD7F32] to-[#8B4513] rounded-[20px] p-6 shadow-2xl w-[200px] h-[240px] transform rotate-[5deg]">
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <Trophy className="h-12 w-12 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-center">Third Prize</h3>
                  <div className="text-3xl font-bold mb-2">₹50,000</div>
                  <p className="text-sm text-center">Second Runner Up</p>
                </div>
              </div>
            </div>

            {/* Main Card Container with 3D perspective */}
            <div className="relative w-full h-full perspective-1000">
              {/* Trophy Badge */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="bg-[#ff6b35] rounded-[20px] p-5 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Main Card with flip animation */}
              <div
                ref={cardRef}
                className="relative w-full h-full preserve-3d transition-transform duration-800 ease-in-out"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Front of Card (Original Content) */}
                <div className="absolute w-full h-full backface-hidden">
                  <div className="relative bg-white rounded-[24px] shadow-2xl hover:shadow-2xl hover:shadow-black/40 overflow-hidden pt-16 pb-10 px-10 h-full transition-all duration-500 ease-in-out group cursor-pointer">
                    <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3">
                      <p className="text-sm font-red-hat-display font-semibold text-gray-600 uppercase tracking-wide">
                        Total Prize Pool
                      </p>
                      <div 
                        ref={amountRef}
                        className="prize-amount text-4xl md:text-5xl lg:text-6xl font-red-hat-display font-bold gradient-text text-center"
                      >
                        {prizes.cash}
                      </div>
                      <p className="text-gray-500 mt-4 text-center">Hover to see individual prizes</p>
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

                {/* Back of Card (First Prize) */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-[24px] shadow-2xl overflow-hidden pt-16 pb-10 px-10">
                  <div className="flex flex-col items-center justify-center h-full text-white">
                    <div className="relative z-10">
                      <Trophy className="h-16 w-16 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold mb-4 text-center">First Prize</h3>
                      <div className="text-5xl font-bold mb-4 text-center">₹1,50,000</div>
                      <p className="text-lg text-center">Grand Champion</p>
                    </div>
                    
                    {/* Decorative elements for back */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-24 translate-y-24"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
}
