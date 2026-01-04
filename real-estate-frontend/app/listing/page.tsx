"use client";

import { JSX } from "react";
import ListingHero from "../components/Listing/ListingHero";
import ListingSearch from "../components/Listing/ListingSearch";
import ListingCards from "../components/Listing/ListingCards";
import Footer from "../components/shared/Footer";
import { SearchProvider } from "../store/search-context";

/**
 * Main listing page component.
 * Combines Hero, Search, and Cards sections for property listings.
 * @returns {JSX.Element} The Listing page component.
 */
const ListingPage = (): JSX.Element => {
  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col">
        <ListingHero />
        <ListingSearch />
        <ListingCards />
        <footer className="relative z-40">
          <Footer />
        </footer>
      </div>
    </SearchProvider>
  );
};

export default ListingPage;
