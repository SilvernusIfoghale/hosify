import Hero from "./components/Landingpage/Hero";
import FeaturedProperties from "./components/Landingpage/FeaturedProperties";
import WhyChooseUs from "./components/Landingpage/WhyChooseUs";
import CTA from "./components/Landingpage/CTA";
import { JSX } from "react";
import Footer from "./components/shared/Footer";

/**
 * The main landing page for the Property Listing platform.
 * Renders Hero, FeaturedProperties, WhyChooseUs, and CTA sections.
 * @returns {JSX.Element} The landing page component.
 */
const HomePage = (): JSX.Element => {
  return (
    <>
      <main className="flex flex-col min-h-screen">
        <Hero />
        <FeaturedProperties />
        <WhyChooseUs />
        <CTA />
        <footer className="relative z-40">
          <Footer />
        </footer>
      </main>
    </>
  );
};

export default HomePage;
