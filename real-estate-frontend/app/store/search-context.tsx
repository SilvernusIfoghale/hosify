import React, { createContext, useContext, useState, ReactNode } from "react";

export interface SearchFilters {
  title: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  listingType: string;
}

interface SearchContextType {
  filters: SearchFilters;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const initialFilters: SearchFilters = {
  title: "",
  city: "",
  minPrice: "",
  maxPrice: "",
  propertyType: "",
  listingType: "",
};

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <SearchContext.Provider value={{ filters, updateFilters, resetFilters }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
};
