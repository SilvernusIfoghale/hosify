"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  getTenantFavorites,
  removeTenantFavorite,
} from "@/app/api/tenant-client";
import { useAuthStore } from "@/app/store/authStore";
import toast from "react-hot-toast";
import type { Property } from "@/app/api/landlord-client";

export function SavedPropertiesList() {
  const { user } = useAuthStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageIndices, setImageIndices] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    const fetchSavedProperties = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await getTenantFavorites();
        if (response.success && response.favourites) {
          setProperties(response.favourites);
        }
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        toast.error("Failed to load saved properties");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, [user?.id]);

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

  const handleRemoveFavorite = async (
    e: React.MouseEvent,
    propertyId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await removeTenantFavorite(propertyId);
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      toast.success("Removed from saved properties");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove from saved properties");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Saved Properties Yet
        </h3>
        <p className="text-gray-600 mb-6">
          Start saving your favorite properties to view them here later.
        </p>
        <Link
          href="/listing"
          className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Browse Properties
        </Link>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Saved Properties
        </h2>
        <p className="text-gray-600">
          You have <span className="font-semibold">{properties.length}</span>{" "}
          saved {properties.length === 1 ? "property" : "properties"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
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

                {/* Remove favorite button */}
                <button
                  onClick={(e) => handleRemoveFavorite(e, property._id!)}
                  className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                  title="Remove from saved"
                >
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
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
                <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                  <MapPin className="h-4 w-4" />
                  <p className="truncate">
                    {property.location?.city}, {property.location?.state}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <p className="text-green-600 font-bold">
                      {property.price.toLocaleString()}
                      {property.listingType === "rent" ? "/mo" : ""}
                    </p>
                  </div>
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
  );
}
