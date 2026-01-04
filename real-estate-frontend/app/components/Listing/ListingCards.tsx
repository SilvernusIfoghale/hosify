"use client";

import { JSX, useEffect, useState } from "react";
import { usePropertyStore } from "../../store/property-store";
import { useSearch } from "../../store/search-context";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import {
  addTenantFavorite,
  removeTenantFavorite,
  getTenantFavorites,
} from "@/app/api/tenant-client";
import { useAuthStore } from "@/app/store/authStore";
import { Property } from "@/app/api/landlord-client";
import toast from "react-hot-toast";

/**
 * Cards section for the listing page.
 * Displays multiple property cards with a sliding image carousel and navigation buttons.
 * @returns {JSX.Element} The ListingCards component.
 */
const ListingCards = (): JSX.Element => {
  const { verifiedProperties, fetchVerifiedProperties, loading } =
    usePropertyStore();
  const { filters } = useSearch();
  const { user } = useAuthStore();
  const [filteredProperties, setFilteredProperties] =
    useState(verifiedProperties);
  const [favoriteStates, setFavoriteStates] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    fetchVerifiedProperties();
  }, [fetchVerifiedProperties]);

  // Fetch user's favorites
  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        try {
          const response = await getTenantFavorites();
          if (response.success && response.favourites) {
            const favIds = response.favourites.map((fav: Property) => fav._id);
            // Initialize favorite states
            const states: { [key: string]: boolean } = {};
            favIds.forEach((id: string) => {
              states[id] = true;
            });
            setFavoriteStates(states);
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      };
      fetchFavorites();
    }
  }, [user]);

  // Filter properties based on search criteria
  useEffect(() => {
    let results = verifiedProperties;

    // Filter by title
    if (filters.title) {
      results = results.filter((p) =>
        p.title.toLowerCase().includes(filters.title.toLowerCase().trim())
      );
    }

    // Filter by city
    if (filters.city) {
      results = results.filter(
        (p) =>
          p.location?.city?.toLowerCase().trim() ===
          filters.city.toLowerCase().trim()
      );
    }

    // Filter by min price
    if (filters.minPrice) {
      results = results.filter((p) => p.price >= Number(filters.minPrice));
    }

    // Filter by max price
    if (filters.maxPrice) {
      results = results.filter((p) => p.price <= Number(filters.maxPrice));
    }

    // Filter by property type
    if (filters.propertyType) {
      results = results.filter(
        (p) =>
          p.propertyType?.toLowerCase().trim() ===
          filters.propertyType.toLowerCase().trim()
      );
    }

    // Filter by listing type
    if (filters.listingType) {
      results = results.filter(
        (p) =>
          p.listingType?.toLowerCase().trim() ===
          filters.listingType.toLowerCase().trim()
      );
    }

    setFilteredProperties(results);
  }, [verifiedProperties, filters]);

  // State to manage current image index for each property
  const [imageIndices, setImageIndices] = useState<{ [key: string]: number }>(
    {}
  );

  const nextImage = (e: React.MouseEvent, id: string, imagesCount: number) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndices((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % imagesCount,
    }));
  };

  const prevImage = (e: React.MouseEvent, id: string, imagesCount: number) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndices((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) - 1 + imagesCount) % imagesCount,
    }));
  };

  const toggleFavorite = async (e: React.MouseEvent, propertyId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }

    try {
      const isFavorited = favoriteStates[propertyId];

      if (isFavorited) {
        await removeTenantFavorite(propertyId);
        setFavoriteStates((prev) => ({ ...prev, [propertyId]: false }));
        toast.success("Removed from favorites");
      } else {
        await addTenantFavorite(propertyId);
        setFavoriteStates((prev) => ({ ...prev, [propertyId]: true }));
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite");
    }
  };

  if (loading && verifiedProperties.length === 0) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </section>
    );
  }

  if (filteredProperties.length === 0) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Available Properties
          </h2>
          <p className="text-gray-600">
            No properties found matching your search criteria.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Available Properties ({filteredProperties.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const images = property.media?.images || [];
            const currentIndex = imageIndices[property._id!] || 0;

            return (
              <Link
                href={`/properties/${property._id}`}
                key={property._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
              >
                {/* Sliding image carousel */}
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={images[currentIndex]?.url || "/apartment2.jfif"}
                    alt={property.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                  />
                  {/* Favorite button */}
                  <button
                    onClick={(e) => toggleFavorite(e, property._id!)}
                    className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        favoriteStates[property._id!]
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                  {/* Navigation buttons */}
                  {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                      <button
                        onClick={(e) =>
                          prevImage(e, property._id!, images.length)
                        }
                        className="bg-black/50 text-white p-1 rounded-full hover:bg-black/70 z-10"
                      >
                        &lt;
                      </button>
                      <button
                        onClick={(e) =>
                          nextImage(e, property._id!, images.length)
                        }
                        className="bg-black/50 text-white p-1 rounded-full hover:bg-black/70 z-10"
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                  {/* Image indicator */}
                  {images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {images.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            idx === currentIndex ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 text-sm truncate">
                    {property.location?.city}, {property.location?.state}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-green-600 font-bold">
                      {property.currency} {property.price.toLocaleString()}
                      {property.listingType === "rent" ? "/mo" : ""}
                    </p>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                      {property.propertyType}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ListingCards;
