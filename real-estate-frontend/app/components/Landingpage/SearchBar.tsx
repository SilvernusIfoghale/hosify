"use client";

import { JSX, useState } from "react";

/**
 * Search bar component.
 * Displays a single input field for freeform search with an optional property type dropdown and a search button on the right.
 * @returns {JSX.Element} The SearchBar component.
 */
const SearchBar = (): JSX.Element => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");

  /**
   * Handles search action and logs current search data.
   */
  const handleSearch = () => {};

  return (
    <div className="bg-white p-1 sm:p-2 rounded-lg shadow-md flex flex-row items-center justify-between w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl mx-auto overflow-hidden">
      <div className="flex-1 flex flex-row items-center border border-gray-300 rounded-l-lg overflow-hidden">
        <input
          type="text"
          placeholder="Search for properties (e.g., Lagos apartment ₦900,000)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-1 sm:p-2 text-sm sm:text-base text-gray-800 focus:outline-none border-0 w-full"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-1 sm:p-2 text-sm sm:text-base text-gray-800 focus:outline-none border-0 w-20 sm:w-32 appearance-none"
        >
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="studio">Studio</option>
        </select>
      </div>
      <button
        onClick={handleSearch}
        className="bg-green-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-r-lg hover:bg-green-700"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
