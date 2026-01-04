"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { usePropertyStore } from "@/app/store/property-store";
import { type Property } from "@/app/api/landlord-client";
import Image from "next/image";

interface MyPropertiesProps {
  landlordId: string;
}

export function MyProperties({ landlordId }: MyPropertiesProps) {
  const { myProperties, loading, fetchMyProperties, deleteProperty } =
    usePropertyStore();

  useEffect(() => {
    fetchMyProperties(landlordId);
  }, [landlordId, fetchMyProperties]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading properties...</div>;
  }

  if (!myProperties.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No properties listed yet</p>
        <Link href="/landlord/upload">
          <Button>Upload Your First Property</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">
        My Properties ({myProperties.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myProperties.map((property) => (
          <Card key={property._id} className="overflow-hidden">
            <div className="aspect-video bg-gray-200 relative">
              {property.media?.images?.[0]?.url && (
                <Image
                  src={property.media.images[0].url || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              )}
              {property.metadata?.isVerified && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  Verified
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{property.title}</h3>

              <div className="flex justify-between items-center mb-3 text-sm text-gray-600">
                <span>{property.location?.city}</span>
                <span className="text-lg font-bold text-blue-600">
                  {property.currency} {property.price.toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2 text-sm text-gray-600 mb-3">
                <span>📍 {property.listingType}</span>
                <span>🏠 {property.propertyType}</span>
                <span>📊 {property.metadata?.status}</span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/landlord/properties/${property._id}/edit`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full bg-transparent">
                    Edit
                  </Button>
                </Link>
                <Button
                  onClick={() => handleDelete(property._id!)}
                  variant="destructive"
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
