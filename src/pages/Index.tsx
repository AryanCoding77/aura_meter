import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Disclaimer from "@/components/Disclaimer";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden noise-overlay">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <Features />
        <Pricing />
        <Testimonials />
        <FinalCTA />
        <Disclaimer />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
