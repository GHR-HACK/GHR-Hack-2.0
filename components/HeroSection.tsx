'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { SplitText } from 'gsap/SplitText';
import Button from './ui/Button';
import Title from './ui/Title';
import DevfolioButton from './DevfolioButton';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText);

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ScrambleText animation for title
      if (titleRef.current) {
        titleRef.current.textContent = "";
        gsap.to(titleRef.current, {
          duration: 2,
          scrambleText: {
            text: "GHR Hack 2.0",
            chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
            revealDelay: 0.4,
            speed: 0.15
          }
        });
      }

      // SplitText animation for subtitle
      let subtitleSplit: SplitText | null = null;
      if (subtitleRef. current) {
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

      // SplitText animation for tagline
      let taglineSplit: SplitText | null = null;
      if (taglineRef. current) {
        taglineSplit = new SplitText(taglineRef.current, { type: 'chars' });
        gsap.from(taglineSplit.chars, {
          duration: 1.4,
          y: 30,
          opacity: 0,
          stagger: 0.03,
          ease: 'power3.out',
          delay: 0.6,
        });
      }

      // Floating background elements
      gsap. to('.floating-element', {
        y: 'random(-20, 20)',
        x: 'random(-10, 10)',
        rotation: 'random(-5, 5)',
        duration: 'random(3, 6)',
        ease: 'none',
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
      });

      // 3D parallax effect on scroll
      ScrollTrigger.create({
        trigger: heroRef. current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set('. hero-3d', {
            rotationY: progress * 10,
            rotationX: progress * 5,
            scale: 1 - progress * 0.1,
          });
        },
      });

      // Mouse movement parallax
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;

        gsap.to('. parallax-element', {
          x: moveX * 20,
          y: moveY * 20,
          duration: 0.5,
          ease: 'power2.out',
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (subtitleSplit) subtitleSplit.revert();
        if (taglineSplit) taglineSplit.revert();
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black pt-32 md:pt-40"
    >
      <div ref={backgroundRef} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />

        <div className="floating-element absolute top-20 left-20 w-32 h-32 border border-primary-purple/30 rounded-full parallax-element" />
        <div className="floating-element absolute top-40 right-32 w-24 h-24 bg-primary-orange/10 rounded-lg parallax-element" />
        <div className="floating-element absolute bottom-32 left-32 w-20 h-20 border border-primary-orange/30 rotate-45 parallax-element" />
        <div className="floating-element absolute bottom-20 right-20 w-28 h-28 bg-primary-purple/10 rounded-full parallax-element" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center hero-3d">
        <div className="max-w-5xl mx-auto">
          <Title
            ref={titleRef}
            level={1}
            variant="gradient"
            size="3xl"
            className="mb-6 leading-tight"
          >
            GHR Hack 2.0
          </Title>

          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-white/80 font-red-hat-display font-light mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Code the Unexplored • 28 Hours of Innovation • March 8-9, 2025
          </p>

          <p
            ref={taglineRef}
            className="text-lg md:text-xl text-primary-orange font-red-hat-display font-medium mb-12 italic"
          >
            "GHR-HACK, a groundbreaking hackathon by GHRCEM JALGAON, redefines creativity and technology.  Join us in the pursuit of innovation, transcending traditional hackathons."
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <DevfolioButton hackathonSlug="ghrhack2" />

            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const element = document.querySelector('#about');
                if (element) {
                  gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: element, offsetY: 80 },
                    ease: 'power2.inOut',
                  });
                }
              }}
              className="font-red-hat-display text-lg px-8 py-4"
            >
              Register Now
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const element = document.querySelector('#about');
                if (element) {
                  gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: element, offsetY: 80 },
                    ease: 'power2.inOut',
                  });
                }
              }}
              className="font-red-hat-display text-lg px-8 py-4 border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-black"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
