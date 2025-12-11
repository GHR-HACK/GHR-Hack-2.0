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
      let subtitleSplit:  SplitText | null = null;
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

      // SplitText animation for tagline
      let taglineSplit: SplitText | null = null;
      if (taglineRef.current) {
        taglineSplit = new SplitText(taglineRef.current, { type: 'chars' });
        gsap.from(taglineSplit. chars, {
          duration: 1.4,
          y: 30,
          opacity: 0,
          stagger: 0.03,
          ease: 'power3.out',
          delay: 0.6,
        });
      }

      // Button animations
      const buttonTextSplits:  SplitText[] = [];
      if (buttonsRef.current) {
        const btnTexts = buttonsRef.current.querySelectorAll('. split-btn-text');
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

      if (buttonsRef.current?. children) {
        gsap.from(buttonsRef. current.children, {
          opacity: 0.85,
          y: 16,
          stagger: 0.2,
          duration: 0.6,
          delay: 0.7,
          ease: 'power3.out',
        });
      }

      // Floating background elements
      gsap.to('. floating-element', {
        y: 20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen flex items-center justify-center relative">
      <div className="text-center z-10">
        <Title ref={titleRef} />
        
        <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-300 mt-4">
          Join the Ultimate 30-Hour Hackathon Experience
        </p>
        
        <p ref={taglineRef} className="text-lg text-gray-400 mt-2">
          Code to Career
        </p>

        {/* Action Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8">
          <DevfolioButton hackathonSlug="ghrhack2" />
          
          <Button
            variant="primary"
            className="split-btn-text"
          >
            Learn More
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  );
}
