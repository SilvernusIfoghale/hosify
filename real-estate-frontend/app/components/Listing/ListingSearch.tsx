"use client";

import { JSX, useEffect, useState } from "react";
import { usePropertyStore } from "../../store/property-store";
import { useSearch } from "../../store/search-context";
import { useSearchParams } from "next/navigation";

/**
 * Search component for the listing page.
 * Features a search bar with city dropdown and an advanced options sliding panel.
 * @returns {JSX.Element} The ListingSearch component.
 */
const ListingSearch = (): JSX.Element => {
  const { verifiedProperties, fetchVerifiedProperties } = usePropertyStore();
  const { filters, updateFilters, resetFilters } = useSearch();
  const searchParams = useSearchParams();
  const [cities, setCities] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [listingTypes, setListingTypes] = useState<string[]>([]);

  // Initialize filters from URL parameters on component mount
  useEffect(() => {
    const title = searchParams.get("title");
    const propertyType = searchParams.get("propertyType");

    if (title) {
      updateFilters({ title });
    }
    if (propertyType) {
      updateFilters({ propertyType });
    }
  }, [searchParams, updateFilters]);

  // Fetch properties on mount
  useEffect(() => {
    fetchVerifiedProperties();
  }, [fetchVerifiedProperties]);

  // Extract unique filter options from properties
  useEffect(() => {
    if (verifiedProperties.length > 0) {
      // Get unique cities (case-insensitive)
      const cityMap = new Map<string, string>();
      verifiedProperties.forEach((p) => {
        const city = p.location?.city?.trim();
        if (city) {
          cityMap.set(city.toLowerCase(), city);
        }
      });
      setCities(Array.from(cityMap.values()).sort());

      // Get unique property types (case-insensitive)
      const typeMap = new Map<string, string>();
      verifiedProperties.forEach((p) => {
        const type = p.propertyType?.trim();
        if (type) {
          typeMap.set(type.toLowerCase(), type);
        }
      });
      setPropertyTypes(Array.from(typeMap.values()).sort());

      // Get unique listing types (case-insensitive)
      const listingMap = new Map<string, string>();
      verifiedProperties.forEach((p) => {
        const listing = p.listingType?.trim();
        if (listing) {
          listingMap.set(listing.toLowerCase(), listing);
        }
      });
      setListingTypes(Array.from(listingMap.values()).sort());
    }
  }, [verifiedProperties]);

  const handleReset = () => {
    resetFilters();
  };

  return (
    <div className="bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search properties..."
          value={filters.title}
          onChange={(e) => updateFilters({ title: e.target.value })}
          className="flex-1 p-2 sm:p-3 border rounded-lg text-gray-800 focus:outline-none"
        />
        <select
          value={filters.city}
          onChange={(e) => updateFilters({ city: e.target.value })}
          className="p-2 sm:p-3 border rounded-lg text-gray-800 w-32 sm:w-40"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Advanced options sliding panel */}
      <div className="max-w-6xl mx-auto overflow-hidden transition-all duration-300 ease-in-out">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price (₦)
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => updateFilters({ minPrice: e.target.value })}
                className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price (₦)
              </label>
              <input
                type="number"
                placeholder="∞"
                value={filters.maxPrice}
                onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) =>
                  updateFilters({ propertyType: e.target.value })
                }
                className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Listing Type
              </label>
              <select
                value={filters.listingType}
                onChange={(e) => updateFilters({ listingType: e.target.value })}
                className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {listingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingSearch;
