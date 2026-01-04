"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/app/components/ui/modal";
import { AlertCircle, Star, Loader2 } from "lucide-react";
import { addTenantReview } from "@/app/api/tenant-client";

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  landlordId: string;
  landlordName: string;
  propertyTitle: string;
  onSuccess?: () => void;
}

export function LeaveReviewModal({
  isOpen,
  onClose,
  landlordId,
  landlordName,
  propertyTitle,
  onSuccess,
}: LeaveReviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.comment.trim()) {
      setError("Please write a review comment");
      return;
    }

    if (formData.comment.trim().length < 10) {
      setError("Review comment must be at least 10 characters long");
      return;
    }

    try {
      setLoading(true);
      const response = await addTenantReview(landlordId, {
        rating: formData.rating,
        comment: formData.comment,
      });

      if (response) {
        setFormData({ rating: 5, comment: "" });
        onSuccess?.();
        onClose();
        // Show success message
        alert("Review submitted successfully!");
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-[500px]">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Leave a Review</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Share your experience with{" "}
            <span className="font-semibold text-foreground">
              {landlordName}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Summary */}
          <Card className="p-4 bg-muted/50 border-border">
            <p className="text-sm text-muted-foreground">Property</p>
            <p className="font-semibold text-foreground truncate">
              {propertyTitle}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Landlord: {landlordName}
            </p>
          </Card>

          {/* Rating Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground block">
              Your Rating
            </label>
            <div className="flex gap-2 justify-center py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || formData.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {ratingLabels[formData.rating as keyof typeof ratingLabels]}
            </p>
          </div>

          {/* Review Comment */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Your Review
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              placeholder="Describe your experience living in this property, interactions with the landlord, maintenance, etc."
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={4}
              maxLength={500}
              required
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {formData.comment.length}/500
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Info Message */}
          <Card className="p-3 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900">
              ℹ️ Your review will help other tenants make informed decisions.
              Please be honest and respectful.
            </p>
          </Card>

          {/* Buttons */}
          <div className="flex gap-3 justify-end border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
