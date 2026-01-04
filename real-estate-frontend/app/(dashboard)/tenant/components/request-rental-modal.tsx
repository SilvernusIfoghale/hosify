"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/app/components/ui/modal";
import { AlertCircle, Calendar, Loader2 } from "lucide-react";
import { addTenantHistory } from "@/app/api/tenant-client";

interface RequestRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  onSuccess?: () => void;
}

export function RequestRentalModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  onSuccess,
}: RequestRentalModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.startDate || !formData.endDate) {
      setError("Please select both start and end dates");
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (end <= start) {
      setError("End date must be after start date");
      return;
    }

    try {
      setLoading(true);
      const response = await addTenantHistory({
        propertyId,
        action: "rental_request",
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes || "Rental request from tenant",
      });

      if (response) {
        setFormData({ startDate: "", endDate: "", notes: "" });
        onSuccess?.();
        onClose();
        // Show success message
        alert("Rental request submitted successfully!");
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Failed to submit rental request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-[500px]">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Request to Rent
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Submit your rental request for{" "}
            <span className="font-semibold text-foreground">
              {propertyTitle}
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
          </Card>

          {/* Date Range Selection */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                min={today}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                min={formData.startDate || today}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Tell the landlord about yourself, move-in date flexibility, etc."
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
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
              ℹ️ Your rental request will be sent to the landlord. They will
              review and contact you if interested.
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
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
