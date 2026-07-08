export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Tech Accessories' | 'Fashion Imports' | 'Home Goods';
  price: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
  featured: boolean;
  bestSeller: boolean;
  reviews: Review[];
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface OrderDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  paymentMethod: 'card' | 'paypal' | 'applepay';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  isGuest: boolean;
}

export interface FilterState {
  search: string;
  categories: string[];
  priceRange: [number, number];
  minRating: number;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating';
}
