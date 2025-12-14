'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Title from './ui/Title';
import Container from './ui/Container';
import { sponsors } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function Sponsors() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Devfolio script
    const script = document.createElement('script');
    script.src = 'https://apply.devfolio.co/v2/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ultra-light sponsors animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(['.sponsors-title', '.sponsor-tier', '.sponsor-card'], {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power1.out',
            stagger: 0.06
          });
        }
      });

      // Animate individual sponsor cards
      gsap.from('.sponsor-card', {
        scrollTrigger: {
          trigger: '.sponsors-grid',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderSponsorTier = (tier: string, sponsorList: any[], tierClass: string) => (
    <div className={`sponsor-tier mb-12 ${tierClass}`}>
      <Title level={4} variant="default" size="md" className={`text-center mb-8 text-primary-orange`}>
        {tier} Sponsor{tier === 'Gold' ? '' : 's'}
      </Title>
      <div className="sponsors-logos flex flex-wrap justify-center gap-8">
        {sponsorList.map((sponsor, index) => (
          <div key={index} className="sponsor-logo-container h-24 flex items-center justify-center hover:scale-110 transition-transform duration-300">
            {sponsor.logo ? (
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="sponsor-logo max-h-24 max-w-32 object-contain"
              />
            ) : (
              <span className="text-lg font-red-hat-display font-bold text-black/60">
                {sponsor.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      id="sponsors"
      ref={sectionRef}
      className="py-20 md:py-32 bg-primary-purple/10"
    >
      <Container>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-16">
          <Title level={2} variant="gradient" size="xl" className="sponsors-title mb-8">
            Our Sponsors
          </Title>
        </div>

        <div className="sponsors-grid space-y-16">
          {/* Gold Sponsors */}
          {renderSponsorTier(
            'Gold',
            sponsors.gold,
            'gold-tier'
          )}

          {/* Devfolio Apply Button */}
          <div className="flex justify-center py-8">
            <div
              className="apply-button"
              data-hackathon-slug="ghrhack2"
              data-button-theme="light"
              style={{ height: '44px', width: '312px' }}
            ></div>
          </div>

          {/* Silver Sponsors */}
          {renderSponsorTier(
            'Silver',
            sponsors.silver,
            'silver-tier'
          )}
        </div>

        </div>
      </Container>
    </section>
  );
}