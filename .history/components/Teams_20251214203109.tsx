'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import Button from './ui/Button';
import { contact, socialLinks } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
    agree: false,
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.from('.contact-title', {
        scrollTrigger: {
          trigger: '.contact-title',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Animate contact cards
      gsap.from('.contact-card', {
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)',
      });

      // Animate form - from right like timeline
      gsap.from('.contact-form', {
        scrollTrigger: {
          trigger: '.contact-form',
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
        x: 40,
        autoAlpha: 0,
        duration: 0.8,
        delay: 0.1,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      interest: '',
      message: '',
      agree: false,
    });
  };

  const socialIcons = {
    linkedin: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    devfolio: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-5.568 9.76-5.568-9.76 2.928-1.44 2.64 4.608 2.64-4.608 2.928 1.44z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    whatsapp: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
      </svg>
    ),
    discord: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
      </svg>
    ),
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="pt-20 pb-8 md:pt-24 md:pb-12 bg-white"
    >
      <Container>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-12 md:mb-16">
          <Title level={2} variant="gradient" size="xl" className="contact-title mb-8">
            Get In Touch
          </Title>
          <p className="text-lg text-black/60 font-red-hat-display max-w-2xl mx-auto group-hover:text-black/80 transition-colors duration-300">
            Ready to join the revolution? Connect with us and be part of GHR Hack 2.0.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-0">
          {/* Contact Information */}
          <div className="contact-grid space-y-8">
            {/* Registration Card */}
            <Card variant="elevated" className="contact-card p-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-orange to-primary-purple rounded-full flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <Title level={3} variant="default" size="md" className="mb-4">
                  How to Register
                </Title>
                <p className="text-black/60 font-red-hat-display mb-6 group-hover:text-black/80 transition-colors duration-300">
                  Scan the QR code to register for GHR Hack 2.0
                </p>
                <div className="w-32 h-32 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">📱</span>
                  {/* QR Code placeholder - replace with actual QR code */}
                </div>
                <div className="space-y-2 text-sm text-black/50 group-hover:text-black/70 transition-colors duration-300">
                  <p>📧 No Registration Fees</p>
                  <p>🎯 Free registration for all participants</p>
                  <p>👥 Open to students and professionals nationwide</p>
                </div>
              </div>
            </Card>

            {/* Contact Details */}
            <Card variant="glass" className="contact-card p-8">
              <div className="space-y-6">
                <Title level={3} variant="default" size="md" className="text-center mb-6">
                  Contact Information
                </Title>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-purple/20 rounded-full flex items-center justify-center">
                    <span className="text-primary-purple">📧</span>
                  </div>
                  <div>
                    <p className="text-black font-red-hat-display font-medium">Email</p>
                    <p className="text-black/70 group-hover:text-black transition-colors duration-300">{contact.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-orange/20 rounded-full flex items-center justify-center">
                    <span className="text-primary-orange">📞</span>
                  </div>
                  <div>
                    <p className="text-black font-red-hat-display font-medium">Phone</p>
                    {contact.phones.map((phone, index) => (
                      <p key={index} className="text-black/70 group-hover:text-black transition-colors duration-300">{phone}</p>
                    ))}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-purple/20 rounded-full flex items-center justify-center mt-1">
                    <span className="text-primary-purple">📍</span>
                  </div>
                  <div>
                    <p className="text-black font-red-hat-display font-medium">Address</p>
                    <p className="text-black/70 group-hover:text-black transition-colors duration-300">{contact.address}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Links */}
            <Card variant="gradient" className="contact-card p-8">
              <div className="text-center">
                <Title level={3} variant="default" size="md" className="mb-6">
                  Follow Us
                </Title>
                <div className="flex justify-center space-x-6">
                  {Object.entries(socialLinks).map(([platform, link]) => (
                    <a
                      key={platform}
                      href={link || '#'}
                      className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary-purple/20 transition-all duration-300 hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {socialIcons[platform as keyof typeof socialIcons]}
                    </a>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card variant="elevated" className="contact-form p-6 md:p-8 h-auto mb-0">
            <Title level={3} variant="gradient" size="md" className="mb-6 text-center">
              Send us a Message
            </Title>

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div>
                <label className="block text-black font-red-hat-display font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-black/20 rounded-lg text-black placeholder-black/40 focus:outline-none focus:border-primary-purple focus:shadow-lg transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-black font-red-hat-display font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-black/20 rounded-lg text-black placeholder-black/40 focus:outline-none focus:border-primary-purple focus:shadow-lg transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-black font-red-hat-display font-medium mb-2">
                  Phone Number *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-3 bg-black/5 border border-r-0 border-black/20 rounded-l-lg text-black">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-4 py-3 bg-white border border-black/20 rounded-r-lg text-black placeholder-black/40 focus:outline-none focus:border-primary-purple focus:shadow-lg transition-all duration-300"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black font-red-hat-display font-medium mb-2">
                  I AM INTERESTED IN:
                </label>
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-black/20 rounded-lg text-black focus:outline-none focus:border-primary-purple focus:shadow-lg transition-all duration-300"
                >
                  <option value="">Select an option</option>
                  <option value="participating">Participating</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="sponsorship">Sponsorship</option>
                  <option value="helping">Helping</option>
                  <option value="event">Event Information</option>
                </select>
              </div>

              <div>
                <label className="block text-black font-red-hat-display font-medium mb-2">
                  Leave us a message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-black/20 rounded-lg text-black placeholder-black/40 focus:outline-none focus:border-primary-purple focus:shadow-lg transition-all duration-300 resize-none"
                  placeholder="Tell us more about your interest..."
                />
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-4 h-4 text-primary-purple bg-white border-black/20 rounded focus:ring-primary-purple"
                />
                <label className="text-black/60 font-red-hat-display text-sm group-hover:text-black/80 transition-colors duration-300">
                  I have read & I agree to the privacy policy.
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-red-hat-display"
              >
                Submit
              </Button>
            </form>
          </Card>
        </div>
        </div>
      </Container>
    </section>
  );
}