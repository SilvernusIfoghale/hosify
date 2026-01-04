/**
 * Featured Properties Section
 * Displays dummy property cards (later: fetch real data)
 */

"use client";

import { useEffect } from "react";
import { usePropertyStore } from "../../store/property-store";
import Link from "next/link";
import Image from "next/image";

/**
 * Featured Properties Section
 * Displays properties fetched from the backend
 */

const FeaturedProperties = () => {
  const { verifiedProperties, fetchVerifiedProperties, loading, error } =
    usePropertyStore();

  useEffect(() => {
    // Fetch approved listings (verified properties)
    fetchVerifiedProperties();
  }, [fetchVerifiedProperties]);

  // Display all approved listings
  const approvedListings = verifiedProperties;

  if (loading && verifiedProperties.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Properties
        </h2>

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">
              Error loading properties: {error}
            </p>
          </div>
        )}

        {verifiedProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              Featured properties will appear here soon.
            </p>
            {/* <Link
              href="/listing"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse All Properties
            </Link> */}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {approvedListings.map((property) => (
              <Link
                href={`/properties/${property._id}`}
                key={property._id}
                className="bg-white shadow rounded overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg block"
              >
                <div className="relative h-48">
                  <Image
                    src={property.media?.images?.[0]?.url || "/apartment2.jfif"}
                    alt={property.title}
                    fill
                    className="object-cover transition duration-300 hover:brightness-75"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold truncate">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 truncate">
                    {property.location?.city}, {property.location?.state}
                  </p>
                  <p className="text-green-600 font-bold mt-2">
                    {property.currency} {property.price.toLocaleString()}
                    {property.listingType === "rent" ? "/mo" : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {verifiedProperties.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/listing"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors"
            >
              View All Properties
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
