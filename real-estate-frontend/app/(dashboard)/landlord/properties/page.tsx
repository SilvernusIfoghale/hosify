"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Plus,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import {
  getLandlordProperties,
  deletePropertyById,
  type Property,
} from "@/app/api/landlord-client";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const userId = user?.id;
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getLandlordProperties(userId);
        if (response.success) {
          setProperties(response.properties);
        } else {
          setError("Failed to load properties");
        }
      } catch (err: unknown) {
        console.error("Error fetching properties:", err);
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if auth is initialized and we have a user or have determined there's no user
    if (isInitialized) {
      fetchProperties();
    }
  }, [user, isInitialized]);

  const handleDelete = async (propertyId: string, propertyTitle: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${propertyTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(propertyId);
      await deletePropertyById(propertyId);
      setProperties(properties.filter((p) => p._id !== propertyId));
    } catch (err: unknown) {
      console.error("Error deleting property:", err);
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "Failed to delete property");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (propertyId: string) => {
    router.push(`/landlord/properties/${propertyId}/edit`);
  };

  const handleView = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-success/10 text-success border-success/20";
      case "rented":
      case "negotiation":
        return "bg-primary/10 text-primary border-primary/20";
      case "unavailable":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-success/10 text-success";
      case "old":
        return "bg-primary/10 text-primary";
      case "uncompleted":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const formatFeatures = (property: Property) => {
    const features = [];
    if (property.features?.bedrooms)
      features.push(`${property.features.bedrooms} beds`);
    if (property.features?.bathrooms)
      features.push(`${property.features.bathrooms} baths`);
    if (property.features?.toilets)
      features.push(`${property.features.toilets} toilets`);
    if (property.features?.parkingSpaces)
      features.push(`${property.features.parkingSpaces} parking`);
    if (property.features?.size)
      features.push(`${property.features.size} sqft`);
    if (property.features?.yearBuilt)
      features.push(`Built ${property.features.yearBuilt}`);
    if (property.features?.furnishing)
      features.push(property.features.furnishing);
    return features;
  };

  if (!isInitialized) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground">
            Your Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Initializing...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground">
            Your Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Please log in to view your properties
            </p>
            <Link href="/auth/login">
              <Button>Log In</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground">
            Your Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground">
            Your Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (properties.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-card-foreground">
              Your Properties
            </CardTitle>
            <Link
              href="/landlord/properties/new"
              className="text-white bg-green-600 hover:bg-green-600/90 flex items-center px-4 py-2 rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Add Property
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Building2
              className="h-12 w-12 mx-auto mb-4 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding your first property listing
            </p>
            <Link href="/landlord/properties/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Add Your First Property
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:items-center justify-between">
          <CardTitle className="text-xl font-semibold text-card-foreground">
            Your Properties ({properties.length})
          </CardTitle>
          <Link
            href="/landlord/properties/new"
            className="text-white bg-green-600 hover:bg-green-600/90 flex items-center px-4 py-2 rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add Property
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="border border-border rounded-lg p-4 md:p-6 bg-accent/5 hover:bg-accent/10 transition-colors"
            >
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="space-y-2">
                    <Image
                      src={
                        property.media?.images?.[0]?.url || "/placeholder.svg"
                      }
                      alt={property.title}
                      width={96}
                      height={96}
                      priority
                      className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover bg-muted"
                    />
                    {property.media?.images &&
                      property.media.images.length > 1 && (
                        <div className="flex gap-1">
                          {property.media.images
                            .slice(1, 4)
                            .map((image, idx) => (
                              <Image
                                key={idx}
                                src={image.url}
                                alt={`${property.title} ${idx + 2}`}
                                width={32}
                                height={32}
                                className="w-8 h-8 md:w-10 md:h-10 rounded object-cover bg-muted"
                              />
                            ))}
                          {property.media.images.length > 4 && (
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                              +{property.media.images.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground text-sm md:text-base text-balance">
                        {property.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                        {property.description}
                      </p>

                      {/* Property Type and Listing Type */}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {property.propertyType}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          For {property.listingType}
                        </Badge>
                      </div>

                      {/* Contact Information - Hidden on mobile */}
                      {property.contact && (
                        <div className="hidden md:block mt-2 text-xs text-muted-foreground">
                          <p>
                            Contact:{" "}
                            {property.contact.contactName ||
                              property.contact.listedBy}
                          </p>
                          {property.contact.contactNumber && (
                            <p>Phone: {property.contact.contactNumber}</p>
                          )}
                        </div>
                      )}

                      {/* Ownership and Block Number - Hidden on mobile */}
                      <div className="hidden md:block mt-2 text-xs text-muted-foreground">
                        <p>Ownership: {property.ownership}</p>
                        {property.blockNumber && (
                          <p>Block: {property.blockNumber}</p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Property actions"
                        >
                          <MoreHorizontal
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleView(property._id)}
                        >
                          <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(property._id)}
                        >
                          <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
                          Edit Property
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleDelete(property._id, property.title)
                          }
                          disabled={deletingId === property._id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                          {deletingId === property._id
                            ? "Deleting..."
                            : "Delete Property"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <MapPin
                      className="h-3 w-3 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-xs text-muted-foreground">
                      {property.location?.address &&
                        `${property.location.address}, `}
                      {property.location?.city || "N/A"},{" "}
                      {property.location?.state || "N/A"}
                      {property.location?.postalCode &&
                        ` ${property.location.postalCode}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-card-foreground text-sm md:text-base">
                        {property.currency === "NGN" ? "₦" : property.currency}
                        {property.price.toLocaleString()}/
                        {property.listingType === "rent" ? "mo" : "sale"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" aria-hidden="true" />
                      <span>{property.metadata?.views || 0}</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>
                      Listed:{" "}
                      {new Date(
                        property.metadata?.dateListed || property.createdAt
                      ).toLocaleDateString()}
                    </span>
                    {property.updatedAt !== property.createdAt && (
                      <span>
                        Updated:{" "}
                        {new Date(property.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Badge className={getStatusColor(property.status)}>
                      {property.status}
                    </Badge>
                    {property.condition && (
                      <Badge
                        variant="outline"
                        className={getConditionColor(property.condition)}
                      >
                        {property.condition}
                      </Badge>
                    )}
                    {property.metadata?.isVerified && (
                      <Badge
                        variant="outline"
                        className="bg-success/10 text-success border-success/20"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Features - Hidden on mobile */}
                  <div className="hidden md:flex flex-wrap gap-1 mt-2">
                    {formatFeatures(property).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-muted/50 text-muted-foreground rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Amenities - Hidden on mobile */}
                  {property.features?.amenities && (
                    <div className="hidden md:block mt-2">
                      <p className="text-xs text-muted-foreground">
                        <strong>Amenities:</strong>{" "}
                        {property.features.amenities}
                      </p>
                    </div>
                  )}

                  {/* Extras - Hidden on mobile */}
                  {property.features?.extras && (
                    <div className="hidden md:block mt-1">
                      <p className="text-xs text-muted-foreground">
                        <strong>Extras:</strong> {property.features.extras}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
