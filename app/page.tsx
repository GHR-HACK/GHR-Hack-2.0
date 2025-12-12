
/*

"use client"

import dynamic from "next/dynamic"

const FireAnimation = dynamic(() => import("../components/fire-animation"), {
  loading: () => <div className="w-full h-screen bg-neutral-950" />,
  ssr: false,
})

export default function Home() {
  return <FireAnimation />
}
  */



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
import FAQs from "../components/FAQs";
import Footer from "../components/Footer";

export default function Home() {
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
      <Footer />
    </div>
  );
}
