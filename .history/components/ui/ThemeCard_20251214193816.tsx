'use client';

import { useEffect, useRef } from 'react';
import Button from './Button';

interface TenderNoticeCardProps {
  title?: string;
  date?: string;
  image?: string;
  onClickHere?: () => void;
}

export function ThemeCard({
  title = 'Divya Marathi Tender Notice',
  date = '28/08/25',
  image,
  onClickHere = () => console.log('Click Here clicked'),
}: TenderNoticeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) * 0.05;
      const rotateY = (centerX - x) * 0.05;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[480px] mx-auto">
      {/* Icon Badge */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bg-[#ff6b35] rounded-[20px] p-5 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-10 w-10 object-contain filter brightness-0 invert"
            />
          ) : (
            <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div
        ref={cardRef}
        className="relative bg-white rounded-[24px] shadow-2xl hover:shadow-2xl hover:shadow-black/40 overflow-hidden pt-16 pb-10 px-10 transition-all duration-500 ease-in-out cursor-pointer group"
      >
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <h2 className="text-black text-center text-xl font-normal leading-tight group-hover:text-black/80 transition-colors duration-300">{title}</h2>
        </div>

        {/* Decorative Curve */}
        <div className="absolute bottom-0 right-0 w-full h-[200px] pointer-events-none">
          <svg
            width="100%"
            height="200"
            viewBox="0 0 480 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 right-0 group-hover:opacity-90 transition-opacity duration-300"
            preserveAspectRatio="none"
          >
            <path d="M285.5 200C325.5 186.667 371 182.167 411 155.5C448 127 463.5 95.5 480 20.5V200H285.5Z" fill="#5C0F8B" />
          </svg>
        </div>
      </div>
    </div>
  );
}
