'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Title from './ui/Title';
import Container from './ui/Container';

// Team member images data
const teamMemberImages = [
  { id: 1, alt: 'Team Member 1' },
  { id: 2, alt: 'Team Member 2' },
  { id: 3, alt: 'Team Member 3' },
  { id: 4, alt: 'Team Member 4' },
  { id: 5, alt: 'Team Member 5' },
  { id: 6, alt: 'Team Member 6' },
  { id: 7, alt: 'Team Member 7' },
  { id: 8, alt: 'Team Member 8' },
  { id: 9, alt: 'Team Member 9' },
  { id: 10, alt: 'Team Member 10' },
  { id: 11, alt: 'Team Member 11' },
  { id: 12, alt: 'Team Member 12' },
];

// Color gradients
const colorGradients = [
  'from-purple-500 to-pink-600',
  'from-blue-500 to-cyan-600',
  'from-green-500 to-emerald-600',
  'from-yellow-500 to-orange-600',
  'from-red-500 to-pink-600',
  'from-indigo-500 to-purple-600',
];

export default function TeamMembers() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize GSAP carousel
  useEffect(() => {
    if (!isReady) return;

    const setupCarousel = () => {
      const container = carouselRef.current;
      if (!container) return null;

      const items = container.querySelectorAll('.team-image-item');
      if (items.length === 0) return null;

      // Clear any existing clones
      const existingClones = container.querySelectorAll('.clone');
      existingClones.forEach(clone => clone.remove());

      // Create clone items for seamless loop
      const itemsArray = Array.from(items);
      itemsArray.forEach(item => {
        const clone = item.cloneNode(true) as HTMLElement;
        clone.classList.add('clone');
        container.appendChild(clone);
      });

      // Get item width with fallback
      const firstItem = items[0] as HTMLElement;
      const itemWidth = firstItem.offsetWidth || 140; // Fallback to 140px
      const gap = 20;
      const totalItems = itemsArray.length;
      const totalWidth = (itemWidth + gap) * totalItems * 2;

      // Setup animation
      const animation = gsap.to(container, {
        x: `-=${totalWidth / 2}`,
        duration: 30,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x: string) => {
            const parsed = parseFloat(x);
            const mod = parsed % (totalWidth / 2);
            return mod < 0 ? mod + (totalWidth / 2) : mod;
          })
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

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const cleanup = setupCarousel();
      return () => {
        cleanup && cleanup();
        clearTimeout(timeoutId);
      };
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isReady]);

  // Set ready state after component mounts
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Render team image item
  const renderTeamImage = (image: typeof teamMemberImages[0], index: number) => {
    const gradient = colorGradients[index % colorGradients.length];
    
    return (
      <div
        key={image.id}
        className="team-image-item flex-shrink-0 mx-2"
      >
        <div className="relative group">
          {/* Circle image */}
          <div 
            className={`w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br ${gradient} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
            style={{ minWidth: '112px' }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {image.id}
              </span>
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
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <Title level={2} variant="gradient" size="xl" className="mb-3">
              Our Team Gallery
            </Title>
            <p className="text-gray-600 font-red-hat-display">
              Faces behind the success
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Gradient edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            {/* Carousel */}
            <div className="relative overflow-hidden py-8">
              <div 
                ref={carouselRef}
                className="flex items-center"
                style={{ width: 'max-content' }}
              >
                {teamMemberImages.map((image, index) => renderTeamImage(image, index))}
              </div>
            </div>

            {/* Manual controls for testing */}
            <div className="flex justify-center gap-4 mt-6">
              <button 
                onClick={() => {
                  const container = carouselRef.current;
                  if (container) {
                    gsap.to(container, {
                      x: `-=${200}`,
                      duration: 0.5,
                      ease: "power2.out"
                    });
                  }
                }}
                className="px-4 py-2 bg-primary-purple text-white rounded-lg text-sm"
              >
                Test Move
              </button>
              <button 
                onClick={() => setIsReady(!isReady)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
              >
                {isReady ? 'Pause' : 'Start'} Animation
              </button>
            </div>

            {/* Debug info */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Carousel Status: {isReady ? 'Running' : 'Paused'} | 
              Items: {teamMemberImages.length}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}