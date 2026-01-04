import { apiClient } from "./api-client";

// Helper function to get auth headers
const getAuthHeaders = async () => {
  if (typeof window !== "undefined") {
    try {
      const { useAuthStore } = await import("../store/authStore");
      const token = useAuthStore.getState().token;
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  }
  return {};
};

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  kycStatus: string;
  accountStatus?: string;
}

export interface Verification {
  _id: string;
  user: User;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  reviewedAt?: Date;
  notes?: string;
  idType: string;
  idDocuments: { label: string; url: string; public_id: string }[];
  proofOfOwnership?: { label: string; url: string; public_id: string }[];
  roleAtSubmission: string;
}

export interface Property {
  _id: string;
  title?: string;
  description?: string;
  listingType?: string;
  propertyType?: string;
  price?: number;
  currency?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    coordinate?: {
      lat: number;
      lng: number;
    };
  };
  features?: {
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
  media?: {
    images?: Array<{
      url: string;
      public_id: string;
    }>;
    videos?: Array<{
      url: string;
      public_id: string;
    }>;
  };
  contact?: {
    phone?: string;
    email?: string;
  };
  metadata?: {
    views?: number;
    isVerified?: boolean;
  };
  condition?: string;
  ownership?: string;
  status?: string;
  userId?: {
    name?: string;
    email?: string;
  };
  landlord?: {
    name?: string;
    email?: string;
  };
  createdAt?: string;
  [key: string]: unknown; // Allow additional properties
}

export interface Report {
  _id: string;
  property: Property;
  reporter: User;
  reason: string;
  createdAt: Date;
}

export interface Analytics {
  totalUsers: number;
  totalListings: number;
  approvedListings: number;
  pendingListings: number;
  totalReports: number;
}

export const adminAPI = {
  // Get analytics data
  async getAnalytics(): Promise<{ success: boolean; data: Analytics }> {
    const response = await apiClient.get("/admin/analytics", {
      headers: await getAuthHeaders(),
    });

    let analyticsData: Analytics;

    // Handle array format (legacy/production backend)
    if (Array.isArray(response.data.data)) {
      const [
        totalUsers,
        totalListings,
        approvedListings,
        pendingListings,
        totalReports,
      ] = response.data.data;
      analyticsData = {
        totalUsers: Number(totalUsers) || 0,
        totalListings: Number(totalListings) || 0,
        approvedListings: Number(approvedListings) || 0,
        pendingListings: Number(pendingListings) || 0,
        totalReports: Number(totalReports) || 0,
      };
    }
    // Handle object format (new/local backend)
    else {
      analyticsData = {
        totalUsers: response.data.totalUsers || 0,
        totalListings: response.data.totalListings || 0,
        approvedListings: response.data.approvedListings || 0,
        pendingListings: response.data.pendingListings || 0,
        totalReports: response.data.totalReports || 0,
      };
    }

    return {
      success: response.data.success,
      data: analyticsData,
    };
  },

  async getUsersWithVerificationStatus(): Promise<{
    success: boolean;
    totalUsers: number;
    verifiedUsers: number;
    users: (User & {
      verification: {
        _id: string;
        status: string;
        idType: string;
        roleAtSubmission: string;
        submittedAt: Date;
        reviewedAt?: Date;
        notes?: string;
      } | null;
    })[];
  }> {
    const response = await apiClient.get("/admin/users/verification-status", {
      headers: await getAuthHeaders(),
    });
    return response.data;
  },

  async suspendUser(
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put(
      `/admin/users/${userId}/suspend`,
      {},
      {
        headers: await getAuthHeaders(),
      }
    );
    return response.data;
  },

  async verifyUser(
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put(
      `/admin/users/${userId}/verify`,
      {},
      {
        headers: await getAuthHeaders(),
      }
    );
    return response.data;
  },

  async deleteUser(
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/admin/users/${userId}`, {
      headers: await getAuthHeaders(),
    });
    return response.data;
  },

  // Verifications management
  async listVerifications(
    status?: "pending" | "approved" | "rejected"
  ): Promise<{ success: boolean; items: Verification[] }> {
    const params = status ? { status } : {};
    const response = await apiClient.get("/admin/verification", {
      params,
      headers: await getAuthHeaders(),
    });
    return response.data;
  },

  async reviewVerification(
    id: string,
    action: "approve" | "reject",
    note?: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(
      `/admin/verification/${id}/review`,
      {
        action,
        note,
      },
      {
        headers: await getAuthHeaders(),
      }
    );
    return response.data;
  },

  // Listings management
  async getAllListings(): Promise<{
    success: boolean;
    properties: Property[];
  }> {
    const response = await apiClient.get("/admin/listings", {
      headers: await getAuthHeaders(),
    });
    // Handle backend response format
    const data = response.data;
    if (data.success && data.property) {
      return { success: true, properties: data.property };
    }
    return { success: false, properties: [] };
  },

  async getPendingListings(): Promise<{
    success: boolean;
    properties: Property[];
  }> {
    const response = await apiClient.get("/admin/listings/pending", {
      headers: await getAuthHeaders(),
    });
    return response.data;
  },

  async approveListing(
    listingId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put(
      `/admin/listings/${listingId}/approve`,
      {},
      {
        headers: await getAuthHeaders(),
      }
    );
    return response.data;
  },

  async rejectListing(
    listingId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put(
      `/admin/listings/${listingId}/reject`,
      {},
      {
        headers: await getAuthHeaders(),
      }
    );
    return response.data;
  },

  // Reports
  async getReports(): Promise<{ success: boolean; reports: Report[] }> {
    const response = await apiClient.get("/admin/reports", {
      headers: await getAuthHeaders(),
    });
    return response.data;
  },
};
