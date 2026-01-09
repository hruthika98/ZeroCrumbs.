
import { FoodCategory, FreshnessStatus, FoodListing, ListingStatus } from './types';

export const MOCK_LISTINGS: FoodListing[] = [
  {
    id: '1',
    name: 'Gourmet Vegetable Lasagna',
    category: FoodCategory.COOKED,
    quantity: '12 Large Servings',
    donorName: 'Olive Garden Bistro',
    donorType: 'Restaurant',
    status: ListingStatus.AVAILABLE,
    expiryDate: new Date(Date.now() + 4 * 3600000).toISOString(),
    freshness: FreshnessStatus.URGENT,
    location: { address: '452 Broadway, NY', lat: 40.7128, lng: -74.0060 },
    tags: ['Veg', 'Contains Dairy'],
    nutrition: { calories: 380, protein: 18, carbs: 45, fats: 14, allergens: ['Dairy', 'Gluten'] },
    imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
    availableUntil: 'Today 10:00 PM',
    verified: true
  },
  {
    id: '2',
    name: 'Assorted Sourdough Loaves',
    category: FoodCategory.BAKERY,
    quantity: '8 Loaves',
    donorName: 'Hearth & Stone Bakery',
    donorType: 'Restaurant',
    status: ListingStatus.AVAILABLE,
    expiryDate: new Date(Date.now() + 24 * 3600000).toISOString(),
    freshness: FreshnessStatus.FRESH,
    location: { address: '12 Bakery Ln, Brooklyn', lat: 40.7306, lng: -73.9352 },
    tags: ['Vegan', 'Soy-Free'],
    nutrition: { calories: 220, protein: 8, carbs: 40, fats: 2, allergens: ['Gluten'] },
    imageUrl: 'https://images.unsplash.com/photo-1585478259715-876a6a81b494?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
    availableUntil: 'Tomorrow 9:00 AM',
    verified: true
  },
  {
    id: '3',
    name: 'Fresh Garden Salad Mix',
    category: FoodCategory.PRODUCE,
    quantity: '5 Large Bowls',
    donorName: 'Green Leaf Hotel',
    donorType: 'Hotel',
    status: ListingStatus.AVAILABLE,
    expiryDate: new Date(Date.now() + 8 * 3600000).toISOString(),
    freshness: FreshnessStatus.USE_SOON,
    location: { address: 'Grand Central Plaza', lat: 40.7589, lng: -73.9851 },
    tags: ['Vegan', 'Gluten-Free'],
    nutrition: { calories: 120, protein: 4, carbs: 12, fats: 6, allergens: [] },
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
    availableUntil: 'Today 11:30 PM',
    verified: true
  }
];

export const IMPACT_MOCK = {
  mealsSaved: 14280,
  co2Reduced: 3840,
  waterSaved: 920000,
  peopleServed: 5600
};
