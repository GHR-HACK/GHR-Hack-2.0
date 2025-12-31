'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SocialTooltip from './ui/SocialTooltip';
import { eventData, contact, socialLinks } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // account for fixed nav height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const target = elementPosition - offset;

      // Use GSAP to animate a dummy object for smooth easing
      try {
        gsap.to({ value: window.pageYOffset }, {
          value: target,
          duration: 1,
          ease: 'power2.inOut',
          onUpdate: function () {
            window.scrollTo(0, this.targets()[0].value);
          }
        });
      } catch (err) {
        // Fallback to native smooth scroll if GSAP fails
        try {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => window.scrollBy(0, -offset), 200);
        } catch (e) {
          // Last resort: instant jump
          window.scrollTo(0, target);
        }
      }
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate footer content (guard for existence)
      const contentEl = footerRef.current?.querySelector('.footer-content');
      if (contentEl) {
        gsap.from(contentEl, {
          scrollTrigger: {
            trigger: contentEl,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      }

      // Animate footer links (only if present)
      const linkEls = footerRef.current?.querySelectorAll('.footer-links');
      if (linkEls && linkEls.length > 0) {
        gsap.from(Array.from(linkEls), {
          scrollTrigger: {
            trigger: linkEls[0],
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }

    }, footerRef);

    return () => ctx.revert();
  }, []);


  return (
    <footer
      ref={footerRef}
      className="bg-[#5c0f8b] border-t border-purple-500/20 py-16"
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="footer-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-red-hat-display font-bold text-2xl mb-4">
              GHRhack 2.0
            </h3>

            <p className="text-white font-red-hat-display mb-6 max-w-md">
              Join us for an innovative hackathon experience at G H Raisoni College of Engineering and Management, Jalgaon.
            </p>
            <div className="flex items-center">
              <SocialTooltip socialLinks={socialLinks} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-red-hat-display font-bold text-lg mb-6 mt-4 sm:mt-0">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '#home' },
                { name: 'About', href: '#about' },
                { name: 'Themes', href: '#themes' },
                { name: 'Sponsors', href: '#sponsors' },
                { name: 'Team', href: '#team' },
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="footer-links text-white hover:text-primary-orange font-red-hat-display transition-colors duration-300 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-red-hat-display font-bold text-lg mb-6">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-primary-purple">📧</span>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-white hover:text-primary-orange font-red-hat-display text-sm transition-colors duration-300 underline-offset-4 hover:underline"
                >
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-primary-orange">📞</span>
                <div className="text-white font-red-hat-display text-sm">
                  {contact.phones.map((phone, index) => (
                    <a
                      key={index}
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="block hover:text-primary-orange transition-colors duration-300 underline-offset-4 hover:underline"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-primary-purple mt-0.5">📍</span>
                <span className="text-white font-red-hat-display text-sm">{contact.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white font-red-hat-display text-sm mb-4 md:mb-0">
              © 2026 {eventData.name}. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <button
                onClick={() => scrollToSection('#contact')}
                className="text-white hover:text-primary-orange font-red-hat-display transition-colors duration-300"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => scrollToSection('#contact')}
                className="text-white hover:text-primary-orange font-red-hat-display transition-colors duration-300"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>

      </div>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 border border-primary-purple/20 rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-primary-orange/10 rounded-lg animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-primary-purple/20 rotate-45 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </footer>
  );
}