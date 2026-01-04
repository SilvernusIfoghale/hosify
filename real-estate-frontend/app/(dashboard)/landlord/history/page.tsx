"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  UserPlus,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
} from "lucide-react";
import { getUserHistory, type History } from "@/app/api/landlord-client";
import { LeaveReviewModal } from "../components/leave-review-modal";

const Page = () => {
  const [historyData, setHistoryData] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allHistoryLoaded, setAllHistoryLoaded] = useState(false);
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    tenantId: string;
    tenantName: string;
  }>({
    open: false,
    tenantId: "",
    tenantName: "",
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getUserHistory();
        if (response.success) {
          setHistoryData(response.history);
        }
      } catch (err: unknown) {
        console.error("Error fetching history:", err);
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (historyData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No history records found</p>
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Property Listed":
        return <Home className="h-4 w-4 text-primary" />;
      case "Tenant Application":
        return <UserPlus className="h-4 w-4 text-chart-2" />;
      case "Rent Payment":
        return <DollarSign className="h-4 w-4 text-success" />;
      case "Maintenance Request":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "Property Viewed":
        return <Eye className="h-4 w-4 text-chart-1" />;
      case "Lease Signed":
        return <FileText className="h-4 w-4 text-success" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "Property Listed":
        return "bg-primary/10 text-primary border-primary/20";
      case "Tenant Application":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20";
      case "Rent Payment":
        return "bg-success/10 text-success border-success/20";
      case "Maintenance Request":
        return "bg-warning/10 text-warning border-warning/20";
      case "Property Viewed":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      case "Lease Signed":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleViewAllHistory = () => {
    // Since all history is already loaded from the backend, just show a message
    alert(
      "All available history is already displayed. The system shows your complete activity history."
    );
  };

  const handleLoadMoreActivity = () => {
    // Since pagination isn't implemented on the backend yet, show a message
    if (!allHistoryLoaded) {
      setAllHistoryLoaded(true);
      // Could implement actual pagination here in the future
    }
  };

  const handleLeaveReview = (tenantId: string, tenantName: string) => {
    setReviewModal({
      open: true,
      tenantId,
      tenantName,
    });
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-card-foreground">
              Recent Activity
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleViewAllHistory}>
              View All History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {historyData.map((item) => (
              <div
                key={item._id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border bg-accent/5 hover:bg-accent/10 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center">
                    {getActionIcon(item.action)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getActionColor(item.action)}>
                          {item.action || "Unknown Action"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(item.createdAt || "")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src="/placeholder.svg"
                            alt={item.userId?.name || "User"}
                          />
                          <AvatarFallback className="text-xs">
                            {getInitials(item.userId?.name || "User")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-card-foreground">
                          {item.userId?.name || "Unknown User"}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {item.notes || "No additional notes"}
                      </p>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Home className="h-3 w-3" />
                        <span>{item.propertyId?.title || "Property"}</span>
                        <span>•</span>
                        <span>
                          {item.propertyId?.location?.city &&
                          item.propertyId?.location?.state
                            ? `${item.propertyId.location.city}, ${item.propertyId.location.state}`
                            : item.propertyId?.location?.address ||
                              "Location not specified"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end min-w-fit">
                      {item.endDate && (
                        <div className="flex items-center gap-1 text-xs text-success whitespace-nowrap">
                          <CheckCircle className="h-3 w-3" />
                          <span>Completed</span>
                        </div>
                      )}
                      {(item.action === "Tenant Application" ||
                        item.action === "Lease Signed" ||
                        item.action === "Rent Payment") &&
                        item.userId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleLeaveReview(
                                item.userId._id,
                                item.userId.name || "Tenant"
                              )
                            }
                            className="whitespace-nowrap"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Leave Review
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {historyData.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No activity history found
                </p>
              </div>
            )}
          </div>

          {historyData.length > 0 && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleLoadMoreActivity}
                disabled={allHistoryLoaded}
              >
                {allHistoryLoaded
                  ? "All Activities Loaded"
                  : "Load More Activity"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <LeaveReviewModal
        open={reviewModal.open}
        onOpenChange={(open) => setReviewModal({ ...reviewModal, open })}
        tenantId={reviewModal.tenantId}
        tenantName={reviewModal.tenantName}
      />
    </>
  );
};

export default Page;
