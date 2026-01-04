import { create } from "zustand";
import type {
  Property,
  PropertyFormData,
  PropertyUsage,
} from "../types/property";
import { propertyAPI } from "../api/property-client";

interface PropertyState {
  properties: Property[];
  verifiedProperties: Property[];
  myProperties: Property[];
  favorites: Property[];
  loading: boolean;
  error: string | null;
  usage: PropertyUsage | null;

  createProperty: (data: FormData) => Promise<void>;
  fetchAllProperties: () => Promise<void>;
  fetchVerifiedProperties: () => Promise<void>;
  fetchMyProperties: (landlordId: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  updateProperty: (
    id: string,
    data: Partial<PropertyFormData>
  ) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  addFavorite: (propertyId: string) => Promise<void>;
  removeFavorite: (propertyId: string) => Promise<void>;
  reportProperty: (propertyId: string, reason: string) => Promise<void>;
  clearError: () => void;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  verifiedProperties: [],
  myProperties: [],
  favorites: [],
  loading: false,
  error: null,
  usage: null,

  createProperty: async (data: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await propertyAPI.createProperty(data);
      set((state) => ({
        myProperties: [...state.myProperties, response.property!],
        usage: response.usage || state.usage,
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  fetchAllProperties: async () => {
    set({ loading: true, error: null });
    try {
      const response = await propertyAPI.getAllProperties();
      set({ properties: response.properties, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchVerifiedProperties: async () => {
    set({ loading: true, error: null });
    try {
      const response = await propertyAPI.getVerifiedProperties();
      set({ verifiedProperties: response.properties, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchMyProperties: async (landlordId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await propertyAPI.getLandlordProperties(landlordId);
      set({ myProperties: response.properties, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchFavorites: async () => {
    set({ loading: true, error: null });
    try {
      const response = await propertyAPI.getFavorites();
      set({ favorites: response.favourites, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  updateProperty: async (id: string, data: Partial<PropertyFormData>) => {
    set({ loading: true, error: null });
    try {
      await propertyAPI.updateProperty(id, data);
      set((state) => ({
        myProperties: state.myProperties.map((p) =>
          p._id === id ? { ...p, ...data } : p
        ),
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  deleteProperty: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await propertyAPI.deleteProperty(id);
      set((state) => ({
        myProperties: state.myProperties.filter((p) => p._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  addFavorite: async (propertyId: string) => {
    set({ error: null });
    try {
      await propertyAPI.addFavorite(propertyId);
      const state = get();
      const property = state.properties.find((p) => p._id === propertyId);
      if (property) {
        set((state) => ({
          favorites: [...state.favorites, property],
        }));
      }
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  removeFavorite: async (propertyId: string) => {
    set({ error: null });
    try {
      await propertyAPI.removeFavorite(propertyId);
      set((state) => ({
        favorites: state.favorites.filter((p) => p._id !== propertyId),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  reportProperty: async (propertyId: string, reason: string) => {
    set({ error: null });
    try {
      await propertyAPI.reportProperty(propertyId, reason);
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
