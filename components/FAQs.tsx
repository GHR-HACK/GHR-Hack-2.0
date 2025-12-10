'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { faqs } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const faqRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.from('.faqs-title', {
        scrollTrigger: {
          trigger: '.faqs-title',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Ensure visible defaults
      gsap.set('.faq-item', { autoAlpha: 1, y: 0 });

      // Animate FAQ items with batch for reliability
      ScrollTrigger.batch('.faq-item', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          (batch as HTMLElement[]).forEach((el, idx) => {
            gsap.from(el, {
              y: 30,
              autoAlpha: 0,
              duration: 0.6,
              ease: 'power3.out',
              delay: idx * 0.05,
            });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index: number) => {
    const currentRef = faqRefs.current[index];
    if (!currentRef) return;

    if (openIndex === index) {
      // Close current FAQ
      gsap.to(currentRef.querySelector('.faq-answer'), {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => setOpenIndex(null),
      });
      gsap.to(currentRef.querySelector('.faq-icon'), {
        rotation: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    } else {
      // Close previously open FAQ
      if (openIndex !== null && faqRefs.current[openIndex]) {
        const prevRef = faqRefs.current[openIndex];
        gsap.to(prevRef.querySelector('.faq-answer'), {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        });
        gsap.to(prevRef.querySelector('.faq-icon'), {
          rotation: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        });
      }

      // Open current FAQ
      const answer = currentRef.querySelector('.faq-answer') as HTMLElement;
      gsap.set(answer, { height: 'auto', opacity: 1 });
      const height = answer.offsetHeight;
      gsap.set(answer, { height: 0, opacity: 0 });
      gsap.to(answer, {
        height,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut',
      });
      gsap.to(currentRef.querySelector('.faq-icon'), {
        rotation: 180,
        duration: 0.3,
        ease: 'power2.inOut',
      });
      setOpenIndex(index);
    }
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="pt-12 pb-20 md:pt-16 md:py-32 bg-gradient-to-b from-black via-gray-900 to-black"
    >
      <Container>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-16">
          <Title level={2} variant="gradient" size="xl" className="faqs-title mb-8">
            Frequently Asked Questions
          </Title>
          <p className="text-lg text-white/70 font-red-hat-display max-w-2xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about GHR Hack 2.0.
          </p>
        </div>

        <div className="faqs-grid max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              variant="glass"
              className="faq-item mb-4 cursor-pointer group"
              onClick={() => toggleFAQ(index)}
              ref={(el) => {
                if (el) faqRefs.current[index] = el;
              }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-red-hat-display font-bold text-white group-hover:gradient-text transition-all duration-300 pr-4">
                    {faq.question}
                  </h3>
                  <div className="faq-icon flex-shrink-0 w-6 h-6 text-primary-orange transition-transform duration-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="faq-answer overflow-hidden" style={{ height: 0, opacity: 0 }}>
                  <p className="text-white/70 font-red-hat-display mt-4 pt-4 border-t border-white/10">
                    {faq.answer || "We're working on providing detailed answers for all your questions. Stay tuned for updates!"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        </div>
      </Container>
    </section>
  );
}