'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Check if mobile device
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
            }
          });
        },
        {
          threshold: 0.3, // Trigger when 30% of card is visible
        }
      );

      observer.observe(card);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div className="theme-card-wrapper">
      <div 
        ref={cardRef}
        className={`theme-card ${isVisible ? 'card-visible' : ''}`}
        onClick={onClickHere}
      >
        {/* Content */}
        <div className="card-content">
          {/* Center Icon */}
          <div className="center-icon">
            {image ? (
              <img
                src={image}
                alt={title}
                style={{ width: '80px', height: '80px', objectFit: 'contain' }}
              />
            ) : (
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#666' }}>
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            )}
          </div>

          <h3 className="card-title">{title}</h3>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .theme-card-wrapper {
          position: relative;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
        }

        .theme-card {
          display: block;
          position: relative;
          width: 100%;
          background-color: #ffffff;
          border-radius: 16px;
          padding: 32px 24px;
          text-decoration: none;
          z-index: 0;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          aspect-ratio: 5/4;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 16px 32px -8px rgba(0, 0, 0, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.1);
        }

        .theme-card:hover {
          transform: scale(1.02);
          box-shadow: 0 35px 70px -12px rgba(0, 0, 0, 0.35), 0 24px 48px -8px rgba(0, 0, 0, 0.25), 0 12px 24px -4px rgba(0, 0, 0, 0.15);
        }

        .theme-card:before {
          content: "";
          position: absolute;
          z-index: 0;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: #9609a6;
          clip-path: polygon(0% 100%, 0% 75%, 10% 72%, 20% 70%, 30% 68%, 40% 65%, 50% 62%, 60% 58%, 70% 55%, 80% 52%, 90% 48%, 100% 45%, 100% 100%);
          opacity: 0.15;
          transition: all 0.9s ease-out;
        }

        .theme-card:hover:before {
          opacity: 1;
          clip-path: polygon(0% 100%, 0% 0%, 10% 0%, 20% 0%, 30% 0%, 40% 0%, 50% 0%, 60% 0%, 70% 0%, 80% 0%, 90% 0%, 100% 0%, 100% 100%);
        }

        /* Mobile scroll-based animation */
        @media (max-width: 768px) {
          .theme-card.card-visible:before {
            opacity: 1;
            clip-path: polygon(0% 100%, 0% 0%, 10% 0%, 20% 0%, 30% 0%, 40% 0%, 50% 0%, 60% 0%, 70% 0%, 80% 0%, 90% 0%, 100% 0%, 100% 100%);
          }

          .theme-card.card-visible h3 {
            color: #fff;
          }

          .theme-card.card-visible {
            transform: scale(1.02);
            box-shadow: 0 35px 70px -12px rgba(0, 0, 0, 0.35), 0 24px 48px -8px rgba(0, 0, 0, 0.25), 0 12px 24px -4px rgba(0, 0, 0, 0.15);
          }

          .theme-card.card-visible .center-icon {
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.15);
            transform: scale(1.08);
            border-color: rgba(0, 0, 0, 0.12);
          }
        }

        .theme-card:hover p {
          transition: all 0.9s ease-out;
          color: rgba(255, 255, 255, 0.8);
        }

        .theme-card:hover h3 {
          transition: all 0.9s ease-out;
          color: #fff;
        }

        .card-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 20px;
        }

        .center-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.9s ease-out;
          border: 2px solid rgba(0, 0, 0, 0.08);
        }

        .theme-card:hover .center-icon {
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.15);
          transform: scale(1.08);
          border-color: rgba(0, 0, 0, 0.12);
        }

        .card-title {
          font-size: 20px;
          font-weight: 600;
          line-height: 24px;
          color: #333;
          margin: 0;
          text-align: center;
          transition: color 0.9s ease-out;
        }

      `}</style>
    </div>
  );
}
