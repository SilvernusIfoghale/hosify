"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Building2,
  Car,
  Bath,
  Bed,
  Ruler,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Home,
  MessageSquare,
  Heart,
} from "lucide-react";
import { viewPropertyById, type Property } from "@/app/api/landlord-client";
import { useAuthStore } from "@/app/store/authStore";
import { RequestRentalModal } from "@/app/(dashboard)/tenant/components/request-rental-modal";
import { LeaveReviewModal } from "@/app/(dashboard)/tenant/components/leave-review-modal";
import {
  getTenantFavorites,
  addTenantFavorite,
  removeTenantFavorite,
} from "@/app/api/tenant-client";
import toast from "react-hot-toast";

const PropertyDetailPage = () => {
  const params = useParams();
  const propertyId = params.id as string;
  const { user, isInitialized } = useAuthStore();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [hasRentalHistory] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [toggleFavLoading, setToggleFavLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;

      // Check if user is authenticated
      if (!isInitialized) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await viewPropertyById(propertyId);

        if (response.success) {
          setProperty(response.property);
        } else {
          setError("Property not found");
        }
      } catch (err: unknown) {
        console.error("Error fetching property:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load property"
        );
      } finally {
        setLoading(false);
      }
    };

    // Fetch favorite status if user is a tenant
    const fetchFavoriteStatus = async () => {
      if (user?.role?.toLowerCase() === "tenant") {
        try {
          const favResponse = await getTenantFavorites();
          if (favResponse.success && favResponse.favourites) {
            const isFav = favResponse.favourites.some(
              (fav: Property) => fav._id === propertyId
            );
            setIsFavorited(isFav);
          }
        } catch (err) {
          console.error("Error fetching favorite status:", err);
        }
      }
    };

    fetchProperty();
    fetchFavoriteStatus();
  }, [propertyId, user, isInitialized]);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }

    try {
      setToggleFavLoading(true);
      if (isFavorited) {
        await removeTenantFavorite(propertyId);
        setIsFavorited(false);
        toast.success("Removed from favorites");
      } else {
        await addTenantFavorite(propertyId);
        setIsFavorited(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite");
    } finally {
      setToggleFavLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Loading property...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/landlord/properties">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = property.media?.images || [];
  const videos = property.media?.videos || [];
  const allMedia = [...images, ...videos];
  const currentMedia = allMedia[selectedMediaIndex];
  const isCurrentMediaVideo = selectedMediaIndex >= images.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button and Favorite */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/landlord/properties">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
          {user?.role?.toLowerCase() === "tenant" && (
            <Button
              onClick={handleToggleFavorite}
              disabled={toggleFavLoading}
              variant="outline"
              className="gap-2"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
              {isFavorited ? "Saved" : "Save"}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                {/* Main Media Display */}
                <div className="relative bg-black rounded-t-lg overflow-hidden">
                  {/* Main Image/Video */}
                  {isCurrentMediaVideo ? (
                    <div className="relative w-full bg-black">
                      <video
                        src={currentMedia?.url}
                        className="w-full h-96 object-cover"
                        controls
                      />
                    </div>
                  ) : (
                    <Image
                      src={currentMedia?.url || "/placeholder.svg"}
                      alt={property.title}
                      width={800}
                      height={600}
                      className="w-full h-96 object-cover"
                      priority
                    />
                  )}

                  {/* Navigation Arrows */}
                  {allMedia.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedMediaIndex(
                            selectedMediaIndex === 0
                              ? allMedia.length - 1
                              : selectedMediaIndex - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                        aria-label="Previous media"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedMediaIndex(
                            selectedMediaIndex === allMedia.length - 1
                              ? 0
                              : selectedMediaIndex + 1
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                        aria-label="Next media"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}

                  {/* Media Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {selectedMediaIndex + 1} / {allMedia.length}
                  </div>

                  {/* Verified Badge */}
                  {property.metadata?.isVerified && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Verified
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {allMedia.length > 1 && (
                  <div className="p-4 bg-white">
                    <p className="text-sm font-medium text-gray-600 mb-3">
                      Gallery ({images.length} images
                      {videos.length > 0
                        ? `, ${videos.length} video${
                            videos.length > 1 ? "s" : ""
                          }`
                        : ""}
                      )
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allMedia.map((media, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedMediaIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 relative transition-all ${
                            selectedMediaIndex === index
                              ? "border-green-500 ring-2 ring-green-500/30"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {index >= images.length ? (
                            <>
                              <video
                                src={media.url}
                                className="w-full h-full object-cover bg-black"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Play className="h-5 w-5 text-white fill-white" />
                              </div>
                            </>
                          ) : (
                            <Image
                              src={media.url}
                              alt={`${property.title} ${index + 1}`}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {property.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {property.location?.address &&
                          `${property.location.address}, `}
                        {property.location?.city}, {property.location?.state}
                        {property.location?.postalCode &&
                          ` ${property.location.postalCode}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {property.currency === "NGN" ? "₦" : property.currency}
                      {property.price.toLocaleString()}
                      {property.listingType === "rent" && (
                        <span className="text-lg text-muted-foreground">
                          /mo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status and Type Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {property.listingType}
                  </Badge>
                  <Badge variant="outline">{property.propertyType}</Badge>
                  <Badge
                    className={`${
                      property.status === "available"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : property.status === "rented"
                        ? "bg-blue-100 text-green-800 border-green-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    {property.status}
                  </Badge>
                  {property.condition && (
                    <Badge variant="outline">{property.condition}</Badge>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.features?.bedrooms && (
                      <div className="flex items-center gap-2">
                        <Bed className="h-5 w-5 text-muted-foreground" />
                        <span>{property.features.bedrooms} Bedrooms</span>
                      </div>
                    )}
                    {property.features?.bathrooms && (
                      <div className="flex items-center gap-2">
                        <Bath className="h-5 w-5 text-muted-foreground" />
                        <span>{property.features.bathrooms} Bathrooms</span>
                      </div>
                    )}
                    {property.features?.parkingSpaces && (
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-muted-foreground" />
                        <span>{property.features.parkingSpaces} Parking</span>
                      </div>
                    )}
                    {property.features?.size && (
                      <div className="flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-muted-foreground" />
                        <span>{property.features.size} sqft</span>
                      </div>
                    )}
                    {property.features?.yearBuilt && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <span>Built {property.features.yearBuilt}</span>
                      </div>
                    )}
                  </div>

                  {/* Additional Features */}
                  <div className="mt-4 space-y-2">
                    {property.features?.furnishing && (
                      <p>
                        <strong>Furnishing:</strong>{" "}
                        {property.features.furnishing}
                      </p>
                    )}
                    {property.features?.amenities && (
                      <p>
                        <strong>Amenities:</strong>{" "}
                        {property.features.amenities}
                      </p>
                    )}
                    {property.features?.extras && (
                      <p>
                        <strong>Extras:</strong> {property.features.extras}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h4 className="font-medium mb-2">Property Information</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Ownership:</strong> {property.ownership}
                      </p>
                      {property.blockNumber && (
                        <p>
                          <strong>Block Number:</strong> {property.blockNumber}
                        </p>
                      )}
                      <p>
                        <strong>Views:</strong> {property.metadata?.views || 0}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Listing Details</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Listed:</strong>{" "}
                        {new Date(
                          property.metadata?.dateListed || property.createdAt
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Last Updated:</strong>{" "}
                        {new Date(property.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.contact?.contactName && (
                  <div>
                    <p className="font-medium">
                      {property.contact.contactName}
                    </p>
                    {property.contact.agency && (
                      <p className="text-sm text-muted-foreground">
                        {property.contact.agency}
                      </p>
                    )}
                  </div>
                )}

                {property.contact?.contactNumber && (
                  <Button className="w-full" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call {property.contact.contactNumber}
                  </Button>
                )}

                {property.contact?.contactEmail && (
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Agent
                  </Button>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Listed by: {property.contact?.listedBy || "Property Owner"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tenant Actions */}
            {user?.role?.toLowerCase() === "tenant" && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Tenant Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {property.status === "available" && (
                    <Button
                      onClick={() => setIsRentalModalOpen(true)}
                      className="w-full gap-2"
                    >
                      <Home className="h-4 w-4" />
                      Request to Rent
                    </Button>
                  )}

                  {hasRentalHistory && (
                    <Button
                      onClick={() => setIsReviewModalOpen(true)}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Leave a Review
                    </Button>
                  )}

                  {property.status !== "available" && !hasRentalHistory && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      This property is not available for rental at the moment.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Property Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <Badge
                      className={
                        property.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {property.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Views</span>
                    <span className="font-medium">
                      {property.metadata?.views || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Listed
                    </span>
                    <span className="text-sm">
                      {new Date(
                        property.metadata?.dateListed || property.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Rental Request Modal */}
      {property && (
        <RequestRentalModal
          isOpen={isRentalModalOpen}
          onClose={() => setIsRentalModalOpen(false)}
          propertyId={propertyId}
          propertyTitle={property.title}
          onSuccess={() => {
            // Refresh tenant history after successful rental request
            // Note: tenantHistory is not used, so skipping refresh
          }}
        />
      )}

      {/* Leave Review Modal */}
      {property && property.contact?.listedBy && (
        <LeaveReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          landlordId={property._id || propertyId}
          landlordName={property.contact?.contactName || "Landlord"}
          propertyTitle={property.title}
        />
      )}
    </div>
  );
};

export default PropertyDetailPage;
