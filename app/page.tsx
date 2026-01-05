"use client"

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
import TeamMembers from "../components/TeamMembers";

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
      <TeamMembers/>
      <Contact />
      <FAQs />
      <RaisoniAboutUs />
      <MapEmbed />
      <Footer />
    </div>
  );
}