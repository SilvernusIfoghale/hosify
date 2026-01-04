"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  FileText,
  Shield,
  User,
  Building,
  X,
  Download,
} from "lucide-react";
import {
  getMyVerification,
  submitVerification,
  deleteVerificationDocument,
  type Verification,
  type VerificationDocument,
} from "@/app/api/landlord-client";
import { useAuthStore } from "@/app/store/authStore";

const ID_TYPES: Array<Verification["idType"]> = [
  "passport",
  "national_id",
  "driver_license",
  "voter_card",
];

const Page = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [verification, setVerification] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [idType, setIdType] = useState<Verification["idType"]>("passport");
  const [idDocs, setIdDocs] = useState<File[]>([]);
  const [proofDocs, setProofDocs] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [removeLoading, setRemoveLoading] = useState<string | null>(null);

  const fetchVerification = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyVerification();
      setVerification(res.verification || null);
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      setError(
        error?.response?.data?.message || "Failed to load verification status"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerification();
  }, [fetchVerification]);

  const getStatusIcon = (status: string) => {
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

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  const getFileIcon = (filename: string) => {
    if (filename.toLowerCase().includes("pdf")) {
      return <FileText className="h-4 w-4 text-destructive" />;
    }
    return <FileText className="h-4 w-4 text-primary" />;
  };

  const calcProgress = (v: Verification | null): number => {
    if (!v) return 0;
    let steps = 3; // idType, idDocuments, status beyond none
    if (v.roleAtSubmission === "landlord") steps += 1; // proof docs
    let done = 0;
    if (v.idType) done++;
    if (v.idDocuments?.length) done++;
    if (v.roleAtSubmission === "landlord") {
      if (v.proofOfOwnership?.length) done++;
    }
    if (["pending", "approved", "rejected"].includes(v.status)) done++;
    return Math.round((done / steps) * 100);
  };

  const handleIdDocsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIdDocs(Array.from(e.target.files));
    }
  };

  const handleProofDocsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProofDocs(Array.from(e.target.files));
    }
  };

  const resetForm = () => {
    setIdDocs([]);
    setProofDocs([]);
    setIdType("passport");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) return;
    if (!idDocs.length) {
      setError("Please upload at least one identity document");
      return;
    }
    if (user.role === "landlord" && !proofDocs.length) {
      setError("Landlords must upload proof of ownership documents");
      return;
    }
    const formData = new FormData();
    formData.append("idType", idType);
    idDocs.forEach((f) => formData.append("idDocs", f));
    proofDocs.forEach((f) => formData.append("proofDocs", f));
    try {
      setSubmitting(true);
      const res = await submitVerification(formData);
      setVerification(res.verification);
      resetForm();
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveDoc = async (
    section: "idDocuments" | "proofOfOwnership",
    doc: VerificationDocument
  ) => {
    if (!verification) return;
    if (!confirm(`Remove document "${doc.label}"?`)) return;
    try {
      setRemoveLoading(doc.public_id);
      await deleteVerificationDocument(
        verification._id,
        section,
        doc.public_id
      );
      await fetchVerification();
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      alert(error?.response?.data?.message || "Failed to remove document");
    } finally {
      setRemoveLoading(null);
    }
  };

  const status = verification?.status || "none";

  const showForm = !verification || status === "none" || status === "rejected";

  const progressValue = calcProgress(verification);

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-live="polite">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="mt-4 h-2 w-full bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Verification Status
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card
        className="bg-card border-border"
        aria-labelledby="verification-heading"
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle
              id="verification-heading"
              className="text-lg font-semibold text-card-foreground"
            >
              Verification Status
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground">Role:</span>
                    <Badge variant="outline" className="capitalize">
                      {verification.roleAtSubmission}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground">ID Type:</span>
                    <span className="font-medium text-card-foreground capitalize">
                      {verification.idType}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
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
                  {verification.reviewedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">Reviewed:</span>
                      <span className="font-medium text-card-foreground">
                        {formatDate(verification.reviewedAt)}
                      </span>
                    </div>
                  )}
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
                  Verified! You now have full access to all landlord features.
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
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <Card
          className="bg-card border-border"
          aria-labelledby="submit-verification-heading"
        >
          <CardHeader>
            <CardTitle
              id="submit-verification-heading"
              className="text-lg font-semibold text-card-foreground"
            >
              Submit Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              aria-describedby={error ? "verification-error" : undefined}
            >
              {error && (
                <div
                  id="verification-error"
                  className="p-3 text-sm bg-destructive/10 border border-destructive/20 rounded text-destructive"
                  role="alert"
                >
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label
                  htmlFor="idType"
                  className="text-sm font-medium text-card-foreground"
                >
                  ID Type
                </label>
                <select
                  id="idType"
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
                  value={idType}
                  onChange={(e) =>
                    setIdType(e.target.value as Verification["idType"])
                  }
                  aria-required="true"
                >
                  {ID_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-card-foreground"
                  htmlFor="idDocs"
                >
                  Identity Documents (front/back, selfie)
                </label>
                <input
                  id="idDocs"
                  name="idDocs"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleIdDocsChange}
                  className="w-full text-sm"
                  aria-required="true"
                />
                {idDocs.length > 0 && (
                  <p
                    className="text-xs text-muted-foreground"
                    aria-live="polite"
                  >
                    {idDocs.length} file(s) selected
                  </p>
                )}
              </div>
              {user?.role === "landlord" && (
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-card-foreground"
                    htmlFor="proofDocs"
                  >
                    Proof of Ownership (title deed, tax certificate)
                  </label>
                  <input
                    id="proofDocs"
                    name="proofDocs"
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleProofDocsChange}
                    className="w-full text-sm"
                    aria-required="true"
                  />
                  {proofDocs.length > 0 && (
                    <p
                      className="text-xs text-muted-foreground"
                      aria-live="polite"
                    >
                      {proofDocs.length} file(s) selected
                    </p>
                  )}
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                  aria-label="Submit verification"
                >
                  {submitting ? "Submitting..." : "Submit Verification"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={submitting}
                  aria-label="Reset form"
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {verification && (
        <Card
          className="bg-card border-border"
          aria-labelledby="uploaded-documents-heading"
        >
          <CardHeader>
            <CardTitle
              id="uploaded-documents-heading"
              className="text-lg font-semibold text-card-foreground"
            >
              Uploaded Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-medium text-card-foreground flex items-center gap-2">
                  <User className="h-4 w-4" aria-hidden="true" />
                  Identity Documents
                </h4>
                {verification.idDocuments.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    None uploaded.
                  </p>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  {verification.idDocuments.map((doc) => (
                    <div
                      key={doc.public_id}
                      className="flex items-center gap-3 p-3 border border-border rounded-lg bg-accent/5"
                    >
                      {getFileIcon(doc.label)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {doc.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded {formatDate(doc.uploadedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                          aria-label={`Download ${doc.label}`}
                        >
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" aria-hidden="true" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveDoc("idDocuments", doc)}
                          disabled={
                            removeLoading === doc.public_id ||
                            status === "approved"
                          }
                          aria-label={`Remove ${doc.label}`}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {verification.roleAtSubmission === "landlord" && (
                <div className="space-y-3">
                  <h4 className="font-medium text-card-foreground flex items-center gap-2">
                    <Building className="h-4 w-4" aria-hidden="true" />
                    Proof of Ownership
                  </h4>
                  {verification.proofOfOwnership.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      None uploaded.
                    </p>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {verification.proofOfOwnership.map((doc) => (
                      <div
                        key={doc.public_id}
                        className="flex items-center gap-3 p-3 border border-border rounded-lg bg-accent/5"
                      >
                        {getFileIcon(doc.label)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground truncate">
                            {doc.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                            aria-label={`Download ${doc.label}`}
                          >
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() =>
                              handleRemoveDoc("proofOfOwnership", doc)
                            }
                            disabled={
                              removeLoading === doc.public_id ||
                              status === "approved"
                            }
                            aria-label={`Remove ${doc.label}`}
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => router.push("/contact")}
                  aria-label="Contact support"
                >
                  Contact Support
                </Button>
                {status === "approved" && (
                  <Button
                    variant="outline"
                    aria-label="Start using landlord features"
                    onClick={() => router.push("/landlord")}
                  >
                    Go to Dashboard
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
export default Page;
