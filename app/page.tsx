import HeroSection from "../components/HeroSection";
import AboutEventDetails from "../components/AboutEventDetails";
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
      <Sponsors />
      <Mentors />
      <Organizers />
      <Contact />
      <FAQs />
      <Footer />
    </div>
  );
}