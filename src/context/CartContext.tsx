import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuItem, CartItem, Order, Review, ViewType } from '../types.ts';
import { MENU_ITEMS } from '../data/menu.ts';
import { REVIEWS_DATA } from '../data/reviews.ts';
import {
  fetchProductsFromBackend,
  fetchReviewsFromBackend,
  saveOrderToBackend,
  isSupabaseConfigured
} from '../lib/supabase.ts';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: MenuItem, quantity?: number, selectedSpice?: string, notes?: string) => void;
  removeFromCart: (itemId: string, selectedSpice?: string) => void;
  updateQuantity: (itemId: string, delta: number, selectedSpice?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  applyPromo: (code: string) => boolean;
  promoCode: string;
  promoApplied: boolean;
  total: number;
  toastMessage: string | null;
  dismissToast: () => void;

  // View state & Routing
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;

  // Backend Products & Reviews state
  products: MenuItem[];
  reviews: Review[];
  isLoadingProducts: boolean;
  isLoadingReviews: boolean;
  productsError: string | null;
  reviewsError: string | null;
  dataSource: 'database' | 'fallback';
  refreshProducts: () => Promise<void>;
  refreshReviews: () => Promise<void>;
  isSupabaseConnected: boolean;

  // Orders
  activeOrder: Order | null;
  placeOrder: (orderDetails: {
    customerName: string;
    phone: string;
    deliveryAddress: string;
    orderNotes?: string;
    paymentMethod: 'cod' | 'card_delivery' | 'online_card';
  }) => Promise<Order>;
  clearActiveOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'hotnroll_cart_items_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent cart from localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    // Default starter item
    return [
      {
        item: MENU_ITEMS[0],
        quantity: 1,
        selectedSpice: 'Mild',
      },
    ];
  });

  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Dynamic Backend state
  const [products, setProducts] = useState<MenuItem[]>(MENU_ITEMS);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS_DATA);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'database' | 'fallback'>('database');

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const savedOrder = localStorage.getItem('hotnroll_active_order');
      return savedOrder ? JSON.parse(savedOrder) : null;
    } catch {
      return null;
    }
  });

  // Fetch dynamic products from backend/Supabase
  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    setProductsError(null);
    try {
      const result = await fetchProductsFromBackend();
      setProducts(result.products);
      setDataSource(result.source);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setProductsError('Unable to sync live products from database. Showing verified kitchen menu.');
      setProducts(MENU_ITEMS);
      setDataSource('fallback');
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Fetch dynamic reviews from backend/Supabase
  const loadReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    setReviewsError(null);
    try {
      const result = await fetchReviewsFromBackend();
      setReviews(result.reviews);
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setReviewsError('Unable to load latest customer reviews.');
      setReviews(REVIEWS_DATA);
    } finally {
      setIsLoadingReviews(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadReviews();
  }, [loadProducts, loadReviews]);

  // Save items to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Save active order to localStorage
  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem('hotnroll_active_order', JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem('hotnroll_active_order');
      }
    } catch {
      // ignore
    }
  }, [activeOrder]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const dismissToast = () => setToastMessage(null);

  const addToCart = (
    item: MenuItem,
    quantity = 1,
    selectedSpice?: string,
    notes = ''
  ) => {
    const spice = selectedSpice || item.spiceLevel || 'Mild';
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.item.id === item.id && ci.selectedSpice === spice
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          notes: notes ? notes : next[existingIndex].notes,
        };
        return next;
      } else {
        return [...prev, { item, quantity, selectedSpice: spice, notes }];
      }
    });
    setToastMessage(`Added ${quantity}x "${item.name}" to order.`);
  };

  const removeFromCart = (itemId: string, selectedSpice?: string) => {
    setItems((prev) =>
      prev.filter((ci) => {
        if (selectedSpice) {
          return !(ci.item.id === itemId && ci.selectedSpice === selectedSpice);
        }
        return ci.item.id !== itemId;
      })
    );
  };

  const updateQuantity = (itemId: string, delta: number, selectedSpice?: string) => {
    setItems((prev) =>
      prev
        .map((ci) => {
          const match =
            selectedSpice ? ci.item.id === itemId && ci.selectedSpice === selectedSpice : ci.item.id === itemId;
          if (match) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter((ci): ci is CartItem => ci !== null)
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'HOT10' || clean === 'EMBER' || clean === 'ROLL2026') {
      setPromoCode(clean);
      setPromoApplied(true);
      return true;
    }
    return false;
  };

  // Calculations
  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = Number(
    items.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0).toFixed(2)
  );
  // Free delivery above Rs. 2,000, else Rs. 150
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 2000 ? 0 : 150;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = subtotal === 0 ? 0 : Math.round(taxableAmount * 0.05);
  const total = Math.round(taxableAmount + (subtotal > 0 ? deliveryFee : 0) + tax);

  const placeOrder = async (details: {
    customerName: string;
    phone: string;
    deliveryAddress: string;
    orderNotes?: string;
    paymentMethod: 'cod' | 'card_delivery' | 'online_card';
  }): Promise<Order> => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      orderNumber: `HNR-${randomNum}`,
      items: [...items],
      customerName: details.customerName,
      phone: details.phone,
      deliveryAddress: details.deliveryAddress,
      orderNotes: details.orderNotes,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      paymentMethod: details.paymentMethod,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedMinutes: 28,
      status: 'received',
    };

    // Save to Database (Cloud SQL / Supabase)
    try {
      await saveOrderToBackend(newOrder, items);
    } catch (err) {
      console.error('Database order persistence encountered an error, client session maintained:', err);
    }

    setActiveOrder(newOrder);
    clearCart();
    setCurrentView('order-success');
    closeCart();
    return newOrder;
  };

  const clearActiveOrder = () => {
    setActiveOrder(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        tax,
        discount,
        applyPromo,
        promoCode,
        promoApplied,
        total,
        toastMessage,
        dismissToast,
        currentView,
        setCurrentView,
        products,
        reviews,
        isLoadingProducts,
        isLoadingReviews,
        productsError,
        reviewsError,
        dataSource,
        refreshProducts: loadProducts,
        refreshReviews: loadReviews,
        isSupabaseConnected: isSupabaseConfigured,
        activeOrder,
        placeOrder,
        clearActiveOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
