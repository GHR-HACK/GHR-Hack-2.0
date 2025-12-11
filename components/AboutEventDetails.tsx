'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Title from './ui/Title';
import Container from './ui/Container';
import { aboutEvent } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function AboutEventDetails() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Show section when mounted
      setIsVisible(true);

      // **1. SIMPLE MATRIX RAIN BACKGROUND**
      const canvas = document.createElement('canvas');
      const ctx2d = canvas.getContext('2d');
      canvas.className = 'absolute inset-0 pointer-events-none opacity-30';
      canvas.style.zIndex = '1';
      sectionRef.current?.prepend(canvas);

      let animationFrame: number;
      if (canvas && ctx2d) {
        const resizeCanvas = () => {
          canvas.width = sectionRef.current?.offsetWidth || window.innerWidth;
          canvas.height = sectionRef.current?.offsetHeight || 800;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*";
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops: number[] = Array(columns).fill(1);
        
        const draw = () => {
          ctx2d.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx2d.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx2d.fillStyle = '#0ea5e9';
          ctx2d.font = `${fontSize}px monospace`;
          
          for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx2d.fillText(text, x, y);
            
            if (y > canvas.height && Math.random() > 0.975) {
              drops[i] = 0;
            }
            drops[i]++;
          }
          
          animationFrame = requestAnimationFrame(draw);
        };
        
        draw();
      }

      // **2. TITLE ANIMATION - SIMPLE AND EFFECTIVE**
      const title = titleRef.current;
      if (title) {
        // Enter animation
        gsap.fromTo(title,
          {
            y: 100,
            opacity: 0,
            scale: 0.8,
            rotationX: 20,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 1.5,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: title,
              start: 'top 80%',
              toggleActions: 'play none none none',
            }
          }
        );

        // Gradient animation
        gsap.to(title, {
          backgroundPosition: '200% 50%',
          duration: 5,
          repeat: -1,
          ease: 'linear',
        });

        // Glow pulse animation
        gsap.to(title, {
          textShadow: '0 0 30px rgba(59, 130, 246, 0.8)',
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // **3. PERFECT WORD-BY-WORD REVEAL ANIMATION**
      const description = descriptionRef.current;
      if (description) {
        const originalText = aboutEvent.description;
        
        // Split text into words
        const words = originalText.split(' ');
        
        // Clear and prepare container
        description.innerHTML = '';
        
        // Create a container for words
        const wordsContainer = document.createElement('div');
        wordsContainer.className = 'flex flex-wrap justify-center gap-2';
        
        // Create each word as separate element
        words.forEach((word, index) => {
          const wordSpan = document.createElement('span');
          wordSpan.className = `word-element inline-block opacity-0 transform translate-y-10`;
          wordSpan.textContent = word;
          wordSpan.style.display = 'inline-block';
          wordSpan.style.marginRight = '0.25rem'; // Small space between words
          
          // Store reference
          if (wordsRef.current) {
            wordsRef.current[index] = wordSpan;
          }
          
          wordsContainer.appendChild(wordSpan);
        });
        
        description.appendChild(wordsContainer);
        
        // Animate words one by one when in view
        ScrollTrigger.create({
          trigger: description,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            // Get all word elements
            const wordElements = description.querySelectorAll('.word-element');
            
            // Animate each word separately
            gsap.to(wordElements, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.08, // Delay between each word
              ease: 'back.out(1.2)',
              onComplete: () => {
                // Add hover effects to words after animation
                wordElements.forEach(word => {
                  word.addEventListener('mouseenter', () => {
                    gsap.to(word, {
                      scale: 1.1,
                      color: '#60a5fa',
                      duration: 0.2,
                      ease: 'power2.out'
                    });
                  });
                  
                  word.addEventListener('mouseleave', () => {
                    gsap.to(word, {
                      scale: 1,
                      color: '#d1d5db',
                      duration: 0.2,
                      ease: 'power2.out'
                    });
                  });
                });
              }
            });
          }
        });
      }

      // **4. FLOATING PARTICLES EFFECT**
      const particlesCount = 15;
      for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full';
        particle.style.width = `${Math.random() * 6 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.background = `radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent)`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.zIndex = '2';
        
        if (sectionRef.current) {
          sectionRef.current.appendChild(particle);
          
          // Floating animation
          gsap.to(particle, {
            y: `+=${(Math.random() * 100) - 50}`,
            x: `+=${(Math.random() * 100) - 50}`,
            duration: Math.random() * 10 + 10,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
      }

      // **5. SCAN LINE EFFECT**
      const scanLine = document.createElement('div');
      scanLine.className = 'absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent';
      scanLine.style.zIndex = '3';
      scanLine.style.opacity = '0';
      scanLine.style.filter = 'blur(1px)';
      
      if (sectionRef.current) {
        sectionRef.current.appendChild(scanLine);
        
        gsap.to(scanLine, {
          top: '100%',
          opacity: 0.5,
          duration: 3,
          repeat: -1,
          delay: 1,
          ease: 'none',
          onRepeat: () => {
            gsap.set(scanLine, { top: 0, opacity: 0 });
          }
        });
      }

      // **6. GLOWING ORBS BACKGROUND**
      const createOrb = (color: string, size: number, left: string, top: string) => {
        const orb = document.createElement('div');
        orb.className = 'absolute rounded-full';
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        orb.style.background = `radial-gradient(circle, ${color}, transparent 70%)`;
        orb.style.left = left;
        orb.style.top = top;
        orb.style.filter = 'blur(40px)';
        orb.style.opacity = '0.3';
        orb.style.zIndex = '1';
        
        if (sectionRef.current) {
          sectionRef.current.appendChild(orb);
          
          // Gentle pulse animation
          gsap.to(orb, {
            scale: 1.2,
            opacity: 0.4,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        }
      };
      
      // Create three glowing orbs
      createOrb('rgba(59, 130, 246, 0.5)', 300, '10%', '20%');
      createOrb('rgba(139, 92, 246, 0.5)', 250, '80%', '60%');
      createOrb('rgba(236, 72, 153, 0.5)', 200, '30%', '70%');

      // **7. SCROLL TRIGGER FOR SECTION**
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => {
          // Add a subtle shake effect
          gsap.to(sectionRef.current, {
            x: 5,
            duration: 0.05,
            repeat: 5,
            yoyo: true,
            onComplete: () => {
              gsap.to(sectionRef.current, { x: 0, duration: 0.1 });
            }
          });
        }
      });

    }, sectionRef);

    // Cleanup function
    return () => {
      ctx.revert();
      // if (animationFrame) {
      //   cancelAnimationFrame(animationFrame);
      // }
      // Remove all dynamically created elements
      if (sectionRef.current) {
        const dynamicElements = sectionRef.current.querySelectorAll('.absolute.rounded-full, canvas, .absolute.h-px');
        dynamicElements.forEach(el => el.remove());
      }
    };
  }, []);

  return (
    <section
      id="themes"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-black overflow-hidden min-h-screen"
    >
      {/* CRT SCANLINES EFFECT */}
      <div className="crt-effect absolute inset-0 pointer-events-none z-10">
        <div className="scanlines absolute inset-0 opacity-[0.03]"></div>
      </div>

      <Container className="relative z-20">
        <div className="text-center mb-8 md:mb-12 max-w-5xl mx-auto px-4">
          {/* MAIN TITLE */}
          <div className="relative mb-12 md:mb-16">
            <div className="hologram-border absolute -inset-4 rounded-3xl"></div>
            
            <Title
              ref={titleRef}
              level={2}
              className="about-title text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent 
                       bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 py-6 md:py-8 
                       bg-[length:200%_auto]"
            >
              {aboutEvent.title}
            </Title>
            
            {/* SUBTLE TITLE SHADOW */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none -z-10">
              <div className="text-4xl md:text-6xl lg:text-7xl font-bold opacity-10 blur-sm">
                {aboutEvent.title}
              </div>
            </div>
          </div>

          {/* DESCRIPTION CARD */}
          <div className="cyber-terminal relative max-w-4xl mx-auto">
            {/* TERMINAL HEADER */}
            <div className="terminal-header bg-gray-900/80 backdrop-blur-sm border-t border-x border-blue-500/40 rounded-t-2xl p-4 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-blue-400 font-mono text-sm md:text-base">
                  HACKATHON_DETAILS
                </span>
              </div>
            </div>
            
            {/* TERMINAL BODY */}
            <div className="terminal-body bg-black/60 backdrop-blur-sm border border-blue-500/40 rounded-b-2xl p-6 md:p-8">
              {/* COMMAND LINE */}
              <div className="flex items-start mb-6">
                <span className="text-green-400 font-mono mr-3 text-lg">{'>>>'}</span>
                <span className="text-blue-400 font-mono text-lg">get_event_info()</span>
              </div>
              
              {/* DESCRIPTION TEXT */}
              <div className="pl-4 border-l-2 border-blue-500/50 ml-2">
                <div 
                  ref={descriptionRef}
                  className="about-description text-lg md:text-xl text-gray-300 leading-relaxed font-rajdhani"
                >
                  {/* Words will be inserted here by GSAP */}
                </div>
                
                {/* BLINKING CURSOR */}
                <div className="inline-block w-2 h-6 bg-green-400 ml-1 mt-2 animate-pulse"></div>
              </div>
              
              {/* FOOTER */}
              <div className="mt-8 pt-4 border-t border-gray-800 flex items-center">
                <span className="text-green-400 font-mono mr-2">{'$'}</span>
                <span className="text-white font-mono animate-pulse">ready_for_hackathon</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* INLINE STYLES */}
      <style >{`
        .crt-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.1) 50%
          );
          background-size: 100% 4px;
          pointer-events: none;
          animation: scanline 10s linear infinite;
        }
        
        .scanlines {
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.05) 50%
          );
          background-size: 100% 4px;
        }
        
        .hologram-border {
          background: linear-gradient(90deg, 
            transparent, 
            rgba(59, 130, 246, 0.2), 
            rgba(139, 92, 246, 0.2), 
            rgba(236, 72, 153, 0.2), 
            transparent
          );
          background-size: 200% 100%;
          animation: borderFlow 4s linear infinite;
        }
        
        .terminal-body {
          box-shadow: 
            0 0 40px rgba(59, 130, 246, 0.2),
            inset 0 0 20px rgba(59, 130, 246, 0.1);
        }
        
        @keyframes scanline {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        
        @keyframes borderFlow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes dataPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(0.8); }
          50% { opacity: 0.8; transform: scaleY(1.1); }
        }
        
        .word-element {
          transition: all 0.3s ease;
          will-change: transform, opacity;
        }
        
        .word-element:hover {
          color: #60a5fa;
          text-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
          transform: translateY(-2px);
        }
        
        @keyframes wordReveal {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .word-reveal {
          animation: wordReveal 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}