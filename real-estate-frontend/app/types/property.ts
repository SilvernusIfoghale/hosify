export interface PropertyLocation {
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  coordinate?: {
    lat: number;
    lng: number;
  };
}

export interface PropertyFeatures {
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  parkingSpaces?: number;
  size?: number;
  yearBuilt?: number | string;
  furnishing?: string;
  amenities?: string;
  extras?: string;
}

export interface PropertyContact {
  listedBy?: string;
  contactName?: string;
  contactNumber?: string;
  contactEmail?: string;
  agency?: string;
}

export interface MediaItem {
  url: string;
  public_id: string;
}

export interface PropertyMedia {
  images?: MediaItem[];
  videos?: MediaItem[];
}

export interface PropertyMetadata {
  dateListed: Date;
  isVerified?: boolean;
  isFeatured?: boolean;
  views?: number;
  status: string;
}

export interface Property {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  listingType: "sale" | "rent";
  propertyType: string;
  price: number;
  currency: string;
  lat: number;
  lng: number;
  location: PropertyLocation;
  features: PropertyFeatures;
  media: PropertyMedia;
  contact: PropertyContact;
  condition: "new" | "old" | "uncompleted";
  status: "available" | "negotiation" | "rented" | "unavailable";
  ownership: "agent" | "helper" | "owner";
  blockNumber?: string;
  propertyLimit?: number;
  metadata?: PropertyMetadata;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PropertyFormData {
  title: string;
  description: string;
  listingType: "sale" | "rent";
  propertyType: string;
  price: number;
  currency: string;
  lat?: number;
  lng?: number;
  location: PropertyLocation;
  features: PropertyFeatures;
  contact: PropertyContact;
  condition: "new" | "old" | "uncompleted";
  status: "available" | "negotiation" | "rented" | "unavailable";
  ownership: "agent" | "helper" | "owner";
  blockNumber?: string;
  isFeatured?: boolean;
  useManualPushUp?: boolean;
  useSocialMediaAd?: boolean;
  images?: File[];
  videos?: File[];
}

export interface PropertyResponse {
  success: boolean;
  message: string;
  property?: Property;
  usage?: PropertyUsage;
}

export interface AllPropertiesResponse {
  success: boolean;
  message: string;
  count: number;
  properties: Property[];
}

export interface FavouriteResponse {
  success: boolean;
  message: string;
}

export interface PropertyUsage {
  listingsCreated: number;
  limit: number;
  manualPushUpsUsed: number;
  manualPushUpsLimit: number;
  featuredListingsUsed: number;
  featuredListingsLimit: number;
  socialMediaAdsUsed: number;
  socialMediaAdsLimit: number;
}
