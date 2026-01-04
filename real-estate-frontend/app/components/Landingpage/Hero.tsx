"use client";

import { JSX } from "react";

/**
 * Hero section of the landing page.
 * Displays a background image, headline, and subtext.
 * @returns {JSX.Element} The Hero component.
 */
const Hero = (): JSX.Element => {
  return (
    <section
      className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
          Discover Your Place to Live
        </h1>
        <p className="mt-6 text-xl md:text-2xl mb-8 drop-shadow-md">
          Find your perfect home directly from landlords. No middlemen, no
          hassle.
        </p>
      </div>
    </section>
  );
};

export default Hero;
