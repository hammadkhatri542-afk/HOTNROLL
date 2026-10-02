export type Category =
  | 'all'
  | 'burgers'
  | 'rolls'
  | 'pizza'
  | 'fries'
  | 'chicken'
  | 'drinks'
  | 'deals';

export interface MenuItem {
  id: string;
  name: string;
  category: 'burgers' | 'rolls' | 'pizza' | 'fries' | 'chicken' | 'drinks' | 'deals';
  price: number;
  description: string;
  image: string;
  rating: number;
  ratingCount: number;
  badge?: string;
  calories?: number;
  prepTime?: string;
  ingredients: string[];
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Flame';
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedSpice?: string;
  notes?: string;
}

export interface Order {
  orderNumber: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  deliveryAddress: string;
  orderNotes?: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cod' | 'card_delivery' | 'online_card';
  createdAt: string;
  estimatedMinutes: number;
  status: 'received' | 'grilling' | 'out_for_delivery' | 'delivered';
  assignedRiderId?: string;
  assignedRiderName?: string;
  assignedRiderPhone?: string;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'available' | 'delivering' | 'offline';
  activeOrdersCount: number;
  totalDelivered: number;
  rating: number;
  joinedDate?: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  avatarText: string;
  rating: number;
  date: string;
  comment: string;
  favoriteDish: string;
}

export type ViewType = 'home' | 'menu' | 'cart' | 'checkout' | 'order-success';
