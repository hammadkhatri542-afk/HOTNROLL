import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  MessageSquare,
  LogOut,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  X,
  Eye,
  Star,
  Layers,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Phone,
  MapPin,
  FileText,
  Bike,
  Navigation,
  UserCheck
} from 'lucide-react';
import {
  getAdminStats,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  updateAdminOrderStatus,
  getAdminReviews,
  deleteAdminReview,
  getAdminRiders,
  createAdminRider,
  updateAdminRider,
  deleteAdminRider,
  assignAdminRiderToOrder,
  logoutAdmin,
} from '../../lib/adminApi';
import { Rider } from '../../types';

import burgerImg from '../../assets/images/hero_signature_burger_1790345746043.jpg';
import rollImg from '../../assets/images/product_gourmet_roll_1790345761717.jpg';
import pizzaImg from '../../assets/images/product_woodfired_pizza_1790345778311.jpg';
import friesImg from '../../assets/images/product_parmesan_fries_1790345791315.jpg';
import drinkImg from '../../assets/images/product_craft_drink_1790345810667.jpg';
import chickenImg from '../../assets/images/product_crispy_chicken_1790346501063.jpg';
import comboDealImg from '../../assets/images/product_combo_deal_1790346520852.jpg';

interface AdminDashboardProps {
  onLogout: () => void;
  onExitToSite: () => void;
}

type TabType = 'overview' | 'orders' | 'products' | 'reviews' | 'riders';

