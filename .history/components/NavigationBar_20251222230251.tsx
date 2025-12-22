'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { name:  'Home', href: '#home' },
  { name: 'Themes', href: '#themes' },
  { name: 'Schedule', href: '#schedule' },
  { name: 'Prize', href: '#prize' },
  { name: 'Sponsors', href: '#sponsors' },
  { name: 'Patrons', href: '#patrons' },
  { name: 'Team', href: '#team' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
];

export default function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const rightLogoRef = useRef(null);
  const menuItemsRef = useRef<HTMLButtonElement[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animation for left logo
    gsap.fromTo(logoRef.current,
      { opacity: 0, x: -20 },
      { opacity:  1, x: 0, duration: 0.8, ease: "power2.out" }
    );

    // Initial animation for right logo
    gsap.fromTo(rightLogoRef.current,
      { opacity: 0, x: 20 },
      { opacity:  1, x: 0, duration: 0.8, ease: "power2.out" }
    );

    // Stagger animation for desktop menu items
    gsap.fromTo(menuItemsRef.current,
      { opacity: 0, y: -10 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3
      }
    );
  }, []);

  useEffect(() => {
    if (! mobileMenuRef.current) return;

    if (isMobileMenuOpen) {
      // OPEN MENU
      gsap.fromTo(mobileMenuRef.current,
        { 
          opacity: 0,
          height: 0,
          y: -20
        },
        { 
          opacity: 1,
          height: "auto",
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        }
      );

      // Animate mobile menu items
      const mobileItems = mobileMenuRef.current. querySelectorAll('button');
      gsap.fromTo(mobileItems,
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.3, 
          stagger: 0.05,
          ease: "power2.out"
        }
      );
    } else {
      // CLOSE MENU
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        height: 0,
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [isMobileMenuOpen]);

  // Detect when navbar is over hero section using GSAP ScrollTrigger
  useEffect(() => {
    const heroSection = document.getElementById('home');

    if (heroSection) {
      // Create ScrollTrigger to detect when hero section is in view
      ScrollTrigger.create({
        trigger: heroSection,
        start: "top center", // When hero section top reaches viewport center
        end: "bottom center", // When hero section bottom reaches viewport center
        markers: false, // Set to true for debugging
        onEnter: () => setIsOverHero(true), // Entering hero section
        onLeave: () => setIsOverHero(false), // Leaving hero section
        onEnterBack: () => setIsOverHero(true), // Re-entering when scrolling back up
        onLeaveBack: () => setIsOverHero(false), // Leaving again when scrolling back up
      });
    }

    // Initial check based on current scroll position
    const checkInitialState = () => {
      const scrollY = window.scrollY;
      // At page load, if scroll is 0 or hero section is visible, make navbar transparent
      if (scrollY < 10) {
        setIsOverHero(true);
      } else if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        const isHeroInView = heroRect.top <= 0 && heroRect.bottom > 0;
        setIsOverHero(isHeroInView);
      }
    };
    checkInitialState();

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === heroSection) {
          trigger.kill();
        }
      });
    };
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 100; // account for fixed nav height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const target = elementPosition - offset;

      // Use GSAP to animate a dummy object for smooth easing (consistent with Footer)
      gsap.to({ value: window.pageYOffset }, {
        value: target,
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: function() {
          window.scrollTo(0, this.targets()[0].value);
        }
      });

      // click feedback
      const clickedIndex = navItems.findIndex(item => item.href === href);
      if (menuItemsRef.current[clickedIndex]) {
        gsap.to(menuItemsRef.current[clickedIndex], {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    // Animate hamburger icon
    const topLine = document.querySelector('.hamburger-top');
    const middleLine = document.querySelector('.hamburger-middle');
    const bottomLine = document.querySelector('.hamburger-bottom');
    
    if (!isMobileMenuOpen) {
      gsap.to(topLine, { rotation: 45, y: 6, duration: 0.3 });
      gsap.to(middleLine, { opacity: 0, duration: 0.2 });
      gsap.to(bottomLine, { rotation: -45, y: -6, duration: 0.3 });
    } else {
      gsap.to(topLine, { rotation: 0, y: 0, duration: 0.3 });
      gsap.to(middleLine, { opacity:  1, duration: 0.2, delay: 0.1 });
      gsap.to(bottomLine, { rotation: 0, y: 0, duration: 0.3 });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-purple-500/20 transition-all duration-300 ${
        isOverHero
          ? 'bg-transparent text-white'
          : 'bg-white text-black'
      }`}
    >
      {/* Main container with proper padding */}
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 max-w-7xl mx-auto gap-6 space-x-8">
          
          {/* Logo - Left side with proper padding */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              ref={logoRef}
              onClick={() => scrollToSection('#home')}
              className="relative h-12 w-32 md:h-14 md:w-40 hover:opacity-90 transition-opacity duration-300"
            >
              <Image
                src="/raisoni-logo.png"
                alt="GHR Hack 2.0 Logo"
                fill
                className="object-cover"
                priority
              />
            </button>
            <span
              className={`h-12 w-[2px] inline-block rounded-full ${
                isOverHero ? 'bg-white/80' : 'bg-black/40'
              }`}
              aria-hidden="true"
            />
            <button
              ref={rightLogoRef}
              onClick={() => scrollToSection('#home')}
              className="relative h-12 w-32 md:h-14 md:w-40 hover:opacity-90 transition-opacity duration-300"
            >
              <Image
                src="/logo.png"
                alt="Raisoni Logo"
                fill
                className="object-contain"
                priority
              />
            </button>
          </div>

          {/* Desktop Navigation - Right side */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                ref={el => {
                  if (el) menuItemsRef.current[index] = el;
                }}
                onClick={() => scrollToSection(item.href)}
                className={`relative font-red-hat-display font-semibold text-base lg:text-lg px-2 py-1 group hover:text-primary-orange transition-colors duration-300 ${
                  isOverHero ? 'text-white' : 'text-black'
                }`}
              >
                {item. name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-orange to-primary-purple group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </div>

          {/* Mobile - Right side with only menu button (no extra logo) */}
          <div className="lg:hidden flex items-center pr-4 md:pr-6">
            {/* Mobile Menu Button */}
            <button
              onClick={handleMenuToggle}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5">
                <span className={`hamburger-top absolute top-0 left-0 w-6 h-0.5 rounded-full transition-colors duration-300 ${isOverHero ? 'bg-white' : 'bg-black'}`}></span>
                <span className={`hamburger-middle absolute top-1/2 left-0 w-6 h-0.5 rounded-full -translate-y-1/2 transition-colors duration-300 ${isOverHero ? 'bg-white' : 'bg-black'}`}></span>
                <span className={`hamburger-bottom absolute bottom-0 left-0 w-6 h-0.5 rounded-full transition-colors duration-300 ${isOverHero ? 'bg-white' : 'bg-black'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - HIDDEN BY DEFAULT WITH CSS */}
      <div 
        ref={mobileMenuRef} 
        className="lg:hidden overflow-hidden"
        style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
      >
        <div className={`px-6 pb-4 border-t transition-all duration-300 ${
          isOverHero
            ? 'bg-black/80 border-white/10'
            : 'bg-white border-black/20'
        }`}>
          <div className="pt-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`block w-full text-left px-4 py-3 font-red-hat-display font-semibold rounded-lg hover:bg-gradient-to-r hover:from-primary-orange/10 hover:to-primary-purple/10 hover:text-primary-orange transition-all duration-300 border border-transparent hover:border-primary-orange/20 ${
                  isOverHero ? 'text-white' : 'text-black'
                }`}
              >
                {item. name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}