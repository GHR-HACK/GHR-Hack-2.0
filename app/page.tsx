"use client"

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import HeroSection from "../components/HeroSection";
import AboutEventDetails from "../components/AboutEventDetails";
import EventHighlightsSection from "../components/EventHighlights";
import HackathonThemesSection from "../components/HackathonThemes";
import EventTimelineSection from "../components/EventTimeline";
import PrizeSection from "../components/PrizeSection";
import Sponsors from "../components/Sponsors";
import Mentors from "../components/Mentors";
import Organizers from "../components/Organizers";
import Contact from "../components/Teams";
import RaisoniAboutUs from "../components/RaisoniAboutUs";
import FAQs from "../components/FAQs";
import Footer from "../components/Footer";
import MapEmbed from "../components/MapEmbed";
import Button from "../components/ui/Button";
import SwipeButton from "../components/ui/SwipeButton";
import { useVideo } from "../lib/contexts/VideoContext";

gsap.registerPlugin(ScrollToPlugin);

export default function Home() {
  const { hasStarted, videoEnded, setHasStarted, setVideoEnded } = useVideo();
  const videoRef = useRef<HTMLVideoElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scrollObjRef = useRef({ value: 0 });

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  useEffect(() => {
    if (videoEnded) {
      // Handler to stop scrolling on mouse click
      const handleMouseClick = () => {
        if (tweenRef.current) {
          tweenRef.current.kill();
          tweenRef.current = null;
        }
      };

      // Add click listener
      window.addEventListener("mousedown", handleMouseClick, { once: true });

      // Add a delay to ensure the DOM is fully rendered
      const timer = setTimeout(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const distance = scrollHeight - windowHeight;

        const speedPxPerSec = 150;
        const duration = Math.max(distance / speedPxPerSec, 5);

        // Initialize scroll object with current position
        scrollObjRef.current.value = window.scrollY || 0;

        // SOLUTION: Animate a simple object property, then apply to window.scrollY
        // This avoids ScrollToPlugin's internal scroll event listeners
        tweenRef.current = gsap.to(scrollObjRef.current, {
          value: distance,
          duration: duration,
          ease: "none",
          onUpdate: () => {
            // Manually update scroll position on each frame
            window.scrollTo(0, scrollObjRef.current.value);
          },
          onComplete: () => {
            tweenRef.current = null;
          }
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("mousedown", handleMouseClick);
        if (tweenRef.current) {
          tweenRef.current.kill();
        }
      };
    }
  }, [videoEnded]);

  if (!hasStarted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black overflow-hidden">
        <SwipeButton onComplete={handleStart} />
      </div>
    );
  }

  if (!videoEnded) {
    return (
      <div className="fixed inset-0 z-50 flex h-screen w-full bg-black overflow-y-hidden">
        <video
          ref={videoRef}
          src="/ghrhack.mp4"
          className="h-full w-full object-cover"
          autoPlay
          onEnded={handleVideoEnd}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div>
      <HeroSection />
      <AboutEventDetails />
      <EventHighlightsSection />
      <HackathonThemesSection />
      <EventTimelineSection />
      <PrizeSection />
      <Sponsors />
      <Mentors />
      <Organizers />
      <Contact />
      <FAQs />
      <RaisoniAboutUs />
      <MapEmbed />
      <Footer />
    </div>
  );
}