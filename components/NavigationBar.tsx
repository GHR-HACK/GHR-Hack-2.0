'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Themes', href: '#themes' },
  { name: 'Schedule', href: '#schedule' },
  { name: 'Prize', href: '#prize' },
  { name: 'Sponsors', href: '#sponsors' },
  { name: 'Team', href: '#team' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
];

export default function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const menuItemsRef = useRef<HTMLButtonElement[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animation for logo
    gsap.fromTo(logoRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
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
    if (mobileMenuRef.current) {
      // Ensure closed state on mount to avoid flicker
      gsap.set(mobileMenuRef.current, { height: 0, opacity: 0 });

      if (isMobileMenuOpen) {
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
        const mobileItems = mobileMenuRef.current.querySelectorAll('button');
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
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          height: 0,
          duration: 0.3,
          ease: "power2.in"
        });
      }
    }
  }, [isMobileMenuOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 100; // account for fixed nav height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const target = elementPosition - offset;

      window.scrollTo({
        top: target,
        behavior: 'smooth',
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
      gsap.to(middleLine, { opacity: 1, duration: 0.2, delay: 0.1 });
      gsap.to(bottomLine, { rotation: 0, y: 0, duration: 0.3 });
    }
  };

  return (
    <nav 
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-purple-500/20"
    >
      {/* Main container with proper padding */}
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-20 mx-auto max-w-7xl">
          
          {/* Logo - Left side with ample padding */}
          <div className="pl-12 lg:pl-12 xl:pl-16">
            <button
              ref={logoRef}
              onClick={() => scrollToSection('#home')}
              className="text-2xl md:text-3xl font-bold font-orbitron bg-gradient-to-r from-orange-400 via-purple-500 to-orange-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity duration-300"
            >
              GHR Hack 2.0
            </button>
          </div>

          {/* Desktop Navigation - Right side with proper spacing */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 pr-6 xl:pr-8">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                ref={el => {
                  if (el) menuItemsRef.current[index] = el;
                }}
                onClick={() => scrollToSection(item.href)}
                className="relative font-rajdhani font-semibold text-white text-base lg:text-lg px-2 py-1 group hover:text-orange-400 transition-colors duration-300"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden pr-4 md:pr-6">
            <button
              onClick={handleMenuToggle}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5">
                <span className="hamburger-top absolute top-0 left-0 w-6 h-0.5 bg-white rounded-full"></span>
                <span className="hamburger-middle absolute top-1/2 left-0 w-6 h-0.5 bg-white rounded-full -translate-y-1/2"></span>
                <span className="hamburger-bottom absolute bottom-0 left-0 w-6 h-0.5 bg-white rounded-full"></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div ref={mobileMenuRef} className="lg:hidden overflow-hidden">
        <div className="px-6 pb-4 bg-gradient-to-b from-black/95 to-purple-900/10 border-t border-white/10">
          <div className="pt-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left px-4 py-3 font-rajdhani font-semibold text-white rounded-lg hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-purple-500/10 hover:text-orange-300 transition-all duration-300 border border-transparent hover:border-orange-500/20"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}