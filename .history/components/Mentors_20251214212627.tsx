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

  // Safety check
  if (!mentors) {
    return null;
  }

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
        <div className="relative w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
          {mentor?.image ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-black/10 group-hover:ring-primary-purple/30 transition-all duration-300 shadow-lg">
              <img
                src={mentor.image}
                alt={mentor.name || 'Profile'}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gradient-to-r from-primary-orange to-primary-purple rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl font-red-hat-display font-bold text-white relative z-10">
                {mentor?.name?.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>
        <h4 className="text-xl font-red-hat-display font-bold text-black mb-1 group-hover:gradient-text transition-all duration-300">
          {mentor.title || mentor.name}
        </h4>
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

  const renderProfileCard = (mentor: any, index: number) => (
    <div
      key={index}
      className="mentor-card group relative h-96 max-w-sm overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 ease-in-out hover:shadow-2xl hover:shadow-black/40 hover:scale-[1.02] hover:translate-y-[-4px]"
    >
      {mentor?.image ? (
        <>
          <img
            src={mentor.image}
            alt={mentor.name}
            className="w-full h-full object-cover rounded-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-3xl flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h4 className="text-2xl font-red-hat-display font-bold text-white mb-2">
              {mentor.name}
            </h4>
            <p className="text-lg text-primary-orange font-red-hat-display font-semibold mb-2">
              {mentor.title}
            </p>
            <p className="text-white/90 font-red-hat-display text-base leading-relaxed">
              {mentor.role}
            </p>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-b from-primary-orange/30 to-primary-purple/30 flex flex-col items-center justify-center p-8 text-center rounded-3xl">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-primary-orange to-primary-purple rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-6xl font-red-hat-display font-bold text-white">
              {mentor.name.charAt(0)}
            </span>
          </div>
          <h4 className="text-2xl font-red-hat-display font-bold text-black mb-2 group-hover:gradient-text transition-all duration-300">
            {mentor.name}
          </h4>
          <p className="text-lg text-primary-orange font-red-hat-display font-semibold mb-2">
            {mentor.title}
          </p>
          <p className="text-black/70 font-red-hat-display text-base leading-relaxed">
            {mentor.role}
          </p>
        </div>
      )}
    </div>
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
          {/* Chief Patrons */}
          {mentors?.chiefPatrons && mentors.chiefPatrons.length > 0 && (
            <div className="text-center">
              <Title level={3} variant="default" size="lg" className="mb-8 text-yellow-400">
                Chief Patron
              </Title>
              <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
                {mentors.chiefPatrons.map((patron, index) => renderMentorCard(patron, index, 'max-w-sm'))}
              </div>
            </div>
          )}

          {/* Patron */}
          {mentors?.patrons && mentors.patrons.length > 0 && (
            <div className="text-center">
              <Title level={3} variant="default" size="lg" className="mb-8 text-blue-400">
                Patron
              </Title>
              <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
                {mentors.patrons.map((patron, index) => renderMentorCard(patron, index, 'max-w-sm'))}
              </div>
            </div>
          )}

          {/* Convener */}
          {mentors?.convener && mentors.convener.length > 0 && (
            <div>
              <Title level={3} variant="default" size="lg" className="text-center mb-8 text-green-400">
                Convener
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {mentors.convener.map((convener, index) => renderMentorCard(convener, index))}
              </div>
            </div>
          )}

          {/* Faculty Coordinator */}
          {mentors?.facultyCoordinator && (
            <div className="text-center">
              <Title level={3} variant="default" size="lg" className="mb-8 text-purple-400">
                Faculty Coordinator
              </Title>
              <div className="flex justify-center">
                {renderMentorCard(mentors.facultyCoordinator, 0, 'max-w-sm mx-auto')}
              </div>
            </div>
          )}

          {/* Coordinators */}
          {mentors?.coordinators && mentors.coordinators.length > 0 && (
            <div>
              <Title level={3} variant="default" size="lg" className="text-center mb-8 text-orange-400">
                Event Coordinators
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mentors.coordinators.map((coordinator, index) => renderMentorCard(coordinator, index))}
              </div>
            </div>
          )}
        </div>
        </div>
      </Container>
    </section>
  );
}