"use client";

import { JSX } from "react";

/**
 * Hero section for the listing page.
 * Features a parallax background image with fixed text overlay, where the image remains stationary while content scrolls.
 * @returns {JSX.Element} The ListingHero component.
 */
const ListingHero = (): JSX.Element => {
  return (
    <section className="relative h-[60vh] sm:h-[70vh] bg-fixed bg-cover bg-center">
      {/* Parallax background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          zIndex: -1, // Ensure image stays behind content
        }}
      ></div>
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      {/* Fixed text content */}
      <div className="relative z-10 flex items-center justify-center h-full text-white text-center">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg">
            Explore Property Listings
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl drop-shadow-md">
            Find your dream home across Nigeria.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ListingHero;