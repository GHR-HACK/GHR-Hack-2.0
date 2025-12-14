'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';
import Title from './ui/Title';
import Container from './ui/Container';
import { mentors } from '../lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function Mentors() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.from('.mentors-title', {
        scrollTrigger: {
          trigger: '.mentors-title',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Animate mentor cards with stagger
      gsap.from('.mentor-card', {
        scrollTrigger: {
          trigger: '.mentors-grid',
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

  const renderMentorCard = (mentor: any, index: number, cardClass: string = '') => (
    <Card
      key={index}
      variant="elevated"
      hover
      className={`mentor-card group ${cardClass}`}
    >
      <div className="p-6 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-primary-orange to-primary-purple rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <span className="text-2xl font-red-hat-display font-bold text-white">
            {mentor.name.charAt(0)}
          </span>
        </div>
        <h4 className="text-xl font-red-hat-display font-bold text-black mb-1 group-hover:gradient-text transition-all duration-300">
          {mentor.name}
        </h4>
        <p className="text-primary-orange font-red-hat-display font-medium mb-1">
          {mentor.title}
        </p>
        <p className="text-black/60 font-red-hat-display text-sm group-hover:text-black/80 transition-colors duration-300">
          {mentor.role}
        </p>
        {mentor.phone && (
          <p className="text-primary-purple font-red-hat-display text-sm mt-2">
            📞 {mentor.phone}
          </p>
        )}
      </div>
    </Card>
  );

  return (
    <section
      id="mentors"
      ref={sectionRef}
      className="py-20 md:py-32 bg-white"
    >
      <Container>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <Title level={2} variant="gradient" size="xl" className="mentors-title mb-8">
            Meet Our Mentors
          </Title>
          <p className="text-lg text-black/60 font-red-hat-display max-w-2xl mx-auto group-hover:text-black/80 transition-colors duration-300">
            Guided by visionary leaders and distinguished faculty who inspire innovation and excellence.
          </p>
        </div>

        <div className="mentors-grid space-y-16">
          {/* Chief Patron */}
          <div className="text-center">
            <Title level={3} variant="default" size="lg" className="mb-8 text-yellow-400">
              Chief Patron
            </Title>
            <div className="flex justify-center">
              {renderMentorCard(mentors.chiefPatron, 0, 'max-w-sm mx-auto')}
            </div>
          </div>

          {/* Executive Director */}
          <div className="text-center">
            <Title level={3} variant="default" size="lg" className="mb-8 text-yellow-400">
              Executive Director
            </Title>
            <div className="flex justify-center">
              {renderMentorCard(mentors.executiveDirector, 0, 'max-w-sm mx-auto')}
            </div>
          </div>

          {/* Patron */}
          <div className="text-center">
            <Title level={3} variant="default" size="lg" className="mb-8 text-blue-400">
              Patron
            </Title>
            <div className="flex justify-center">
              {renderMentorCard(mentors.patron, 0, 'max-w-sm mx-auto')}
            </div>
          </div>

          {/* Dean */}
          <div className="text-center">
            <Title level={3} variant="default" size="lg" className="mb-8 text-blue-400">
              Dean Academics
            </Title>
            <div className="flex justify-center">
              {renderMentorCard(mentors.dean, 0, 'max-w-sm mx-auto')}
            </div>
          </div>

          {/* Convener */}
          <div>
            <Title level={3} variant="default" size="lg" className="text-center mb-8 text-green-400">
              Convener
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {mentors.convener.map((convener, index) => renderMentorCard(convener, index))}
            </div>
          </div>

          {/* Faculty Coordinator */}
          <div className="text-center">
            <Title level={3} variant="default" size="lg" className="mb-8 text-purple-400">
              Faculty Coordinator
            </Title>
            <div className="flex justify-center">
              {renderMentorCard(mentors.facultyCoordinator, 0, 'max-w-sm mx-auto')}
            </div>
          </div>

          {/* Coordinators */}
          <div>
            <Title level={3} variant="default" size="lg" className="text-center mb-8 text-orange-400">
              Event Coordinators
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentors.coordinators.map((coordinator, index) => renderMentorCard(coordinator, index))}
            </div>
          </div>
        </div>
        </div>
      </Container>
    </section>
  );
}