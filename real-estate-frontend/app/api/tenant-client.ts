import { apiClient } from "./api-client";
import { Property, History, Review, Verification } from "./landlord-client";

export type { Property, Review, Verification };

// ========== TENANT FAVORITES/RENTALS ENDPOINTS ==========

// Get tenant's favorited properties
export const getTenantFavorites = async () => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      count: number;
      favourites: Property[];
    }>("/property/listings/favourite");
    return response.data;
  } catch {
    // Fallback if endpoint doesn't exist
    console.warn(
      "Favorites endpoint not available, returning default response"
    );
    return {
      success: true,
      message: "No favorites",
      count: 0,
      favourites: [],
    };
  }
};

// Add property to favorites
export const addTenantFavorite = async (propertyId: string) => {
  const response = await apiClient.post(
    `/property/listings/${propertyId}/favourite`
  );
  return response.data;
};

// Remove property from favorites
export const removeTenantFavorite = async (propertyId: string) => {
  const response = await apiClient.delete(
    `/property/listings/${propertyId}/favourite`
  );
  return response.data;
};

// ========== TENANT HISTORY/RENTALS ENDPOINTS ==========

// Get all tenant history
export const getTenantHistory = async () => {
  const response = await apiClient.get<{
    success: boolean;
    history: History[];
  }>("/history");
  return response.data;
};

// Get specific history entry
export const getTenantHistoryById = async (historyId: string) => {
  const response = await apiClient.get<History>(`/history/${historyId}`);
  return response.data;
};

// Add history entry for tenant
export const addTenantHistory = async (data: {
  propertyId: string;
  action: string;
  startDate?: string;
  endDate?: string;
  notes: string;
}) => {
  const response = await apiClient.post<History>("/history", data);
  return response.data;
};

// ========== VERIFICATION ENDPOINTS (shared with landlord) ==========

// Get my verification status
export const getMyVerification = async () => {
  const response = await apiClient.get<{
    verification: Verification | null;
  }>("/verification/me");
  return response.data;
};

// Submit verification documents
export const submitVerification = async (formData: FormData) => {
  const response = await apiClient.post<{
    message: string;
    verification: Verification;
  }>("/verification/submit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete a verification document
export const deleteVerificationDocument = async (
  verificationId: string,
  section: "idDocuments" | "proofOfOwnership",
  publicId: string
) => {
  const response = await apiClient.delete<{
    message: string;
    verification: Verification;
  }>(`/verification/${verificationId}/document`, {
    data: { section, public_id: publicId },
  });
  return response.data;
};

// ========== TENANT REVIEWS ENDPOINTS ==========

// Get reviews for a tenant
export const getTenantReviews = async (tenantId: string) => {
  const response = await apiClient.get<Review[]>(`/reviews/tenant/${tenantId}`);
  return response.data;
};

// Add review from landlord to tenant
export const addTenantReview = async (
  tenantId: string,
  data: { rating: number; comment: string }
) => {
  const response = await apiClient.post(`/reviews/tenant/${tenantId}`, data);
  return response.data;
};

// ========== TENANT STATISTICS HELPERS ==========

// Calculate tenant statistics from history and reviews
export interface TenantStats {
  totalRentals: number;
  activeRentals: number;
  completedRentals: number;
  averageRating: number;
  totalReviews: number;
  savedProperties: number;
}

export const calculateTenantStats = (
  history: History[],
  reviews: Review[],
  favorites: Property[]
): TenantStats => {
  const totalRentals = history.length;
  const activeRentals = history.filter((h) => h.status === "active").length;
  const completedRentals = history.filter(
    (h) => h.status === "archived"
  ).length;

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const savedProperties = favorites.length;

  return {
    totalRentals,
    activeRentals,
    completedRentals,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    savedProperties,
  };
};

// Get active rental details
export const getActiveTenantRental = async () => {
  try {
    const historyResponse = await getTenantHistory();
    if (historyResponse.success && historyResponse.history.length > 0) {
      const activeRental = historyResponse.history.find(
        (h) => h.status === "active"
      );
      return activeRental || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching active rental:", error);
    return null;
  }
};
