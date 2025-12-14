'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Card from './ui/Card';
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

  const renderSponsorTier = (tier: string, sponsorList: any[], tierClass: string, titleColor: string) => (
    <div className={`sponsor-tier mb-12 ${tierClass}`}>
      <Title level={4} variant="default" size="md" className={`text-center mb-8 ${titleColor}`}>
        {tier} Sponsor{tier === 'Gold' ? '' : 's'}
      </Title>
      <div className="flex flex-wrap justify-center gap-8">
        {sponsorList.map((sponsor, index) => (
          <Card
            key={index}
            variant="elevated"
            hover
            className="sponsor-card group"
          >
            <div className="p-8 text-center">
              {sponsor.logo ? (
                <div className="w-32 h-24 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={128}
                    height={96}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-primary-orange/20 to-primary-purple/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl font-red-hat-display font-bold text-white">
                    {sponsor.name.charAt(0)}
                  </span>
                </div>
              )}
              <h5 className="text-xl font-red-hat-display font-bold text-white group-hover:gradient-text transition-all duration-300">
                {sponsor.name}
              </h5>
            </div>
          </Card>
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
          <p className="text-lg text-black/60 font-red-hat-display max-w-2xl mx-auto">
            Proudly supported by industry leaders and organizations that believe in fostering innovation and creativity.
          </p>
        </div>

        <div className="sponsors-grid space-y-16">
          {/* Gold Sponsors */}
          {renderSponsorTier(
            'Gold',
            sponsors.gold,
            'gold-tier',
            'text-yellow-400'
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
            'silver-tier',
            'text-black/30'
          )}

          {/* Education Partners */}
          <div className="sponsor-tier mb-12 education-partners">
            <Title level={4} variant="default" size="md" className="text-center mb-8 text-primary-purple">
              Education Partners
            </Title>
            <div className="flex flex-wrap justify-center gap-8">
              {sponsors.educationPartners.map((partner, index) => (
                <Card
                  key={index}
                  variant="glass"
                  hover
                  className="sponsor-card group"
                >
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-primary-orange/30 to-primary-purple/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <h5 className="text-lg font-red-hat-display font-bold text-white group-hover:gradient-text transition-all duration-300">
                      {partner.name}
                    </h5>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Food Partners */}
          <div className="sponsor-tier food-partners">
            <Title level={4} variant="default" size="md" className="text-center mb-8 text-primary-orange">
              Food Partners
            </Title>
            <div className="flex flex-wrap justify-center gap-8">
              {sponsors.foodPartners.map((partner, index) => (
                <Card
                  key={index}
                  variant="glass"
                  hover
                  className="sponsor-card group"
                >
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-primary-orange/30 to-primary-purple/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🍕</span>
                    </div>
                    <h5 className="text-lg font-red-hat-display font-bold text-white group-hover:gradient-text transition-all duration-300">
                      {partner.name}
                    </h5>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        </div>
      </Container>
    </section>
  );
}