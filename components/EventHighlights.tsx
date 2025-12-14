'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Title from './ui/Title';
import Container from './ui/Container';

gsap.registerPlugin(ScrollTrigger);

export default function EventHighlightsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate sections coming from left and right sides (reversed from About Event)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          const leftItem = document.querySelector('.highlight-item[data-side="left"]');
          const rightItem = document.querySelector('.highlight-item[data-side="right"]');

          // Animate left item (text) from left
          if (leftItem) {
            gsap.fromTo(leftItem,
              { x: -50, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
            );
          }

          // Animate right item (lottie) from right
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
      id="highlights"
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
    >
      <Container>
        {/* Event Highlights Section - 2 Column Layout (Reversed) */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 xl:gap-32 items-center">
            {/* Left Side - Content */}
            <div className="highlight-item order-1 lg:order-1 text-left" data-side="left">
              <Title level={2} variant="gradient" size="lg" className="mb-6">
                Event Highlights
              </Title>
              <div className="prose prose-lg max-w-none space-y-4">
                <div>
                  <p className="text-black text-lg leading-relaxed text-justify font-red-hat-display">
                    <strong className="text-primary-purple">Duration:</strong> 28 hours of non-stop innovation.
                  </p>
                </div>
                <div>
                  <p className="text-black text-lg leading-relaxed text-justify font-red-hat-display">
                    <strong className="text-primary-purple">Themes:</strong> EdTech Evolution, Blockchain Revolution, AI and Machine Learning, AR/VR Realities, HealthTech Innovations, Cybersecurity, Agritech, Social Impact Tech
                  </p>
                </div>
                <div>
                  <p className="text-black text-lg leading-relaxed text-justify font-red-hat-display">
                    <strong className="text-primary-purple">Networking Opportunities:</strong> Collaborate with industry experts, mentors, and peers.
                  </p>
                </div>
                <div>
                  <p className="text-black text-lg leading-relaxed text-justify font-red-hat-display">
                    <strong className="text-primary-purple">Workshops:</strong> Participate in hands-on workshops with cutting-edge technologies.
                  </p>
                </div>
                <div>
                  <p className="text-black text-lg leading-relaxed text-justify font-red-hat-display">
                    <strong className="text-primary-purple">Recognition:</strong> Certificates for all participants.
                  </p>
                </div>
                <div>
                  <p className="text-black text-lg leading-relaxed text-justify font-red-hat-display">
                    <strong className="text-primary-purple">Exciting Perks:</strong> Goodies, swag, free meals, and more.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Lottie Animation */}
            <div className="highlight-item order-2 lg:order-2" data-side="right">
              <div className="relative w-full h-80 lg:h-96 flex items-center justify-center">
                <DotLottieReact
                  src="/BlockchainBlocks.lottie"
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

