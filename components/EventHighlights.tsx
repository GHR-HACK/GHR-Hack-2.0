'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { eventHighlights } from '../lib/data';

const highlightsArray = Object.entries(eventHighlights);

export default function EventHighlightsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const animateSlide = (direction: 'next' | 'prev', nextIndex: number) => {
    if (!cardWrapperRef.current) {
      setCurrentIndex(nextIndex);
      setIsAnimating(false);
      return;
    }

    const wrapper = cardWrapperRef.current;
    const fromX = direction === 'next' ? 80 : -80;
    const toX = direction === 'next' ? -80 : 80;

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    // current slide out
    tl.to(wrapper, {
      x: toX,
      autoAlpha: 0,
      scale: 0.9,
      rotationY: direction === 'next' ? -20 : 20,
      duration: 0.45,
      ease: 'power3.inOut',
      onComplete: () => setCurrentIndex(nextIndex),
    });

    // new slide in
    tl.fromTo(
      wrapper,
      {
        x: fromX,
        autoAlpha: 0,
        scale: 0.9,
        rotationY: direction === 'next' ? 20 : -20,
      },
      {
        x: 0,
        autoAlpha: 1,
        scale: 1,
        rotationY: 0,
        duration: 0.55,
        ease: 'power3.out',
      },
      '>-0.02'
    );
  };

  const goTo = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);

    const total = highlightsArray.length;
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % total
        : (currentIndex - 1 + total) % total;

    animateSlide(direction, nextIndex);
  };

  useEffect(() => {
    if (cardWrapperRef.current) {
      gsap.from(cardWrapperRef.current, {
        y: 40,
        autoAlpha: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
  }, []);

  const [key, value] = highlightsArray[currentIndex];

  return (
    <section
      id="highlights"
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
    >
      {/* soft blobs for depth */}
      <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-primary-purple/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary-orange/25 blur-3xl" />

      <Container className="relative z-10">
        <div className="mb-16 max-w-4xl mx-auto px-4">
          <Title
            level={3}
            variant="default"
            size="xl"
            className="text-center mb-10"
          >
            Event Highlights
          </Title>

          <div className="relative flex items-center justify-center">
            {/* LEFT ARROW (desktop/tablet) */}
            <button
              type="button"
              onClick={() => goTo('prev')}
              disabled={isAnimating}
              className="hidden sm:flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 text-white/80
                         hover:border-primary-purple hover:text-primary-purple transition-colors duration-200 mr-3 md:mr-6"
              aria-label="Previous highlight"
            >
              ‹
            </button>

            {/* CARD WRAPPER for GSAP */}
            <div
              ref={cardWrapperRef}
              className="flex-1 flex justify-center"
            >
              <Card
                variant="glass"
                hover
                className="w-full max-w-md md:max-w-lg transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-center px-6 py-7 md:px-8 md:py-10">
                  <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-r from-primary-purple to-primary-orange rounded-full flex items-center justify-center shadow-lg shadow-primary-purple/40">
                    <span className="text-3xl font-red-hat-display font-bold text-white">
                      {currentIndex + 1}
                    </span>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-red-hat-display font-bold text-white mb-3 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-white/75 font-red-hat-display leading-relaxed text-sm md:text-base">
                    {value}
                  </p>
                </div>
              </Card>
            </div>

            {/* RIGHT ARROW (desktop/tablet) */}
            <button
              type="button"
              onClick={() => goTo('next')}
              disabled={isAnimating}
              className="hidden sm:flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 text-white/80
                         hover:border-primary-orange hover:text-primary-orange transition-colors duration-200 ml-3 md:ml-6"
              aria-label="Next highlight"
            >
              ›
            </button>
          </div>

          {/* MOBILE CONTROLS + DOTS */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex sm:hidden justify-center gap-6">
              <button
                type="button"
                onClick={() => goTo('prev')}
                disabled={isAnimating}
                className="flex items-center justify-center px-4 py-2 rounded-full border border-white/30 text-white/80 text-sm
                           hover:border-primary-purple hover:text-primary-purple transition-colors duration-200"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => goTo('next')}
                disabled={isAnimating}
                className="flex items-center justify-center px-4 py-2 rounded-full border border-white/30 text-white/80 text-sm
                           hover:border-primary-orange hover:text-primary-orange transition-colors duration-200"
              >
                Next
              </button>
            </div>

            <div className="flex justify-center gap-2">
              {highlightsArray.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => !isAnimating && setCurrentIndex(idx)}
                  className={`h-2 w-2 rounded-full transition-all duration-200 ${
                    idx === currentIndex
                      ? 'bg-primary-purple w-5'
                      : 'bg-white/30'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
