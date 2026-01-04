"use client";
import React, { useEffect, useState } from "react";
import { adminAPI, type Property } from "@/app/api/admin-client";
import { showToast } from "@/app/utils/toast";

const Page: React.FC = () => {
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await adminAPI.getAllListings();
      if (response.success) {
        setListings(response.properties || []);
      } else {
        showToast.error("Failed to fetch listings");
      }
    } catch {
      showToast.error("Error fetching listings");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveListing = async (listingId: string) => {
    setActionLoading(listingId);
    try {
      const response = await adminAPI.approveListing(listingId);
      if (response.success) {
        showToast.success("Listing approved successfully");
        await fetchListings();
      } else {
        showToast.error("Failed to approve listing");
      }
    } catch {
      showToast.error("Error approving listing");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectListing = async (listingId: string) => {
    setActionLoading(listingId);
    try {
      const response = await adminAPI.rejectListing(listingId);
      if (response.success) {
        showToast.success("Listing rejected successfully");
        await fetchListings();
      } else {
        showToast.error("Failed to reject listing");
      }
    } catch {
      showToast.error("Error rejecting listing");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading listings...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">All Listings</h1>
      <div className="grid gap-4">
        {listings.length === 0 ? (
          <div className="text-center text-gray-500">No listings found</div>
        ) : (
          listings.map((l) => {
            try {
              return (
                <div
                  key={l._id}
                  className="bg-white p-4 md:p-6 rounded shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                        <h3 className="text-lg md:text-xl font-bold">
                          {l.title}
                        </h3>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium self-start ${
                            l.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : l.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {l.status}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 text-sm md:text-base">
                        {l.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="font-medium">Price:</span>{" "}
                          {l.currency} {l.price?.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span>{" "}
                          {l.propertyType} ({l.listingType})
                        </div>
                        <div>
                          <span className="font-medium">Condition:</span>{" "}
                          {l.condition}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span>{" "}
                          {[
                            l.location?.address,
                            l.location?.city,
                            l.location?.state,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Landlord:</span>{" "}
                          {l.userId?.name} ({l.userId?.email})
                        </div>
                        <div>
                          <span className="font-medium">Listed:</span>{" "}
                          {l.createdAt
                            ? new Date(l.createdAt).toLocaleDateString()
                            : "Unknown"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="font-bold text-lg">
                            {l.features?.bedrooms || 0}
                          </div>
                          <div className="text-sm text-gray-600">Bedrooms</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">
                            {l.features?.bathrooms || 0}
                          </div>
                          <div className="text-sm text-gray-600">Bathrooms</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">
                            {l.features?.parkingSpaces || 0}
                          </div>
                          <div className="text-sm text-gray-600">Parking</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">
                            {l.features?.size || 0} sqm
                          </div>
                          <div className="text-sm text-gray-600">Size</div>
                        </div>
                      </div>

                      {l.media?.images &&
                        Array.isArray(l.media.images) &&
                        l.media.images.length > 0 && (
                          <div className="mb-4">
                            <span className="font-medium">
                              Images ({l.media.images.length}):
                            </span>
                            <div className="flex gap-2 mt-2 overflow-x-auto">
                              {l.media.images
                                .slice(0, 5)
                                .map(
                                  (
                                    img: { url: string; public_id: string },
                                    index: number
                                  ) => (
                                    <img
                                      key={index}
                                      src={img.url}
                                      alt={`Property image ${index + 1}`}
                                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded border flex-shrink-0"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  )
                                )}
                              {l.media.images.length > 5 && (
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded border flex items-center justify-center text-xs md:text-sm text-gray-600 flex-shrink-0">
                                  +{l.media.images.length - 5}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                      {l.media?.videos &&
                        Array.isArray(l.media.videos) &&
                        l.media.videos.length > 0 && (
                          <div className="mb-4">
                            <span className="font-medium">
                              Videos ({l.media.videos.length}):
                            </span>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {l.media.videos.map(
                                (
                                  video: { url: string; public_id: string },
                                  index: number
                                ) => (
                                  <a
                                    key={index}
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                                  >
                                    Video {index + 1}
                                  </a>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Views:</span>{" "}
                        {l.metadata?.views || 0} |
                        <span className="font-medium ml-2">Verified:</span>{" "}
                        {l.metadata?.isVerified ? "Yes" : "No"}
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end space-y-2 md:ml-4">
                      {/* Debug: Show current status */}
                      <div className="text-xs text-gray-400 mb-2">
                        Status: {l.status || "undefined"}
                      </div>

                      {l.status !== "approved" && l.status !== "rejected" && (
                        <div className="flex gap-2 w-full md:w-auto">
                          <button
                            onClick={() => handleApproveListing(l._id)}
                            disabled={actionLoading === l._id}
                            className="flex-1 md:flex-none px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 font-medium"
                          >
                            {actionLoading === l._id
                              ? "Approving..."
                              : "Approve"}
                          </button>
                          <button
                            onClick={() => handleRejectListing(l._id)}
                            disabled={actionLoading === l._id}
                            className="flex-1 md:flex-none px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 font-medium"
                          >
                            {actionLoading === l._id
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            } catch (error) {
              console.error("Error rendering listing:", l._id, error);
              return (
                <div
                  key={l._id}
                  className="bg-red-50 p-6 rounded shadow-lg border border-red-200"
                >
                  <div className="text-red-600 font-medium">
                    Error loading listing
                  </div>
                  <div className="text-sm text-red-500 mt-1">ID: {l._id}</div>
                </div>
              );
            }
          })
        )}
      </div>
    </div>
  );
};

export default Page;
