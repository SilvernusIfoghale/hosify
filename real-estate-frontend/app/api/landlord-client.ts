import { apiClient } from "./api-client";

// ========== PROPERTY ENDPOINTS ==========

export interface PropertyListPayload {
  title: string;
  description: string;
  listingType: string;
  price: number;
  currency: string;
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    coordinate?: {
      lat: number;
      lng: number;
    };
  };
  features: {
    bedrooms?: number;
    bathrooms?: number;
    toilets?: number;
    parkingSpaces?: number;
    size?: number;
    yearBuilt?: number;
    furnishing?: string;
    amenities?: string;
    extras?: string;
  };
  contact: {
    listedBy?: string;
    contactName?: string;
    contactNumber?: number;
    contactEmail?: string;
    agency?: string;
  };
  ownership: string;
  propertyType: string;
  status: string;
  condition: string;
  blockNumber?: string;
}

export interface Property {
  _id: string;
  userId: string;
  title: string;
  description: string;
  listingType: string;
  propertyType: string;
  price: number;
  currency: string;
  blockNumber?: string;
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    coordinate?: {
      lat: number;
      lng: number;
    };
  };
  features: {
    bedrooms?: number;
    bathrooms?: number;
    toilets?: number;
    parkingSpaces?: number;
    size?: number;
    yearBuilt?: number;
    furnishing?: string;
    amenities?: string;
    extras?: string;
  };
  media: {
    images: Array<{
      url: string;
      public_id: string;
    }>;
    videos?: Array<{
      url: string;
      public_id: string;
    }>;
  };
  contact: {
    listedBy?: string;
    contactName?: string;
    contactNumber?: number;
    contactEmail?: string;
    agency?: string;
  };
  metadata: {
    dateListed: string;
    isVerified: boolean;
    views: number;
    status: string;
  };
  condition: string;
  status: string;
  ownership: string;
  createdAt: string;
  updatedAt: string;
}

