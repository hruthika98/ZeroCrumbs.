
export enum UserRole {
  DONOR = 'DONOR',
  NGO = 'NGO',
  ADMIN = 'ADMIN'
}

export enum FoodCategory {
  COOKED = 'Cooked Meals',
  BAKERY = 'Bakery & Sweets',
  PRODUCE = 'Fresh Produce',
  PACKAGED = 'Packaged Goods',
  DAIRY = 'Dairy & Eggs'
}

export enum FreshnessStatus {
  FRESH = 'Fresh',
  USE_SOON = 'Use Soon',
  URGENT = 'Urgent'
}

export enum ListingStatus {
  AVAILABLE = 'Available',
  CLAIMED = 'Claimed',
  COLLECTED = 'Collected',
  EXPIRED = 'Expired'
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  allergens: string[];
}

export interface FoodListing {
  id: string;
  name: string;
  category: FoodCategory;
  quantity: string;
  donorName: string;
  donorType: 'Restaurant' | 'Hotel' | 'Event' | 'Household';
  expiryDate: string;
  freshness: FreshnessStatus;
  status: ListingStatus;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  tags: string[];
  nutrition: NutritionInfo;
  imageUrl: string;
  createdAt: string;
  availableUntil: string;
  verified: boolean;
  otp?: string;
  claimedBy?: string;
  claimedAt?: string;
  collectedAt?: string;
}
