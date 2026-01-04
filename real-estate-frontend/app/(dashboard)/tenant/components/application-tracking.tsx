"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, MapPin } from "lucide-react";
import Image from "next/image";
import { getTenantHistory } from "@/app/api/tenant-client";
import { type Property, type History } from "@/app/api/landlord-client";
import { useAuthStore } from "@/app/store/authStore";

export function TenantApplicationTracking() {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await getTenantHistory();
        if (response.success && response.history) {
          setApplications(response.history);
        }
      } catch (error) {
        console.error("Error fetching tenant applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user?.id]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/20",
          label: "Active",
        };
      case "archived":
        return {
          icon: CheckCircle,
          color: "text-gray-600",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/20",
          label: "Completed",
        };
      default:
        return {
          icon: Clock,
          color: "text-muted-foreground",
          bgColor: "bg-muted/10",
          borderColor: "border-muted/20",
          label: "Unknown",
        };
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              My Rentals
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track your rental history and active leases
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading rentals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            My Rentals
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track your rental history and active leases
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          View All
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card className="p-5 bg-card border-border">
          <p className="text-center text-muted-foreground py-8">
            No rental history yet. Start exploring properties to find your
            perfect home!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const statusConfig = getStatusConfig(application.status);
            const StatusIcon = statusConfig.icon;
            const property = application.propertyId as Property;

            const startDate = new Date(application.startDate);
            const endDate = application.endDate
              ? new Date(application.endDate)
              : null;
            const moveInDate = startDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <Card
                key={application._id}
                className={`p-3 sm:p-5 bg-card border-border hover:border-muted transition-colors ${statusConfig.borderColor}`}
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="relative h-32 w-full sm:h-36 sm:w-44 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        property?.media?.images?.[0]?.url || "/apartment2.jfif"
                      }
                      alt={property?.title || "Property"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                          {property?.title || "Property"}
                        </h3>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">
                            {property?.location?.address ||
                              "Address not available"}
                          </span>
                        </div>
                      </div>
                      <Badge
                        className={`${statusConfig.bgColor} ${statusConfig.color} border-0 flex-shrink-0 w-fit`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        <span className="text-xs sm:text-sm">
                          {statusConfig.label}
                        </span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Move-in Date</p>
                        <p className="text-foreground font-medium">
                          {moveInDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {endDate ? "Move-out Date" : "Current Status"}
                        </p>
                        <p className="text-foreground font-medium">
                          {endDate
                            ? endDate.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Ongoing"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monthly Rent</p>
                        <p className="text-foreground font-medium">
                          ₦{property?.price?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Notes</p>
                        <p className="text-foreground font-medium text-xs line-clamp-1">
                          {application.notes || "None"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      {application.status === "active" && (
                        <>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Contact Landlord
                          </Button>
                        </>
                      )}
                      {application.status === "archived" && (
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
