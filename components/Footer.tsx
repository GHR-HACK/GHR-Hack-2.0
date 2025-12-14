'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Instagram } from 'lucide-react';
import Image from 'next/image';
import Title from './ui/Title';
import Container from './ui/Container';
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
      gsap.to({ value: window.pageYOffset }, {
        value: target,
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: function() {
          window.scrollTo(0, this.targets()[0].value);
        }
      });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate footer content
      gsap.from('.footer-content', {
        scrollTrigger: {
          trigger: '.footer-content',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Animate footer links
      gsap.from('.footer-links', {
        scrollTrigger: {
          trigger: '.footer-links',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });

    }, footerRef);

    return () => ctx.revert();
  }, []);

  const socialIcons = {
    linkedin: (
      <Linkedin className="w-6 h-6" style={{ color: 'white' }} fill="white" />
    ),   
    instagram: (
      <Instagram className="w-6 h-6" style={{ color: 'white' }} stroke="white" strokeWidth={1.5} />
    ),   
    discord: (
      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
      </svg>
    ),
  };

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
            <div className="flex space-x-4">
              {Object.entries(socialLinks).map(([platform, link]) => (
                <a
                  key={platform}
                  href={link || '#'}
                  className="footer-social w-10 h-10  rounded-full flex items-center justify-center hover:bg-primary-orange/20 transition-all duration-300 hover:scale-110 text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {socialIcons[platform as keyof typeof socialIcons]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-red-hat-display font-bold text-lg mb-6">Quick Links</h4>
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
                <span className="text-white font-red-hat-display text-sm">{contact.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-primary-orange">📞</span>
                <div className="text-white font-red-hat-display text-sm">
                  {contact.phones.map((phone, index) => (
                    <div key={index}>{phone}</div>
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