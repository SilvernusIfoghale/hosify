"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Clock, Upload, User } from "lucide-react";
import { getMyVerification, type Verification } from "@/app/api/tenant-client";
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
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "pending":
        return <Clock className="h-5 w-5 text-warning" />;
      default:
        return <Upload className="h-5 w-5 text-muted-foreground" />;
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
        return "Verification Approved";
      case "rejected":
        return "Verification Rejected";
      case "pending":
        return "Under Review";
      default:
        return "Not Submitted";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calcProgress = (v: Verification | null): number => {
    if (!v) return 0;
    const steps = 2; // idType, idDocuments
    let done = 0;
    if (v.idType) done++;
    if (v.idDocuments?.length) done++;
    if (["pending", "approved", "rejected"].includes(v.status)) done++;
    return Math.round((done / steps) * 100);
  };

  const progressValue = calcProgress(verification);

  if (loading) {
    return (
      <Card
        className="bg-card border-border"
        aria-busy="true"
        aria-live="polite"
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            KYC Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          <div className="mt-4 h-2 w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            KYC Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
          <Button onClick={fetchVerification} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const status = verification?.status || "none";

  return (
    <Card
      className="bg-card border-border"
      aria-labelledby="kyc-verification-heading"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle
            id="kyc-verification-heading"
            className="text-lg font-semibold text-card-foreground"
          >
            KYC Verification Status
          </CardTitle>
          <div className="flex items-center gap-2" aria-live="polite">
            {getStatusIcon(status)}
            <Badge className={getStatusColor(status)}>
              {getStatusText(status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Verification Progress
              </span>
              <span
                className="font-medium text-card-foreground"
                aria-label="Progress value"
              >
                {progressValue}%
              </span>
            </div>
            <Progress
              value={progressValue}
              className="h-2"
              aria-valuenow={progressValue}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          {verification && (
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="text-muted-foreground">ID Type:</span>
                  <span className="font-medium text-card-foreground capitalize">
                    {verification.idType}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="text-muted-foreground">Submitted:</span>
                  <span className="font-medium text-card-foreground">
                    {verification.submittedAt
                      ? formatDate(verification.submittedAt)
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          )}
          {status === "pending" && (
            <div
              className="p-3 bg-warning/10 border border-warning/20 rounded-lg"
              role="status"
            >
              <p className="text-sm text-warning">
                Your documents are being reviewed. This typically takes 2–3
                business days.
              </p>
            </div>
          )}
          {status === "approved" && (
            <div
              className="p-3 bg-success/10 border border-success/20 rounded-lg"
              role="status"
            >
              <p className="text-sm text-success">
                Verified! Your identity has been confirmed.
              </p>
            </div>
          )}
          {status === "rejected" && (
            <div
              className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
              role="alert"
            >
              <p className="text-sm text-destructive">
                Your previous submission was rejected. Please review notes and
                resubmit.
              </p>
            </div>
          )}
          <div className="flex gap-3 pt-4 border-t border-border flex-col sm:flex-row">
            {status === "none" && (
              <Button
                className="flex-1"
                onClick={() => router.push("/tenant/verification")}
                aria-label="Start KYC verification"
              >
                Start Verification
              </Button>
            )}
            {status === "pending" && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/tenant/verification")}
                aria-label="View verification status"
              >
                View Details
              </Button>
            )}
            {status === "rejected" && (
              <Button
                className="flex-1"
                onClick={() => router.push("/tenant/verification")}
                aria-label="Resubmit verification"
              >
                Resubmit
              </Button>
            )}
            {status === "approved" && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={fetchVerification}
                aria-label="Refresh verification status"
              >
                Refresh
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => router.push("/contact")}
              aria-label="Contact support"
            >
              Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
