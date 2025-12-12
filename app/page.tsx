'use client';

import HeroSection from '@/components/HeroSection';
import AboutEventDetails from '@/components/AboutEventDetails';
import EventHighlights from '@/components/EventHighlights';
import HackathonThemes from '@/components/HackathonThemes';
import EventTimeline from '@/components/EventTimeline';
import PrizeSection from '@/components/PrizeSection';
import Sponsors from '@/components/Sponsors';
import Mentors from '@/components/Mentors';
import Organizers from '@/components/Organizers';
import Teams from '@/components/Teams';
import FAQs from '@/components/FAQs';
import FooterCurrent from '@/components/FooterCurrent';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection />
      <AboutEventDetails />
      <EventHighlights />
      <HackathonThemes />
      <EventTimeline />
      <PrizeSection />
      <Sponsors />
      <Mentors />
      <Organizers />
      <Teams />
      <FAQs />
      <FooterCurrent />
    </main>
  );
}