const CATEGORIES = [
  { value: 'burgers', label: 'Burgers', image: burgerImg },
  { value: 'rolls', label: 'Rolls', image: rollImg },
  { value: 'pizza', label: 'Pizza', image: pizzaImg },
  { value: 'fries', label: 'Fries', image: friesImg },
  { value: 'chicken', label: 'Chicken', image: chickenImg },
  { value: 'drinks', label: 'Drinks', image: drinkImg },
  { value: 'deals', label: 'Deals', image: comboDealImg },
];

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onExitToSite }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [riderSearch, setRiderSearch] = useState('');
  const [riderStatusFilter, setRiderStatusFilter] = useState<'all' | 'available' | 'delivering' | 'offline'>('all');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    category: 'burgers',
    price: '',
    imageUrl: burgerImg,
    rating: '4.8',
    isAvailable: true,
  });

  // Rider Modal
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [editingRider, setEditingRider] = useState<Rider | null>(null);
  const [riderFormData, setRiderFormData] = useState<{
    name: string;
    phone: string;
    vehicle: string;
    status: 'available' | 'delivering' | 'offline';
  }>({
    name: '',
    phone: '',
    vehicle: '',
    status: 'available',
  });

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'product' | 'review' | 'rider';
    id: string | number;
    title: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch all dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      const [statsRes, productsRes, ordersRes, reviewsRes, ridersRes] = await Promise.all([
        getAdminStats().catch(() => null),
        getAdminProducts().catch(() => []),
        getAdminOrders().catch(() => []),
        getAdminReviews().catch(() => []),
        getAdminRiders().catch(() => []),
      ]);

      if (statsRes) setStats(statsRes);
      if (productsRes) setProducts(productsRes);
      if (ordersRes) setOrders(ordersRes);
      if (reviewsRes) setReviews(reviewsRes);
      if (ridersRes) setRiders(ridersRes);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      showToast('Error syncing administrative data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
  };

  const handleLogoutClick = async () => {
    await logoutAdmin();
    onLogout();
  };

  // -------------------------------------------------------------
  // Product Operations
  // -------------------------------------------------------------
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      description: '',
      category: 'burgers',
      price: '',
      imageUrl: burgerImg,
      rating: '4.8',
      isAvailable: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      description: prod.description || '',
      category: prod.category,
      price: String(prod.price),
      imageUrl: prod.imageUrl,
      rating: String(prod.rating || '4.8'),
      isAvailable: Boolean(prod.isAvailable),
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(productFormData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('Please enter a valid product price.');
      return;
    }

    try {
      if (editingProduct) {
        // Update product
        const updated = await updateAdminProduct(editingProduct.id, {
          name: productFormData.name,
          description: productFormData.description,
          category: productFormData.category,
          price: priceNum,
          imageUrl: productFormData.imageUrl,
          rating: parseFloat(productFormData.rating) || 4.8,
          isAvailable: productFormData.isAvailable,
        });
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updated : p))
        );
        showToast(`Updated "${productFormData.name}" successfully.`);
      } else {
        // Create product
        const created = await createAdminProduct({
          name: productFormData.name,
          description: productFormData.description,
          category: productFormData.category,
          price: priceNum,
          imageUrl: productFormData.imageUrl,
          rating: parseFloat(productFormData.rating) || 4.8,
          isAvailable: productFormData.isAvailable,
        });
        setProducts((prev) => [created, ...prev]);
        showToast(`Added new product "${productFormData.name}".`);
      }
      setIsProductModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product');
    }
  };

  const handleToggleProductAvailability = async (product: any) => {
    const nextState = !product.isAvailable;
    try {
      const updated = await updateAdminProduct(product.id, { isAvailable: nextState });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isAvailable: nextState } : p))
      );
      showToast(
        `"${product.name}" is now ${nextState ? 'Available' : 'Unavailable'}`
      );
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update availability');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation) return;
    try {
      if (deleteConfirmation.type === 'product') {
        await deleteAdminProduct(String(deleteConfirmation.id));
        setProducts((prev) => prev.filter((p) => p.id !== deleteConfirmation.id));
        showToast('Product removed from database.');
      } else if (deleteConfirmation.type === 'review') {
        await deleteAdminReview(Number(deleteConfirmation.id));
        setReviews((prev) => prev.filter((r) => r.id !== deleteConfirmation.id));
        showToast('Review removed.');
      } else if (deleteConfirmation.type === 'rider') {
        await deleteAdminRider(String(deleteConfirmation.id));
        setRiders((prev) => prev.filter((r) => r.id !== deleteConfirmation.id));
        showToast('Rider removed from fleet.');
      }
      setDeleteConfirmation(null);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete record');
    }
  };

  // -------------------------------------------------------------
  // Rider Operations
  // -------------------------------------------------------------
  const handleOpenAddRider = () => {
    setEditingRider(null);
    setRiderFormData({
      name: '',
      phone: '',
      vehicle: '',
      status: 'available',
    });
    setIsRiderModalOpen(true);
  };

  const handleOpenEditRider = (rider: Rider) => {
    setEditingRider(rider);
    setRiderFormData({
      name: rider.name,
      phone: rider.phone,
      vehicle: rider.vehicle,
      status: rider.status,
    });
    setIsRiderModalOpen(true);
  };

  const handleSaveRider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riderFormData.name.trim() || !riderFormData.phone.trim() || !riderFormData.vehicle.trim()) {
      showToast('Please fill out all rider fields.');
      return;
    }

    try {
      if (editingRider) {
        const updated = await updateAdminRider(editingRider.id, {
          name: riderFormData.name.trim(),
          phone: riderFormData.phone.trim(),
          vehicle: riderFormData.vehicle.trim(),
          status: riderFormData.status,
        });
        setRiders((prev) => prev.map((r) => (r.id === editingRider.id ? updated : r)));
        showToast(`Rider "${riderFormData.name}" updated successfully.`);
      } else {
        const created = await createAdminRider({
          name: riderFormData.name.trim(),
          phone: riderFormData.phone.trim(),
          vehicle: riderFormData.vehicle.trim(),
          status: riderFormData.status,
        });
        setRiders((prev) => [created, ...prev]);
        showToast(`Rider "${riderFormData.name}" registered to fleet.`);
      }
      setIsRiderModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save rider');
    }
  };

  const handleUpdateRiderStatus = async (riderId: string, status: 'available' | 'delivering' | 'offline') => {
    try {
      await updateAdminRider(riderId, { status });
      setRiders((prev) => prev.map((r) => (r.id === riderId ? { ...r, status } : r)));
      showToast(`Rider status set to "${status}".`);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update rider status');
    }
  };

  const handleAssignOrderRider = async (orderId: string, riderId: string) => {
    if (!riderId) return;
    try {
      const res = await assignAdminRiderToOrder(orderId, riderId);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, assignedRiderId: res.rider.id, assignedRiderName: res.rider.name, status: 'Out for Delivery' }
            : o
        )
      );
      if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
        setSelectedOrderDetails({
          ...selectedOrderDetails,
          assignedRiderId: res.rider.id,
          assignedRiderName: res.rider.name,
          status: 'Out for Delivery',
        });
      }
      showToast(`Assigned ${res.rider.name} to Order #${orderId}.`);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to assign rider');
    }
  };

  // Filtered Riders
  const filteredRiders = useMemo(() => {
    return riders.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(riderSearch.toLowerCase()) ||
        r.phone.toLowerCase().includes(riderSearch.toLowerCase()) ||
        r.vehicle.toLowerCase().includes(riderSearch.toLowerCase());
      const matchesStatus =
        riderStatusFilter === 'all' || r.status === riderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [riders, riderSearch, riderStatusFilter]);

  // -------------------------------------------------------------
  // Order Operations
  // -------------------------------------------------------------
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updated = await updateAdminOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
        setSelectedOrderDetails({ ...selectedOrderDetails, status: newStatus });
      }
      showToast(`Order #${orderId} marked as "${newStatus}".`);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status');
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(productSearch.toLowerCase()));
      const matchesCategory =
        productCategoryFilter === 'all' || p.category.toLowerCase() === productCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o.phone && o.phone.includes(orderSearch));
      const matchesStatus =
        orderStatusFilter === 'all' ||
        (o.status && o.status.toLowerCase() === orderStatusFilter.toLowerCase());
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Helper for Order Status Badge
  const getStatusBadge = (status: string) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Confirmed
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Preparing
          </span>
        );
      case 'out for delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Out for Delivery
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Cancelled
          </span>
        );
      case 'pending':
      case 'received':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#11100F] text-[#FCFAF7] font-sans flex flex-col antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#C8351B] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-[#181615] border-b border-white/10 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-black tracking-tight text-white">
              Hot<span className="text-[#C8351B]">n</span>Roll
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-extrabold tracking-wider bg-[#C8351B]/20 text-[#C8351B] border border-[#C8351B]/30">
              Admin Ops
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-stone-400 border-l border-white/10 pl-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cloud SQL · Live Sync</span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C8351B]' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <button
            type="button"
            onClick={onExitToSite}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Storefront</span>
          </button>

          <button
            type="button"
            onClick={handleLogoutClick}
            className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-200 transition-all cursor-pointer text-xs font-bold flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Body with Navigation Tabs */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#C8351B] text-white shadow-lg shadow-[#C8351B]/20'
                : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap relative ${
              activeTab === 'orders'
                ? 'bg-[#C8351B] text-white shadow-lg shadow-[#C8351B]/20'
                : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Management</span>
            {stats?.pendingOrders > 0 && (
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#C8351B] text-white shadow-lg shadow-[#C8351B]/20'
                : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Product Catalog</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-[#C8351B] text-white shadow-lg shadow-[#C8351B]/20'
                : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Customer Reviews</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
              {reviews.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('riders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'riders'
                ? 'bg-[#C8351B] text-white shadow-lg shadow-[#C8351B]/20'
                : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Delivery Riders</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
              {riders.length}
            </span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              
              {/* Total Orders */}
              <div className="bg-[#181615] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-400 text-xs font-medium mb-3">
                  <span>Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#C8351B]" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">
                    {stats?.totalOrders ?? orders.length}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Lifetime records</div>
                </div>
              </div>

              {/* Today's Orders */}
              <div className="bg-[#181615] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-400 text-xs font-medium mb-3">
                  <span>Today's Orders</span>
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">
                    {stats?.todayOrders ?? 0}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1">Placed today</div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-[#181615] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-400 text-xs font-medium mb-3">
                  <span>Total Revenue</span>
                  <span className="text-xs font-bold text-emerald-400">PKR</span>
                </div>
                <div>
                  <div className="text-xl font-black text-emerald-400">
                    Rs. {Math.round(stats?.totalRevenue ?? 0).toLocaleString('en-PK')}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Gross delivered</div>
                </div>
              </div>

              {/* Pending Orders */}
              <div className="bg-[#181615] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-400 text-xs font-medium mb-3">
                  <span>Pending Orders</span>
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <div className={`text-2xl font-black ${stats?.pendingOrders > 0 ? 'text-yellow-400' : 'text-white'}`}>
                    {stats?.pendingOrders ?? 0}
                  </div>
                  <div className="text-[11px] text-yellow-400/80 mt-1">Requires action</div>
                </div>
              </div>

              {/* Active Riders */}
              <div
                onClick={() => setActiveTab('riders')}
                className="bg-[#181615] border border-white/10 hover:border-[#C8351B]/50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-colors group"
                title="View delivery riders"
              >
                <div className="flex items-center justify-between text-stone-400 text-xs font-medium mb-3">
                  <span className="group-hover:text-white">Active Riders</span>
                  <Bike className="w-4 h-4 text-blue-400 group-hover:text-[#C8351B] transition-colors" />
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-400">
                    {riders.filter((r) => r.status !== 'offline').length} / {riders.length}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">On duty · View fleet →</div>
                </div>
              </div>

              {/* Total Products */}
              <div className="bg-[#181615] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-400 text-xs font-medium mb-3">
                  <span>Menu Items</span>
                  <UtensilsCrossed className="w-4 h-4 text-[#C8351B]" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">
                    {stats?.totalProducts ?? products.length}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    {stats?.availableProducts ?? products.filter((p) => p.isAvailable).length} available
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Orders Table (2 cols) */}
              <div className="lg:col-span-2 bg-[#181615] border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-bold text-white">Recent Customer Orders</h3>
                    <p className="text-xs text-stone-400 mt-0.5">Live incoming order queue from online storefront</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#C8351B] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Orders</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-stone-500 text-sm">
                    No orders logged in the database yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[520px]">
                      <thead>
                        <tr className="border-b border-white/10 text-stone-400 uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-3">Order ID</th>
                          <th className="py-3 px-3">Customer</th>
                          <th className="py-3 px-3">Rider</th>
                          <th className="py-3 px-3">Total</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {orders.slice(0, 6).map((order) => (
                          <tr key={order.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 px-3 font-mono font-bold text-white">
                              #{order.id}
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="font-semibold text-white">{order.customerName}</div>
                              <div className="text-[11px] text-stone-400">{order.phone}</div>
                            </td>
                            <td className="py-3.5 px-3">
                              {order.assignedRiderName ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                  <Bike className="w-3 h-3" />
                                  <span>{order.assignedRiderName}</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-stone-500">Unassigned</span>
                              )}
                            </td>
                            <td className="py-3.5 px-3 font-bold text-emerald-400">
                              Rs. {Math.round(Number(order.total)).toLocaleString('en-PK')}
                            </td>
                            <td className="py-3.5 px-3">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedOrderDetails(order)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                                title="View details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Operations Control Center (1 col) */}
              <div className="space-y-6">
                <div className="bg-[#181615] border border-white/10 rounded-3xl p-6">
                  <h3 className="text-base font-bold text-white mb-2">Quick Management</h3>
                  <p className="text-xs text-stone-400 mb-5 leading-relaxed">
                    Direct operations for restaurant managers and shift leads.
                  </p>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleOpenAddProduct}
                      className="w-full py-3 px-4 bg-[#C8351B] hover:bg-[#B32D15] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Menu Product</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UtensilsCrossed className="w-4 h-4 text-[#C8351B]" />
                      <span>Manage Prices &amp; Availability</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('reviews')}
                      className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      <span>Review Moderation ({reviews.length})</span>
                    </button>
                  </div>
                </div>

                {/* System Specs */}
                <div className="bg-[#181615]/60 border border-white/10 rounded-3xl p-6 text-xs text-stone-400 space-y-2.5">
                  <div className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                    Environment Security
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database Engine:</span>
                    <span className="text-white font-medium">Cloud SQL (PostgreSQL)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Authorization:</span>
                    <span className="text-emerald-400 font-medium">Session Token (Bearer)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Brute-force Shield:</span>
                    <span className="text-emerald-400 font-medium">Rate-limited active</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-[#181615] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer, or phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#11100F] border border-white/10 rounded-xl text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C8351B]"
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setOrderStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    orderStatusFilter === 'all'
                      ? 'bg-[#C8351B] text-white'
                      : 'bg-white/5 text-stone-400 hover:text-white'
                  }`}
                >
                  All ({orders.length})
                </button>
                {ORDER_STATUSES.map((status) => {
                  const count = orders.filter(
                    (o) => (o.status || '').toLowerCase() === status.toLowerCase()
                  ).length;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setOrderStatusFilter(status.toLowerCase())}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                        orderStatusFilter === status.toLowerCase()
                          ? 'bg-[#C8351B] text-white'
                          : 'bg-white/5 text-stone-400 hover:text-white'
                      }`}
                    >
                      {status} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orders List Table */}
            <div className="bg-[#181615] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center text-stone-400 text-sm">
                  No orders match your filter criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[760px]">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-stone-400 uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-4">Order ID &amp; Time</th>
                        <th className="py-3.5 px-4">Customer Details</th>
                        <th className="py-3.5 px-4">Address</th>
                        <th className="py-3.5 px-4">Items Summary</th>
                        <th className="py-3.5 px-4">Rider</th>
                        <th className="py-3.5 px-4">Total</th>
                        <th className="py-3.5 px-4">Status &amp; Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 align-top">
                            <span className="font-mono font-bold text-white text-sm">
                              #{order.id}
                            </span>
                            <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleString([], {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'Recently'}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div className="font-bold text-white text-sm">{order.customerName}</div>
                            <div className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#C8351B]" />
                              <span>{order.phone}</span>
                            </div>
                            {order.notes && (
                              <div className="mt-1.5 text-[11px] text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 max-w-xs">
                                Note: {order.notes}
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-4 align-top max-w-xs">
                            <div className="text-stone-300 leading-relaxed flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                              <span>{order.address}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            {order.items && order.items.length > 0 ? (
                              <ul className="space-y-1 text-stone-300">
                                {order.items.map((it: any, idx: number) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <span className="font-bold text-[#C8351B]">{it.quantity}x</span>
                                    <span>{it.productName}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-stone-500 italic">Items logged</span>
                            )}
                          </td>

                          <td className="py-4 px-4 align-top">
                            {order.assignedRiderName ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                  <Bike className="w-3 h-3" />
                                  <span>{order.assignedRiderName}</span>
                                </span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className="text-[10px] text-stone-500 italic block">Not Assigned</span>
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) handleAssignOrderRider(order.id, e.target.value);
                                  }}
                                  defaultValue=""
                                  className="bg-[#11100F] border border-white/15 text-stone-300 text-[10px] rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                                >
                                  <option value="" disabled>+ Assign Rider</option>
                                  {riders.map((r) => (
                                    <option key={r.id} value={r.id}>
                                      {r.name} ({r.vehicle})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div className="font-black text-emerald-400 text-sm">
                              Rs. {Math.round(Number(order.total)).toLocaleString('en-PK')}
                            </div>
                            <div className="text-[10px] uppercase font-bold text-stone-400 mt-1">
                              {order.paymentMethod === 'cod' ? 'Cash on Deliv' : 'Card'}
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div className="space-y-2">
                              {getStatusBadge(order.status)}

                              {/* Status changer select */}
                              <div className="flex items-center gap-1.5 mt-2">
                                <select
                                  value={order.status || 'Pending'}
                                  onChange={(e) =>
                                    handleUpdateOrderStatus(order.id, e.target.value)
                                  }
                                  className="bg-[#11100F] border border-white/15 text-stone-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-[#C8351B] cursor-pointer"
                                >
                                  {ORDER_STATUSES.map((st) => (
                                    <option key={st} value={st}>
                                      Set: {st}
                                    </option>
                                  ))}
                                </select>

                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderDetails(order)}
                                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white"
                                  title="View full receipt"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Top Toolbar */}
            <div className="bg-[#181615] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search menu products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#11100F] border border-white/10 rounded-xl text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C8351B]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setProductCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      productCategoryFilter === 'all'
                        ? 'bg-[#C8351B] text-white'
                        : 'bg-white/5 text-stone-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setProductCategoryFilter(cat.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                        productCategoryFilter === cat.value
                          ? 'bg-[#C8351B] text-white'
                          : 'bg-white/5 text-stone-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Product Button */}
              <button
                type="button"
                onClick={handleOpenAddProduct}
                className="w-full md:w-auto px-4 py-2.5 bg-[#C8351B] hover:bg-[#B32D15] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-[#181615] border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                    product.isAvailable ? 'border-white/10' : 'border-white/5 opacity-65'
                  }`}
                >
                  <div>
                    {/* Image & Header */}
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-stone-900 border border-white/5">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = burgerImg;
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-[#11100F]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-stone-200 border border-white/10">
                        {product.category}
                      </div>

                      <div className="absolute top-3 right-3">
                        <button
                          type="button"
                          onClick={() => handleToggleProductAvailability(product)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md ${
                            product.isAvailable
                              ? 'bg-emerald-500 text-white'
                              : 'bg-red-500/80 text-white'
                          }`}
                        >
                          {product.isAvailable ? 'Available' : 'Unavailable'}
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#11100F]/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-400 border border-white/10">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{Number(product.rating || 5).toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-bold text-white text-base leading-snug">
                        {product.name}
                      </h4>
                      <span className="font-display font-extrabold text-[#C8351B] text-lg shrink-0">
                        Rs. {Math.round(Number(product.price)).toLocaleString('en-PK')}
                      </span>
                    </div>

                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-4">
                      {product.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 font-mono">
                      ID: {product.id}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProduct(product)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-stone-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirmation({
                            type: 'product',
                            id: product.id,
                            title: product.name,
                          })
                        }
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-[#181615] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Customer Feedback &amp; Ratings</h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Live reviews submitted by diners across web and delivery channels.
                </p>
              </div>

              <div className="text-right">
                <div className="text-xl font-black text-amber-400 flex items-center gap-1.5 justify-end">
                  <Star className="w-5 h-5 fill-amber-400" />
                  <span>
                    {(
                      reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) /
                        (reviews.length || 1)
                    ).toFixed(1)}
                  </span>
                </div>
                <div className="text-[11px] text-stone-400">{reviews.length} total reviews</div>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#181615] border border-white/10 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="font-bold text-white text-sm">
                          {rev.customerName || rev.author || 'Verified Guest'}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {rev.createdAt
                            ? new Date(rev.createdAt).toLocaleDateString([], {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Recent diner'}
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= (rev.rating || 5)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/5">
                      "{rev.reviewText || rev.comment || 'Outstanding flavor and prompt delivery!'}"
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 font-mono">
                      Ref #{rev.id}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteConfirmation({
                          type: 'review',
                          id: rev.id,
                          title: `Review by ${rev.customerName || 'Customer'}`,
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Moderate / Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DELIVERY RIDERS FLEET */}
        {activeTab === 'riders' && (
          <div className="space-y-6">
            {/* Top Fleet Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#181615] border border-white/10 rounded-2xl p-5">
                <div className="text-stone-400 text-xs font-medium mb-1">Total Fleet Size</div>
                <div className="text-2xl font-black text-white">{riders.length}</div>
                <div className="text-[11px] text-stone-500 mt-1">Registered delivery riders</div>
              </div>

              <div className="bg-[#181615] border border-white/10 rounded-2xl p-5">
                <div className="text-stone-400 text-xs font-medium mb-1">Available / Ready</div>
                <div className="text-2xl font-black text-emerald-400">
                  {riders.filter((r) => r.status === 'available').length}
                </div>
                <div className="text-[11px] text-emerald-500/80 mt-1">Ready for dispatch</div>
              </div>

              <div className="bg-[#181615] border border-white/10 rounded-2xl p-5">
                <div className="text-stone-400 text-xs font-medium mb-1">On Delivery Route</div>
                <div className="text-2xl font-black text-amber-400">
                  {riders.filter((r) => r.status === 'delivering').length}
                </div>
                <div className="text-[11px] text-amber-500/80 mt-1">Active customer trips</div>
              </div>

              <div className="bg-[#181615] border border-white/10 rounded-2xl p-5">
                <div className="text-stone-400 text-xs font-medium mb-1">Off Duty / Offline</div>
                <div className="text-2xl font-black text-stone-400">
                  {riders.filter((r) => r.status === 'offline').length}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">Currently resting</div>
              </div>
            </div>

            {/* Filter & Action Bar */}
            <div className="bg-[#181615] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by rider name, phone, or bike #..."
                  value={riderSearch}
                  onChange={(e) => setRiderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#11100F] border border-white/10 rounded-xl text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C8351B]"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                {(['all', 'available', 'delivering', 'offline'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setRiderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer capitalize whitespace-nowrap ${
                      riderStatusFilter === st
                        ? 'bg-[#C8351B] text-white'
                        : 'bg-white/5 text-stone-400 hover:text-white'
                    }`}
                  >
                    {st === 'all' ? `All (${riders.length})` : st}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleOpenAddRider}
                  className="ml-auto px-4 py-2 bg-[#C8351B] hover:bg-[#B32D15] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Rider</span>
                </button>
              </div>
            </div>

            {/* Fleet Table */}
            <div className="bg-[#181615] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              {filteredRiders.length === 0 ? (
                <div className="py-16 text-center text-stone-400 text-sm">
                  No delivery riders match your criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[720px]">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-stone-400 uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-4">Rider Profile</th>
                        <th className="py-3.5 px-4">Contact Phone</th>
                        <th className="py-3.5 px-4">Vehicle / Motorbike</th>
                        <th className="py-3.5 px-4">Live Status</th>
                        <th className="py-3.5 px-4">Deliveries &amp; Rating</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredRiders.map((rider) => (
                        <tr key={rider.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 align-top">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-[#C8351B]/15 border border-[#C8351B]/30 text-[#C8351B] flex items-center justify-center font-bold">
                                <Bike className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-white text-sm">{rider.name}</div>
                                <div className="text-[10px] text-stone-400 font-mono">ID: {rider.id} · Joined {rider.joinedDate || 'Recently'}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <a
                              href={`tel:${rider.phone}`}
                              className="text-stone-200 hover:text-[#C8351B] font-mono flex items-center gap-1.5 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-stone-400" />
                              <span>{rider.phone}</span>
                            </a>
                            <div className="text-[10px] text-stone-500 mt-0.5">Direct driver line</div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div className="font-semibold text-white">{rider.vehicle}</div>
                            <div className="text-[10px] text-stone-400 mt-0.5">Motorbike Fleet</div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <select
                              value={rider.status}
                              onChange={(e) =>
                                handleUpdateRiderStatus(rider.id, e.target.value as any)
                              }
                              className={`text-xs font-bold rounded-lg px-2.5 py-1 border cursor-pointer ${
                                rider.status === 'available'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : rider.status === 'delivering'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                  : 'bg-stone-500/10 text-stone-400 border-stone-500/30'
                              }`}
                            >
                              <option value="available" className="bg-[#181615] text-white">● Available</option>
                              <option value="delivering" className="bg-[#181615] text-white">● Delivering</option>
                              <option value="offline" className="bg-[#181615] text-white">● Offline</option>
                            </select>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{rider.totalDelivered || 0} completed</span>
                              <span className="text-amber-400 text-xs font-bold flex items-center gap-0.5">
                                ★ {rider.rating ? rider.rating.toFixed(1) : '5.0'}
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-400 mt-0.5">
                              {orders.filter(o => o.assignedRiderId === rider.id && (o.status || '').toLowerCase() === 'out for delivery').length} active trip currently
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditRider(rider)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                title="Edit Rider details"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-stone-400" />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteConfirmation({
                                    type: 'rider',
                                    id: rider.id,
                                    title: rider.name,
                                  })
                                }
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 transition-colors cursor-pointer"
                                title="Remove rider"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ------------------------------------------------------------- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#11100F]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1C1A18] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="font-display text-lg font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Menu Product'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flame Bacon Double Smash"
                  value={productFormData.name}
                  onChange={(e) =>
                    setProductFormData({ ...productFormData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#11100F] border border-white/10 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#C8351B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={productFormData.category}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#11100F] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C8351B] capitalize"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Price (Rs. PKR) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    placeholder="1250"
                    value={productFormData.price}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, price: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#11100F] border border-white/10 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#C8351B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Signature seasoning, artisan flatbread, prime cut details..."
                  value={productFormData.description}
                  onChange={(e) =>
                    setProductFormData({ ...productFormData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#11100F] border border-white/10 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#C8351B] leading-relaxed"
                />
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Product Image URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Image URL or pick preset below"
                  value={productFormData.imageUrl}
                  onChange={(e) =>
                    setProductFormData({ ...productFormData, imageUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#11100F] border border-white/10 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#C8351B] mb-2"
                />

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <span className="text-[10px] text-stone-400 shrink-0 font-medium">
                    Quick Assets:
                  </span>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() =>
                        setProductFormData({ ...productFormData, imageUrl: cat.image })
                      }
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-[10px] text-stone-300 border border-white/10 shrink-0 cursor-pointer"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Rating (1.0 – 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={productFormData.rating}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, rating: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#11100F] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C8351B]"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer bg-[#11100F] border border-white/10 rounded-xl p-2.5">
                    <input
                      type="checkbox"
                      checked={productFormData.isAvailable}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="accent-[#C8351B] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-stone-200 text-xs">
                      Available for Order
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C8351B] hover:bg-[#B32D15] text-white font-bold uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT DELIVERY RIDER */}
      {/* ------------------------------------------------------------- */}
      {isRiderModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#11100F]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1C1A18] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#C8351B]/20 text-[#C8351B] flex items-center justify-center">
                  <Bike className="w-4 h-4" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {editingRider ? 'Edit Rider Profile' : 'Register Delivery Rider'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRiderModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRider} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Usman"
                  value={riderFormData.name}
                  onChange={(e) =>
                    setRiderFormData({ ...riderFormData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#11100F] border border-white/10 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#C8351B]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Mobile / WhatsApp Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0300 1234567 or +92 321 8923411"
                  value={riderFormData.phone}
                  onChange={(e) =>
                    setRiderFormData({ ...riderFormData, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#11100F] border border-white/10 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#C8351B]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Vehicle / Bike Registration *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Honda CG 125 (KHI-8192)"
                  value={riderFormData.vehicle}
                  onChange={(e) =>
                    setRiderFormData({ ...riderFormData, vehicle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#11100F] border border-white/10 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#C8351B]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Initial Duty Status *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['available', 'delivering', 'offline'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() =>
                        setRiderFormData({ ...riderFormData, status: st })
                      }
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        riderFormData.status === st
                          ? 'bg-[#C8351B] text-white shadow-md'
                          : 'bg-white/5 text-stone-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsRiderModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C8351B] hover:bg-[#B32D15] text-white font-bold uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  {editingRider ? 'Update Rider' : 'Save & Enlist Rider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ORDER DETAILS SLIDE-OVER */}
      {/* ------------------------------------------------------------- */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-[#11100F]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1C1A18] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <span className="font-mono text-xs text-stone-400">ORDER RECEIPT</span>
                <h3 className="font-display text-xl font-bold text-white">
                  #{selectedOrderDetails.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Customer Info */}
              <div className="bg-[#11100F] border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Customer:</span>
                  <span className="font-bold text-white text-sm">
                    {selectedOrderDetails.customerName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Contact Phone:</span>
                  <span className="font-mono font-medium text-stone-200">
                    {selectedOrderDetails.phone}
                  </span>
                </div>
                <div className="pt-1 border-t border-white/5">
                  <span className="text-stone-400 block mb-1">Delivery Destination:</span>
                  <span className="text-stone-200 leading-relaxed">
                    {selectedOrderDetails.address}
                  </span>
                </div>
                {selectedOrderDetails.notes && (
                  <div className="pt-1 border-t border-white/5">
                    <span className="text-amber-400 block mb-0.5">Kitchen / Delivery Note:</span>
                    <span className="text-amber-200 italic">{selectedOrderDetails.notes}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="bg-[#11100F] border border-white/10 rounded-2xl p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Ordered Items
                </div>
                <div className="divide-y divide-white/5">
                  {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? (
                    selectedOrderDetails.items.map((it: any, idx: number) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">{it.productName}</span>
                          <span className="text-stone-400 ml-2">x{it.quantity}</span>
                        </div>
                        <span className="font-mono font-bold text-stone-200">
                          Rs. {Math.round(Number(it.price) * it.quantity).toLocaleString('en-PK')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-stone-500 italic py-2">Details stored in receipt ledger</div>
                  )}
                </div>

                <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-sm">
                  <span className="font-bold text-white">Total Amount:</span>
                  <span className="font-bold text-emerald-400 text-base">
                    Rs. {Math.round(Number(selectedOrderDetails.total)).toLocaleString('en-PK')}
                  </span>
                </div>
              </div>

              {/* Delivery Rider Assignment Section */}
              <div className="bg-[#11100F] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <Bike className="w-3.5 h-3.5 text-[#C8351B]" />
                    Delivery Rider Assignment
                  </div>
                  {selectedOrderDetails.assignedRiderName ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Rider Assigned
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      Awaiting Rider
                    </span>
                  )}
                </div>

                {selectedOrderDetails.assignedRiderName && (
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{selectedOrderDetails.assignedRiderName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-normal">
                          On Route
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1">
                        Assigned to delivery for Order #{selectedOrderDetails.id}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <select
                    id="rider-assign-select"
                    className="flex-1 bg-[#181615] border border-white/15 text-stone-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C8351B] cursor-pointer"
                    defaultValue={selectedOrderDetails.assignedRiderId || ''}
                  >
                    <option value="" disabled>Select rider from fleet...</option>
                    {riders.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} · {r.vehicle} ({r.status})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const selectEl = document.getElementById('rider-assign-select') as HTMLSelectElement;
                      if (selectEl && selectEl.value) {
                        handleAssignOrderRider(selectedOrderDetails.id, selectEl.value);
                      } else {
                        showToast('Please select a rider from the dropdown');
                      }
                    }}
                    className="px-4 py-2.5 bg-[#C8351B] hover:bg-[#B32D15] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    {selectedOrderDetails.assignedRiderName ? 'Reassign' : 'Assign & Dispatch'}
                  </button>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="pt-2">
                <label className="block font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Update Order Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ORDER_STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() =>
                        handleUpdateOrderStatus(selectedOrderDetails.id, st)
                      }
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        (selectedOrderDetails.status || '').toLowerCase() === st.toLowerCase()
                          ? 'bg-[#C8351B] text-white shadow-md'
                          : 'bg-white/5 text-stone-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 bg-[#11100F]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1C1A18] border border-red-800/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/50 flex items-center justify-center mb-4 text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-display text-lg font-bold text-white mb-2">
              Confirm Record Deletion
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-6">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">"{deleteConfirmation.title}"</strong>?
              This action immediately updates the Cloud SQL database and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
