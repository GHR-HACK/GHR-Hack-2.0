'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { SplitText } from 'gsap/SplitText';
import Button from './ui/Button';
import Title from './ui/Title';
import ParticlesWeb from './particles-web';
import OptimizedSnakeCursor from './ui/custom-cursor';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText);

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

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
      // ScrambleText animation for title - apply to entire text
      if (titleRef.current) {
        // Clear and set initial scrambled state
        titleRef.current.textContent = "";
        // Apply scramble animation to the entire text
        gsap.to(titleRef.current, {
          duration: 2,
          scrambleText: {
            text: "GHRhack 2.0",
            chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnz",
            revealDelay: 0.4,
            speed: 0.15
          }
        });
      }

      // SplitText animation for subtitle (chars)
      let subtitleSplit: SplitText | null = null;
      if (subtitleRef.current) {
        subtitleSplit = new SplitText(subtitleRef.current, { type: 'chars' });
        gsap.from(subtitleSplit.chars, {
          duration: 1.2,
          y: 30,
          opacity: 0,
          stagger: 0.03,
          ease: 'power3.out',
          delay: 0.4,
        });
      }


      // SplitText for button texts (chars)
      const buttonTextSplits: SplitText[] = [];
      if (buttonsRef.current) {
        const btnTexts = buttonsRef.current.querySelectorAll('.split-btn-text');
        btnTexts.forEach((el, idx) => {
          const split = new SplitText(el as HTMLElement, { type: 'chars' });
          buttonTextSplits.push(split);
          gsap.from(split.chars, {
            duration: 1.1,
            y: 20,
            opacity: 0,
            stagger: 0.025,
            ease: 'power3.out',
            delay: 0.8 + idx * 0.1,
          });
        });
      }

      if (buttonsRef.current?.children) {
        gsap.from(buttonsRef.current.children, {
          opacity: 0.85,
          y: 16,
          stagger: 0.2,
          duration: 0.6,
          delay: 0.7,
          ease: 'power3.out',
        });
      }

      // 3D parallax effect on scroll
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set('.hero-3d', {
            rotationY: progress * 10,
            rotationX: progress * 5,
            scale: 1 - progress * 0.1,
          });
        },
      });


      return () => {
        if (subtitleSplit) subtitleSplit.revert();
        buttonTextSplits.forEach((split) => split.revert());
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
<>  
    {/* Mouse Animation - Only for Hero Section */}
    <OptimizedSnakeCursor />

    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-32 md:pt-40"
    >
      {/* Animated Background */}
      
      <div ref={backgroundRef} className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
      </div>

      {/* Particles Background */}
      <ParticlesWeb />

      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center hero-3d">
        <div className="max-w-5xl mx-auto">
          {/* Main Title */}
          <Title
            ref={titleRef}
            level={1}
            variant="gradient"
            size="3xl"
            className="mb-6 leading-tight text-6xl md:text-7xl lg:text-8xl"
          >
            GHRhack 2.0
          </Title>

          {/* Subtitle */}
          <div
            ref={subtitleRef}
            className="text-xl md:text-2xl text-white/80 font-red-hat-display font-light mb-12 max-w-3xl mx-auto leading-relaxed split-subtitle text-center"
          >
            <p className="mb-2 text-3xl md:text-4xl font-semibold text-white">Code the career</p>
            <p>28 Feb - 1 March 2026</p>
          </div>
         
          {/* Devfolio Apply Button */}
          <div className="flex justify-center py-8">
            <div
              className="apply-button"
              data-hackathon-slug="ghrhack2"
              data-button-theme="light"
              style={{ height: '44px', width: '312px' }}
            ></div>
          </div>

        </div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
    </>
  );
}
