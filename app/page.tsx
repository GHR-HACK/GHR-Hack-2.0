import NavigationBar from "../components/NavigationBar";
import HeroSection from "../components/HeroSection";
import AboutEventDetails from "../components/AboutEventDetails";
import ProblemStatementDomains from "../components/ProblemStatementDomains";
import Sponsors from "../components/Sponsors";
import Mentors from "../components/Mentors";
import Organizers from "../components/Organizers";
import Teams from "../components/Teams";
import FAQs from "../components/FAQs";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <NavigationBar />
      <HeroSection />
      <AboutEventDetails />
      <ProblemStatementDomains />
      <Sponsors />
      <Mentors />
      <Organizers />
      <Teams />
      <FAQs />
      <Footer />
    </div>
  );
}