'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { organizers } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function Organizers() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.from('.organizers-title', {
        scrollTrigger: {
          trigger: '.organizers-title',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Animate organizer cards
      gsap.from('.organizer-card', {
        scrollTrigger: {
          trigger: '.organizers-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const teamRoles = [
    { key: 'technical', title: 'Technical Team', color: 'text-blue-400', icon: '💻' },
    { key: 'design', title: 'Design Team', color: 'text-pink-400', icon: '🎨' },
    { key: 'marketing', title: 'Marketing Team', color: 'text-green-400', icon: '📢' },
    { key: 'finance', title: 'Finance Team', color: 'text-yellow-400', icon: '💰' },
    { key: 'logistic', title: 'Logistics Team', color: 'text-purple-400', icon: '🚚' },
    { key: 'operations', title: 'Operations Team', color: 'text-red-400', icon: '⚙️' },
  ];

  return (
    <section
      id="team"
      ref={sectionRef}
      className="py-20 md:py-32 bg-gradient-to-b from-gray-900 via-black to-gray-900"
    >
      <Container>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <Title level={2} variant="gradient" size="xl" className="organizers-title mb-8">
            Meet Our Team
          </Title>
          <p className="text-lg text-white/70 font-red-hat-display max-w-2xl mx-auto">
            The passionate individuals behind GHR Hack 2.0, working tirelessly to make this event unforgettable.
          </p>
        </div>

        <div className="organizers-grid space-y-16">
          {/* Overall Coordinators */}
          <div>
            <Title level={3} variant="default" size="lg" className="text-center mb-8 text-yellow-400">
              Overall Coordinators
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {organizers.coordinators.map((coordinator, index) => (
                <Card
                  key={index}
                  variant="elevated"
                  hover
                  className="organizer-card group"
                >
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-purple to-primary-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl font-red-hat-display font-bold text-white">
                        {coordinator.name.charAt(0)}
                      </span>
                    </div>
                    <h4 className="text-lg font-red-hat-display font-bold text-white mb-2 group-hover:gradient-text transition-all duration-300">
                      {coordinator.name}
                    </h4>
                    <p className="text-primary-orange font-red-hat-display text-sm mb-3">
                      {coordinator.role}
                    </p>
                    <a
                      href={coordinator.linkedin}
                      className="inline-block text-primary-purple hover:text-primary-orange transition-colors duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Roles */}
          {teamRoles.map((role) => (
            <div key={role.key}>
              <Title level={3} variant="default" size="md" className={`text-center mb-8 ${role.color}`}>
                {role.title}
              </Title>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {(organizers[role.key as keyof typeof organizers] as string[]).map((member: string, index: number) => (
                  <Card
                    key={index}
                    variant="glass"
                    hover
                    className="organizer-card group"
                  >
                    <div className="p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-primary-purple/20 to-primary-orange/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl">{role.icon}</span>
                      </div>
                      <h5 className="text-sm font-red-hat-display font-bold text-white group-hover:gradient-text transition-all duration-300">
                        {member}
                      </h5>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        </div>
      </Container>
    </section>
  );
}