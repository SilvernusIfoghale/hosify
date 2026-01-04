"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  Shield,
  User,
} from "lucide-react";
import { getMyVerification, type Verification } from "@/app/api/tenant-client";
import { useRouter } from "next/navigation";

export function KYCVerification() {
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
    } catch (err) {
      console.error("Error fetching verification:", err);
      setError("Failed to fetch verification status");
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
        return "Verified";
      case "rejected":
        return "Rejected";
      case "pending":
        return "Under Review";
      default:
        return "Not Submitted";
    }
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

  const status = verification?.status || "none";
  const progressValue = calcProgress(verification);

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Verify
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Verify
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
          <Button onClick={fetchVerification} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Verify
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <Badge className={getStatusColor(status)}>
              {getStatusText(status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-card-foreground">
              {progressValue}%
            </span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {verification && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">ID Type:</span>
              <span className="font-medium text-card-foreground capitalize">
                {verification.idType || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Documents:</span>
              <span className="font-medium text-card-foreground">
                {verification.idDocuments?.length || 0} uploaded
              </span>
            </div>
          </div>
        )}

        {status === "pending" && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning">
              Your documents are being reviewed. This typically takes 2–3
              business days.
            </p>
          </div>
        )}

        {status === "approved" && (
          <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-sm text-success">
              ✓ Your identity has been verified. You have full access to all
              features.
            </p>
          </div>
        )}

        {status === "rejected" && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              Your submission was rejected. Please review and resubmit your
              documents.
            </p>
          </div>
        )}

        {status === "none" && (
          <div className="p-3 bg-muted/10 border border-muted/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Complete KYC verification to unlock full features and build trust
              with landlords.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            className="flex-1"
            onClick={() => router.push("/tenant/verification")}
            variant={status === "approved" ? "outline" : "default"}
          >
            {status === "none" && "Start Verification"}
            {status === "pending" && "View Details"}
            {status === "rejected" && "Resubmit"}
            {status === "approved" && "View Certificate"}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/contact")}
          >
            Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
