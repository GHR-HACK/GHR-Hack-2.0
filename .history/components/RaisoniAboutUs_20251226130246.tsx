'use client';

import { useEffect, useRef, useState } from 'react';
import Container from './ui/Container';
import Title from './ui/Title';

export default function RaisoniAboutUs() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoadVideo(true);
            obs.disconnect();
          }
        });
      },
      { root: null, rootMargin: '300px', threshold: 0.1 }
    );

    obs.observe(containerRef.current);

    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (loadVideo && videoRef.current) {
      // attempt to play (muted autoplay should work)
      const v = videoRef.current;
      v.muted = true;
      v.playsInline = true;
      v.loop = true;
      v.preload = 'none';
      // play after a tiny timeout to avoid blocking
      setTimeout(() => {
        v.play().catch(() => {
          /* ignore autoplay rejection */
        });
      }, 100);
    }
  }, [loadVideo]);

  const poster = 'https://rgicdn.s3.ap-south-1.amazonaws.com/ghribmjal/images/banner/slide-1.webp';
  const videoSrc = 'https://rgicdn.s3.ap-south-1.amazonaws.com/ghribmjal/videos/video.mp4';
  const identityImg = 'https://rgicdn.s3.ap-south-1.amazonaws.com/raisoni/rgi/images/identity/white-group-identity.png';

  return (
    <section id="raisoni-about" className="py-12 md:py-16 bg-white">
     
        <div ref={containerRef} className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
            {/* Left: Lazy video background */}
            <div className="relative w-full min-h-[360px] md:min-h-[480px] lg:min-h-[560px] overflow-hidden rounded-lg bg-black flex items-center justify-center">
              {loadVideo ? (
                <video
                  ref={videoRef}
                  className="w-auto h-full max-w-full object-contain object-center"
                  poster={poster}
                  muted
                  loop
                  playsInline
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
              ) : (
                <img src={poster} alt="GHRCE" className="w-auto h-full max-w-full object-contain object-center" />
              )}

              {/* bottom identity image overlay (non-interactive) */}
              <div className="absolute bottom-4 left-4 pointer-events-none">
                <img src={identityImg} alt="GHRCE" className="h-12 opacity-90" />
              </div>
            </div>

            {/* Right: Text content */}
            <div className="text-left flex items-center">
              <Title level={2} variant="gradient" size="lg" className="mb-6">
                About Us
              </Title>
              <div className="prose prose-lg max-w-none">
                <p className="text-black text-lg leading-relaxed text-justify font-red-hat-display">
                  Raisoni Education is a group of colleges offering a wide range of programs across over 100 courses and serving more than 28,000 students. The Raisoni Group has made a strong mark in education with the motto "A Vision Beyond", and remains committed to enlightening minds and empowering ambitions.
                </p>
                <p className="text-black text-lg leading-relaxed text-justify font-red-hat-display">
                  G H Raisoni College of Engineering & Management, Jalgaon is an autonomous, NAAC-accredited 'A' grade institute affiliated to Kavayitri Bahinabai Chaudhari North Maharashtra University, Jalgaon, and approved by AICTE. The college offers flagship programs in engineering and management, backed by a strong focus on academic excellence and student development.
                </p>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
