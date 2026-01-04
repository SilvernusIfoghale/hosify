"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { usePropertyStore } from "@/app/store/property-store";
import type { PropertyFormData, PropertyLocation } from "@/app/types/property";
import { getStates, getCities } from "@/app/api/location-api";

interface UploadedMedia {
  file: File;
  preview: string;
  type: "image" | "video";
}

export function PropertyForm() {
  const { createProperty, loading, error, clearError } = usePropertyStore();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string>("");

  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<PropertyFormData>>({
    listingType: "rent",
    condition: "new",
    status: "available",
    ownership: "owner",
    currency: "NGN",
    blockNumber: "",
    location: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      coordinate: {
        lat: 0,
        lng: 0,
      },
    },
    features: {},
    contact: {
      listedBy: "owner",
    },
  });

  useEffect(() => {
    const getGeolocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setFormData((prev) => ({
              ...prev,
              location: {
                ...(prev.location ?? {}),
                coordinate: {
                  lat: latitude,
                  lng: longitude,
                },
              },
            }));
            setLocationLoading(false);
          },
          (error: GeolocationPositionError) => {
            setLocationError(
              "Unable to retrieve your location. Please enable location services."
            );
            setLocationLoading(false);
            console.error("[v0] Geolocation error:", error.message);
          }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser.");
        setLocationLoading(false);
      }
    };

    getGeolocation();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setStatesLoading(true);
        const response = await getStates("Nigeria");
        const stateNames = response.data.data.states.map(
          (state: { name: string }) => state.name
        );
        setStates(stateNames);
      } catch (err) {
        console.error("[v0] Error fetching states:", err);
        setLocationError("Failed to load states");
      } finally {
        setStatesLoading(false);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const state = formData.location?.state;
    if (state) {
      const fetchCities = async () => {
        try {
          setCitiesLoading(true);
          const response = await getCities("Nigeria", state);
          const cityNames = response?.data?.data.map((city: string) => city);
          setCities(cityNames);
        } catch (err) {
          console.error("[v0] Error fetching cities:", err);
          setCities([]);
        } finally {
          setCitiesLoading(false);
        }
      };

      fetchCities();
    }
  }, [formData.location?.state]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    const submitData = new FormData();

    // Add text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        key !== "location" &&
        key !== "features" &&
        key !== "contact"
      ) {
        submitData.append(key, String(value));
      }
    });

    if (formData.location) {
      submitData.append("location", JSON.stringify(formData.location));
    }
    if (formData.features && Object.keys(formData.features).length > 0) {
      submitData.append("features", JSON.stringify(formData.features));
    }
    if (formData.contact && Object.keys(formData.contact).length > 0) {
      submitData.append("contact", JSON.stringify(formData.contact));
    }

    // Backend expects single "image" and "video" fields
    // Send only the first image and first video
    const firstImage = uploadedMedia.find((media) => media.type === "image");
    const firstVideo = uploadedMedia.find((media) => media.type === "video");

    if (firstImage) {
      submitData.append("image", firstImage.file);
    }
    if (firstVideo) {
      submitData.append("video", firstVideo.file);
    }

    try {
      await createProperty(submitData);
      setFormData({
        listingType: "rent",
        condition: "new",
        status: "available",
        ownership: "owner",
        currency: "NGN",
        blockNumber: "",
        location: {
          address: "",
          city: "",
          state: "",
          postalCode: "",
          coordinate: {
            lat: 0,
            lng: 0,
          },
        },
        features: {
          bedrooms: undefined,
          bathrooms: undefined,
          toilets: undefined,
          parkingSpaces: undefined,
          size: undefined,
          yearBuilt: undefined,
          furnishing: "",
          amenities: "",
          extras: "",
        },
        contact: {
          listedBy: "",
          contactName: "",
          contactEmail: "",
          agency: "",
          contactNumber: "",
        },
      });
      setUploadedMedia([]);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setUploadedMedia((prev) => [
              ...prev,
              {
                file,
                preview: reader.result as string,
                type: "image",
              },
            ]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("video/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setUploadedMedia((prev) => [
              ...prev,
              {
                file,
                preview: reader.result as string,
                type: "video",
              },
            ]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeMedia = (index: number) => {
    setUploadedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Upload Property</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {locationError && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          {locationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                name="title"
                placeholder="Property title"
                value={formData.title || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <Input
                name="price"
                type="number"
                placeholder="Property price"
                value={formData.price || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Property description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Listing Type
              </label>
              <select
                name="listingType"
                value={formData.listingType || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Property Type
              </label>
              <Input
                name="propertyType"
                placeholder="e.g., Apartment, House"
                value={formData.propertyType || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Block Number (Optional)
            </label>
            <Input
              name="blockNumber"
              placeholder="e.g., A1, B2, Flat 3"
              value={formData.blockNumber || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Location</h3>

          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <Input
              placeholder="Full address"
              value={formData.location?.address ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: {
                    ...(prev.location ?? {}),
                    address: e.target.value,
                  } as PropertyLocation,
                }))
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <select
                value={formData.location?.state ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: {
                      ...(prev.location ?? {}),
                      state: e.target.value,
                      city: "",
                    } as PropertyLocation,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={statesLoading}
              >
                <option value="">
                  {statesLoading ? "Loading states..." : "Select State"}
                </option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <select
                value={formData.location?.city ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: {
                      ...(prev.location ?? {}),
                      city: e.target.value,
                    } as PropertyLocation,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={citiesLoading || !formData.location?.state}
              >
                <option value="">
                  {citiesLoading ? "Loading cities..." : "Select City"}
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Postal Code
              </label>
              <Input
                placeholder="Postal Code"
                value={formData.location?.postalCode ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: {
                      ...(prev.location ?? {}),
                      postalCode: e.target.value,
                    } as PropertyLocation,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Latitude</label>
              <Input
                type="number"
                placeholder="Latitude"
                value={formData.location?.coordinate?.lat || ""}
                disabled
                className="bg-gray-100 cursor-not-allowed"
                step="0.0001"
              />
              {locationLoading && (
                <p className="text-xs text-gray-500 mt-1">
                  Getting location...
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Longitude
              </label>
              <Input
                type="number"
                placeholder="Longitude"
                value={formData.location?.coordinate?.lng || ""}
                disabled
                className="bg-gray-100 cursor-not-allowed"
                step="0.0001"
              />
              {locationLoading && (
                <p className="text-xs text-gray-500 mt-1">
                  Getting location...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Features</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bedrooms</label>
              <Input
                type="number"
                placeholder="Number of bedrooms"
                value={formData.features?.bedrooms || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      bedrooms: Number.parseInt(e.target.value),
                    },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Bathrooms
              </label>
              <Input
                type="number"
                placeholder="Number of bathrooms"
                value={formData.features?.bathrooms || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      bathrooms: Number.parseInt(e.target.value),
                    },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Toilets</label>
              <Input
                type="number"
                placeholder="Number of toilets"
                value={formData.features?.toilets || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      toilets: Number.parseInt(e.target.value),
                    },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Parking Spaces
              </label>
              <Input
                type="number"
                placeholder="Number of parking spaces"
                value={formData.features?.parkingSpaces || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      parkingSpaces: Number.parseInt(e.target.value),
                    },
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Size (sq ft)
              </label>
              <Input
                type="number"
                placeholder="Property size"
                value={formData.features?.size || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      size: Number.parseInt(e.target.value),
                    },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Year Built
              </label>
              <Input
                type="number"
                placeholder="Year built"
                value={formData.features?.yearBuilt || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      yearBuilt: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Furnishing</label>
            <Input
              placeholder="Furnished/Semi-furnished/Unfurnished"
              value={formData.features?.furnishing || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  features: { ...prev.features, furnishing: e.target.value },
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amenities</label>
            <Input
              placeholder="e.g., 24/7 power, Water supply"
              value={formData.features?.amenities || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  features: { ...prev.features, amenities: e.target.value },
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Extras</label>
            <Input
              placeholder="e.g., Balcony, Garden"
              value={formData.features?.extras || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  features: { ...prev.features, extras: e.target.value },
                }))
              }
            />
          </div>
        </div>

        {/* Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Media</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Images
              </label>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Select one or multiple images
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Videos
              </label>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
                className="block w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Select one or multiple videos
              </p>
            </div>
          </div>

          {uploadedMedia.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3">
                Uploaded Media ({uploadedMedia.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {uploadedMedia.map((media, index) => (
                  <div key={index} className="relative group">
                    {media.type === "image" ? (
                      <div className="relative w-full h-20">
                        <Image
                          src={media.preview || "/placeholder.svg"}
                          alt={`Preview ${index}`}
                          fill
                          className="object-cover rounded-xl"
                        />
                      </div>
                    ) : (
                      <video
                        src={media.preview}
                        className="w-full h-20 object-cover rounded-md bg-black"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    <span className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {media.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>

          <div>
            <label className="block text-sm font-medium mb-2">Listed By</label>
            <select
              value={formData.contact?.listedBy || "owner"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: {
                    ...prev.contact,
                    listedBy: e.target.value,
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="owner">Owner</option>
              <option value="agent">Agent</option>
              <option value="helper">Helper</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Name
            </label>
            <Input
              placeholder="Full name"
              value={formData.contact?.contactName || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, contactName: e.target.value },
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Email
            </label>
            <Input
              type="email"
              placeholder="Email address"
              value={formData.contact?.contactEmail || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, contactEmail: e.target.value },
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Phone
            </label>
            <Input
              type="tel"
              placeholder="Phone number"
              value={formData.contact?.contactNumber || ""}
              onChange={(e) => {
                // Store phone as string to preserve leading zeros
                const value = e.target.value;

                setFormData((prev) => ({
                  ...prev,
                  contact: {
                    ...prev.contact!,
                    contactNumber: value,
                  },
                }));
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Agency (Optional)
            </label>
            <Input
              placeholder="Agency name"
              value={formData.contact?.agency || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, agency: e.target.value },
                }))
              }
            />
          </div>
        </div>

        {/* Status & Condition */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Condition</label>
            <select
              name="condition"
              value={formData.condition || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="new">New</option>
              <option value="old">Old</option>
              <option value="uncompleted">Uncompleted</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="available">Available</option>
              <option value="negotiation">Negotiation</option>
              <option value="rented">Rented</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ownership</label>
            <select
              name="ownership"
              value={formData.ownership || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="owner">Owner</option>
              <option value="agent">Agent</option>
              <option value="helper">Helper</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading || locationLoading}
            className="flex-1 text-white bg-green-600 hover:bg-green-600/90 flex items-center px-4 py-2 rounded-xl cursor-pointer"
          >
            {loading
              ? "Uploading..."
              : locationLoading
              ? "Getting Location..."
              : "Upload Property"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
