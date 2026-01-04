import type {
  Property,
  PropertyFormData,
  PropertyResponse,
  AllPropertiesResponse,
  FavouriteResponse,
} from "../types/property";
import { apiClient } from "./api-client";

export const propertyAPI = {
  // List a new property
  async createProperty(data: FormData): Promise<PropertyResponse> {
    const response = await apiClient.post("/property/listings", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get all properties (if endpoint exists)
  async getAllProperties(): Promise<AllPropertiesResponse> {
    const response = await apiClient.get("/property/all");
    return response.data;
  },

  // Get verified properties
  async getVerifiedProperties(): Promise<AllPropertiesResponse> {
    const response = await apiClient.get("/property/verified");
    return response.data;
  },

  // Get property by ID
  async getPropertyById(
    id: string
  ): Promise<{ success: boolean; property: Property }> {
    const response = await apiClient.get(`/property/listings/detail/${id}`);
    return response.data;
  },

  // Get landlord's properties
  async getLandlordProperties(
    landlordId: string
  ): Promise<AllPropertiesResponse> {
    const response = await apiClient.get(
      `/property/listings/${landlordId}/properties`
    );
    return response.data;
  },

  // Update property
  async updateProperty(
    id: string,
    data: Partial<PropertyFormData>
  ): Promise<PropertyResponse> {
    const response = await apiClient.put(
      `/property/listings/update/${id}`,
      data
    );
    return response.data;
  },

  // Delete property
  async deleteProperty(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/property/listings/delete/${id}`);
    return response.data;
  },

  // Add to favorites
  async addFavorite(propertyId: string): Promise<FavouriteResponse> {
    const response = await apiClient.post(
      `/property/listings/${propertyId}/favourite`
    );
    return response.data;
  },

  // Remove from favorites
  async removeFavorite(propertyId: string): Promise<FavouriteResponse> {
    const response = await apiClient.delete(
      `/property/listings/${propertyId}/favourite`
    );
    return response.data;
  },

  // Get user's favorites
  async getFavorites(): Promise<{
    success: boolean;
    favourites: Property[];
    count: number;
    message: string;
  }> {
    const response = await apiClient.get("/property/listings/favourite");
    return response.data;
  },

  // Report property
  async reportProperty(
    propertyId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(`/property/report/${propertyId}`, {
      reason,
    });
    return response.data;
  },
};