// List a property
export const listProperty = async (formData: FormData) => {
  const response = await apiClient.post("/property/listings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Get landlord's properties
export const getLandlordProperties = async (landlordId: string) => {
  const response = await apiClient.get<{
    success: boolean;
    message: string;
    count: number;
    properties: Property[];
  }>(`/property/listings/${landlordId}/properties`);
  return response.data;
};

// View property by ID
export const viewPropertyById = async (id: string) => {
  const response = await apiClient.get<{
    success: boolean;
    message: string;
    property: Property;
  }>(`/property/listings/detail/${id}`);
  return response.data;
};

// Update property by ID
export const updatePropertyById = async (
  id: string,
  data: Partial<PropertyListPayload>
) => {
  const response = await apiClient.put(`/property/listings/update/${id}`, data);
  return response.data;
};

// Delete property by ID
export const deletePropertyById = async (id: string) => {
  const response = await apiClient.delete(`/property/listings/delete/${id}`);
  return response.data;
};

// ========== VERIFICATION ENDPOINTS ==========

export interface VerificationDocument {
  label: string;
  url: string;
  public_id: string;
  uploadedAt: string;
}

export interface Verification {
  _id: string;
  user: string;
  roleAtSubmission: "tenant" | "landlord";
  idType: "passport" | "national_id" | "driver_license" | "voter_card";
  idDocuments: VerificationDocument[];
  proofOfOwnership: VerificationDocument[];
  status: "none" | "pending" | "approved" | "rejected";
  notes?: string;
  reviewer?: string;
  submittedAt: string;
  reviewedAt?: string;
}

// Submit verification
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

// Get my verification status
export const getMyVerification = async () => {
  const response = await apiClient.get<{
    verification: Verification | null;
  }>("/verification/me");
  return response.data;
};

// Delete verification document
export const deleteVerificationDocument = async (
  verificationId: string,
  section: "idDocuments" | "proofOfOwnership",
  public_id: string
) => {
  const response = await apiClient.delete(
    `/verification/${verificationId}/document`,
    {
      data: { section, public_id },
    }
  );
  return response.data;
};

// ========== HISTORY ENDPOINTS ==========

export interface History {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  propertyId: {
    _id: string;
    title: string;
    location: {
      address?: string;
      city?: string;
      state?: string;
    };
  };
  action: string;
  startDate: string;
  endDate?: string;
  notes: string;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

// Get user history
export const getUserHistory = async () => {
  const response = await apiClient.get<{
    success: boolean;
    history: History[];
  }>("/history");
  return response.data;
};

// Get history by ID
export const getHistoryById = async (historyId: string) => {
  const response = await apiClient.get<History>(`/history/${historyId}`);
  return response.data;
};

// Add history
export const addHistory = async (data: {
  userId: string;
  propertyId: string;
  action: string;
  startDate?: string;
  endDate?: string;
  notes: string;
}) => {
  const response = await apiClient.post<History>("/history", data);
  return response.data;
};

// ========== REVIEWS ENDPOINTS ==========

export interface Review {
  _id: string;
  reviewer: {
    _id: string;
    username: string;
  };
  reviewee: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Add landlord review
export const addLandlordReview = async (
  landlordId: string,
  data: { rating: number; comment: string }
) => {
  const response = await apiClient.post<Review>(
    `/reviews/landlord/${landlordId}`,
    data
  );
  return response.data;
};

// Get landlord reviews
export const getLandlordReviews = async (landlordId: string) => {
  const response = await apiClient.get<Review[]>(
    `/reviews/landlord/${landlordId}`
  );
  return response.data;
};

// Get review by ID
export const getReviewById = async (reviewId: string) => {
  const response = await apiClient.get<Review>(`/reviews/${reviewId}`);
  return response.data;
};

// Add tenant review (from landlord)
export const addTenantReview = async (
  tenantId: string,
  data: { rating: number; comment: string }
) => {
  const response = await apiClient.post<Review>(
    `/reviews/tenant/${tenantId}`,
    data
  );
  return response.data;
};

// ========== FAVORITES ENDPOINTS ==========

// Add favorite
export const addFavorite = async (propertyId: string) => {
  const response = await apiClient.post(
    `/property/listings/${propertyId}/favourite`
  );
  return response.data;
};

// Remove favorite
export const removeFavorite = async (propertyId: string) => {
  const response = await apiClient.delete(
    `/property/listings/${propertyId}/favourite`
  );
  return response.data;
};

// Get favorites
export const getFavorites = async () => {
  const response = await apiClient.get<{
    success: boolean;
    message: string;
    count: number;
    favourites: Property[];
  }>("/property/listings/favourite");
  return response.data;
};

// ========== REPORTS ENDPOINTS ==========

export interface Report {
  _id: string;
  reporter: string;
  property: string;
  reason: string;
  createdAt: string;
}

// Report property
export const reportProperty = async (propertyId: string, reason: string) => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    newReport: Report;
  }>(`/property/report/${propertyId}`, { reason });
  return response.data;
};

// Get my reports
export const getMyReports = async (userId: string) => {
  const response = await apiClient.get<{
    success: boolean;
    message: string;
    reports: Report[];
  }>(`/property/reports/${userId}`);
  return response.data;
};

// ========== STATISTICS HELPERS ==========

// Calculate landlord statistics from properties
export const calculateLandlordStats = (properties: Property[]) => {
  const totalProperties = properties.length;
  const activeProperties = properties.filter(
    (p) => p.metadata.status === "active"
  ).length;
  const rentedProperties = properties.filter(
    (p) => p.status === "rented"
  ).length;
  const totalViews = properties.reduce(
    (sum, p) => sum + (p.metadata.views || 0),
    0
  );
  const totalRevenue = properties
    .filter((p) => p.status === "rented")
    .reduce((sum, p) => sum + p.price, 0);

  const occupancyRate =
    totalProperties > 0 ? (rentedProperties / totalProperties) * 100 : 0;

  return {
    totalProperties,
    activeProperties,
    rentedProperties,
    totalViews,
    totalRevenue,
    occupancyRate: Math.round(occupancyRate),
  };
};
