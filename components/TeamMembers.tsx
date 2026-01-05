'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Title from './ui/Title';
import Container from './ui/Container';
import { organizers } from '@/lib/data';

// Extract leads from organizers object
const teamMembers = organizers.teamMembers;

export default function TeamMembers() {
  // Carousel refs
  const carouselRef = useRef<HTMLDivElement>(null);

  // Initialize GSAP carousel
  useEffect(() => {
    const setupCarousel = (container: HTMLDivElement | null) => {
      if (!container) return null;

      const items = container.querySelectorAll('.team-image-item');
      if (items.length === 0) return null;

      // Create clone items for seamless loop
      const itemsArray = Array.from(items);
      itemsArray.forEach(item => {
        const clone = item.cloneNode(true) as HTMLElement;
        clone.classList.add('clone');
        container.appendChild(clone);
      });

      // Get total width
      const itemWidth = (items[0] as HTMLElement).offsetWidth + 20; // 20px gap (increased)
      const totalItems = itemsArray.length;
      const totalWidth = itemWidth * totalItems * 2;

      // Setup animation - slightly faster for more items
      const animation = gsap.to(container, {
        x: -totalWidth / 2,
        duration: 45, // Adjusted speed
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x: string) => parseFloat(x) % (totalWidth / 2))
        }
      });

      // Event handlers
      const handleMouseEnter = () => animation.pause();
      const handleMouseLeave = () => animation.resume();
      
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        animation.kill();
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    };

    const carouselCleanup = setupCarousel(carouselRef.current);

    return () => {
      carouselCleanup && carouselCleanup();
    };
  }, []);

  // Render team image item with actual data
  const renderTeamImage = (member: typeof teamMembers[0], index: number) => {
    
    return (
      <div
        key={index}
        className="team-image-item flex-shrink-0"
        style={{ 
          width: '200px', // Increased from 140px to 200px
          flex: '0 0 auto'
        }}
      >
        <div className="relative group">
          {/* Circle image with actual image - 2X LARGER */}
          <div className="w-45 h-55 rounded-xl overflow-hidden bg-gradient-to-br shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary-purple/30">
            {member.image ? (
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br flex items-center justify-center`}>
                <span className="text-white text-3xl font-bold">
                  {member.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          {/* Name and role on hover - Larger text */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-black/70 backdrop-blur-md rounded-xl px-4 py-3 text-center max-w-[180px] mr-4 ">
              <span className="text-white text-sm font-semibold block">{member.name}</span>
              <span className="text-gray-200 text-xs mt-1 block">{member.role}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="team-members-images"
      className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50"
    >
      <Container>
        {/* Wider container */}
        <div className="max-w-8xl mx-auto px-4"> {/* Increased from max-w-6xl */}
          {/* Header */}
          <div className="text-center mb-10">
            <Title level={4} variant="default" size="lg" className="mb-8 !text-[#ff5100]">
              Team Members
            </Title>
          </div>

          {/* Carousel Container - Wider */}
          <div className="relative">
            {/* Wider gradient edges */}
            <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white via-white/95 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white via-white/95 to-transparent z-10 pointer-events-none" />
            
            {/* Carousel with more padding - WIDER CONTAINER */}
            <div className="relative overflow-hidden py-8 px-4">
              <div 
                ref={carouselRef}
                className="flex items-center gap-8" // Increased gap
                style={{ width: 'max-content' }}
              >
                {teamMembers.map((member, index) => renderTeamImage(member, index))}
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}