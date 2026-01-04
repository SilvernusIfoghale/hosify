"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Clock, Upload } from "lucide-react";
import {
  getMyVerification,
  type Verification,
} from "@/app/api/landlord-client";
import { useRouter } from "next/navigation";

export function VerificationStatus() {
  const router = useRouter();
  const [verification, setVerification] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVerification = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyVerification();
      setVerification(response.verification);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch verification status";
      console.error("Error fetching verification:", error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerification();
  }, []);

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "approved":
        return (
          <CheckCircle className="h-4 w-4 text-success" aria-hidden="true" />
        );
      case "rejected":
        return (
          <AlertCircle
            className="h-4 w-4 text-destructive"
            aria-hidden="true"
          />
        );
      case "pending":
        return <Clock className="h-4 w-4 text-warning" aria-hidden="true" />;
      default:
        return (
          <Upload
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
        );
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "approved":
        return "bg-success/10 text-success border-success/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case "approved":
        return "Verified Landlord";
      case "rejected":
        return "Verification Failed";
      case "pending":
        return "Verification Pending";
      default:
        return "Not Verified";
    }
  };

  const handleButtonClick = () => {
    router.push("/landlord/verification");
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-pulse bg-muted rounded" />
            <div className="flex-1">
              <div className="h-4 w-32 animate-pulse bg-muted rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle
              className="h-4 w-4 text-destructive"
              aria-hidden="true"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-card-foreground">
                  Verification Status
                </span>
                <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                  Error
                </Badge>
              </div>
              <p className="text-xs text-destructive mt-1">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchVerification}
              aria-label="Retry fetching verification status"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const status = verification?.status || "none";

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {getStatusIcon(status)}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-card-foreground">
                Verification Status
              </span>
              <Badge className={getStatusColor(status)}>
                {getStatusText(status)}
              </Badge>
            </div>
            {status === "pending" && (
              <p className="text-xs text-muted-foreground mt-1">
                Review in progress - typically takes 2-3 business days
              </p>
            )}
            {status === "approved" && (
              <p className="text-xs text-muted-foreground mt-1">
                Your identity and ownership documents have been verified
              </p>
            )}
            {status === "rejected" && verification?.notes && (
              <p className="text-xs text-destructive mt-1">
                Reason: {verification.notes}
              </p>
            )}
            {status === "none" && (
              <p className="text-xs text-muted-foreground mt-1">
                Complete verification to increase trust with tenants
              </p>
            )}
          </div>
          {status !== "approved" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleButtonClick}
              aria-label={
                status === "pending"
                  ? "View verification status"
                  : "Get verified"
              }
            >
              {status === "pending" ? "View Status" : "Get Verified"}
            </Button>
          )}
          {status === "approved" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchVerification}
              aria-label="Refresh verification status"
              className="text-muted-foreground hover:text-foreground"
            >
              Refresh
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
