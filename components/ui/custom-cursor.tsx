'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const SEGMENTS = 20; // Increased for longer snake
const BASE_SIZE = 16;
const COLOR_START = '#e9552b'; // orange
const COLOR_END = '#680b7d';   // purple
const HEAD_SIZE = 22;
const SPARKS = 8;

export default function SnakeCursor() {
  const [shouldRender, setShouldRender] = useState(false);
  const segmentsRef = useRef<HTMLDivElement[]>([]);
  const sparkRefs = useRef<HTMLDivElement[]>([]);
  const positionsRef = useRef<Array<{x: number, y: number, rotation: number}>>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    // Check if mobile/tablet and set render state
    const checkDevice = () => {
      const isMobileOrTablet =
        window.matchMedia('(pointer: coarse)').matches ||
        window.innerWidth <= 1024 ||
        /Mobi|Android/i.test(navigator.userAgent);
      setShouldRender(!isMobileOrTablet);
    };

    checkDevice();

    // Hide on mobile and tablet
    const isMobileOrTablet = () => {
      return window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 1024;
    };

    if (isMobileOrTablet()) {
      return;
    }

    // Initialize positions
    positionsRef.current = Array.from({ length: SEGMENTS }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      rotation: 0,
    }));

    mouseRef.current = { 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2 
    };
    lastMouseRef.current = { ...mouseRef.current };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Lerp function
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      // Calculate mouse velocity for snake-like movement
      const velX = mouseRef.current.x - lastMouseRef.current.x;
      const velY = mouseRef.current.y - lastMouseRef.current.y;
      const speed = Math.sqrt(velX * velX + velY * velY);
      
      // Update head with snake-like movement
      const headLerp = 0.25 + Math.min(speed * 0.008, 0.15);
      positionsRef.current[0].x = lerp(
        positionsRef.current[0].x, 
        mouseRef.current.x, 
        headLerp
      );
      positionsRef.current[0].y = lerp(
        positionsRef.current[0].y, 
        mouseRef.current.y, 
        headLerp
      );
      
      // Calculate head rotation based on movement direction
      if (speed > 0.5) {
        positionsRef.current[0].rotation = Math.atan2(velY, velX) * (180 / Math.PI);
      }

      // Update body segments with diminishing lerp for snake effect
      for (let i = 1; i < SEGMENTS; i++) {
        const lerpAmount = 0.35 * (1 - i / (SEGMENTS * 2));
        
        positionsRef.current[i].x = lerp(
          positionsRef.current[i].x,
          positionsRef.current[i - 1].x,
          lerpAmount
        );
        positionsRef.current[i].y = lerp(
          positionsRef.current[i].y,
          positionsRef.current[i - 1].y,
          lerpAmount
        );
        
        // Calculate rotation for each segment based on direction to previous segment
        const dx = positionsRef.current[i - 1].x - positionsRef.current[i].x;
        const dy = positionsRef.current[i - 1].y - positionsRef.current[i].y;
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
          positionsRef.current[i].rotation = Math.atan2(dy, dx) * (180 / Math.PI);
        }
      }

      // Update segment visuals
      positionsRef.current.forEach((pos, i) => {
        const segment = segmentsRef.current[i];
        if (segment) {
          // Skip head segment (index 0) - use real mouse cursor instead
          if (i === 0) {
            gsap.set(segment, {
              opacity: 0, // Hide the custom head, use real cursor
            });
            return;
          }

          // Snake-like sizing - gradually smaller body
          const sizeProgress = (i - 1) / (SEGMENTS - 1); // Adjust for skipping head
          const size = BASE_SIZE * (1 - sizeProgress * 0.7);
          const opacity = 0.2 + (1 - sizeProgress) * 0.8;

          // Calculate color based on position in snake
          // Simple transition from orange to purple
          const colorProgress = (i - 1) / (SEGMENTS - 1); // Adjust for skipping head
          const segmentColor = colorProgress < 0.5 ? COLOR_START : COLOR_END;

          gsap.set(segment, {
            x: pos.x - size / 2,
            y: pos.y - size / 2,
            rotation: pos.rotation,
            width: size,
            height: size * 0.7, // Oval shape for snake body
            opacity: opacity,
            backgroundColor: segmentColor,
            backgroundImage: 'none',
          });

          // Add scale pattern to body segments (skip first segment)
          if (i > 1 && i < SEGMENTS - 2) {
            segment.style.backgroundImage = 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 2px, transparent 3px)';
            segment.style.backgroundSize = '8px 8px';
          }
        }
      });

      // No head (hidden per request)

      // Spark effects when moving quickly
      if (speed > 8 && Math.random() < 0.25) {
        const randomIndex = Math.floor(Math.random() * SPARKS);
        const spark = sparkRefs.current[randomIndex];
        if (spark) {
          const angle = Math.random() * Math.PI * 2;
          const distance = 15 + Math.random() * 20;
          const offsetX = Math.cos(angle) * distance;
          const offsetY = Math.sin(angle) * distance;
          const sparkColor = Math.random() > 0.5 ? COLOR_START : COLOR_END;

          gsap.killTweensOf(spark);
          
          gsap.set(spark, {
            x: positionsRef.current[0].x + offsetX,
            y: positionsRef.current[0].y + offsetY,
            opacity: 1,
            scale: 1,
            background: `radial-gradient(circle, ${sparkColor}, transparent 70%)`,
          });
          
          gsap.to(spark, {
            opacity: 0,
            scale: 0,
            duration: 0.6,
            ease: "power2.out",
          });
        }
      }

      lastMouseRef.current = { 
        x: positionsRef.current[0].x, 
        y: positionsRef.current[0].y 
      };

      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationIdRef.current = requestAnimationFrame(animate);

    // Keep default cursor visible (it's the snake head now)
    const originalCursor = document.body.style.cursor;
    // document.body.style.cursor = 'none'; // Commented out to keep real cursor

    // Hover effects removed (no head)
    const handleElementMouseEnter = () => {};
    const handleElementMouseLeave = () => {};

    // Add hover listeners
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleElementMouseEnter);
      el.addEventListener('mouseleave', handleElementMouseLeave);
    });

    // Initial reveal animation
    gsap.from(segmentsRef.current, {
      scale: 0,
      opacity: 0,
      duration: 1,
      stagger: 0.03,
      ease: "elastic.out(1, 0.5)",
    });

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = originalCursor;
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleElementMouseEnter);
        el.removeEventListener('mouseleave', handleElementMouseLeave);
      });
      
      gsap.killTweensOf([...segmentsRef.current, ...sparkRefs.current]);
    };
  }, []);

  // Don't render on mobile/tablet
  // Temporarily always render for debugging
  // if (!shouldRender) {
  //   return null;
  // }

  return (
    <>
      {/* Snake Body Segments */}
      {Array.from({ length: SEGMENTS }).map((_, index) => (
        <div
          key={`segment-${index}`}
          ref={(el) => {
            if (el) segmentsRef.current[index] = el;
          }}
          className="absolute pointer-events-none z-[9998]"
          style={{
            borderRadius: '40%', // Oval shape for snake body
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: `
              0 2px 8px rgba(0, 0, 0, 0.2),
              inset 0 1px 2px rgba(255, 255, 255, 0.1)
            `,
            opacity: 0,
            // Solid colors - orange for first half, purple for second half
            backgroundColor: index < SEGMENTS / 2 ? COLOR_START : COLOR_END,
          }}
        />
      ))}

      {/* Magic Sparks */}
      {Array.from({ length: SPARKS }).map((_, index) => (
        <div
          key={`spark-${index}`}
          ref={(el) => {
            if (el) sparkRefs.current[index] = el;
          }}
          className="fixed pointer-events-none z-[9997] rounded-full"
          style={{
            width: 10,
            height: 10,
            filter: 'blur(2px)',
            opacity: 0,
          }}
        />
      ))}

      {/* Global styles */}
      <style jsx global>{`
        /* Ensure default cursor shows everywhere, especially on text */
        * {
          cursor: default !important;
        }

        /* Make sure text elements show default cursor */
        p, h1, h2, h3, h4, h5, h6, span, div, a, button {
          cursor: default !important;
        }

        /* Keep auto cursor on mobile/tablet */
        @media (max-width: 1024px), (pointer: coarse) {
          * {
            cursor: auto !important;
          }
        }
        
        /* Hardware acceleration */
        .fixed {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
          will-change: transform, opacity;
        }
        
        /* Snake-like wavy animation for body segments */
        @keyframes snakeWave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.9); }
        }
        
        /* Pulsing animation for head */
        @keyframes snakePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </>
  );
}