import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, Flame, ShoppingBag, ArrowLeft, Database, RefreshCw, AlertCircle } from 'lucide-react';
import { Category, MenuItem } from '../types.ts';
import { ProductCard } from './ProductCard.tsx';
import { useCart } from '../context/CartContext.tsx';

interface MenuPageProps {
  onOpenModal: (item: MenuItem) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onOpenModal }) => {
  const {
    setCurrentView,
    totalItems,
    subtotal,
    openCart,
    products,
    isLoadingProducts,
    productsError,
    refreshProducts,
    isSupabaseConnected
  } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-asc' | 'price-desc'>('featured');

  const categories: { id: Category; label: string; count: number }[] = [
    { id: 'all', label: 'All Items', count: products.length },
    { id: 'burgers', label: 'Burgers', count: products.filter((i) => i.category === 'burgers').length },
    { id: 'rolls', label: 'Rolls', count: products.filter((i) => i.category === 'rolls').length },
    { id: 'pizza', label: 'Pizza', count: products.filter((i) => i.category === 'pizza').length },
    { id: 'fries', label: 'Fries', count: products.filter((i) => i.category === 'fries').length },
    { id: 'chicken', label: 'Chicken', count: products.filter((i) => i.category === 'chicken').length },
    { id: 'drinks', label: 'Drinks', count: products.filter((i) => i.category === 'drinks').length },
    { id: 'deals', label: 'Deals', count: products.filter((i) => i.category === 'deals').length },
  ];

  // Filter and sort items dynamically
  const filteredItems = useMemo(() => {
    let result = products;

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.ingredients && item.ingredients.some((ing) => ing.toLowerCase().includes(q)))
      );
    }

    // Sort items
    return [...result].sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#FCFAF7]">
      {/* Page Header */}
      <div className="border-b border-[#EAE4DC] bg-white py-10 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <button
              onClick={() => setCurrentView('home')}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#181615]/60 hover:text-[#C8351B] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center gap-3 text-xs font-semibold text-[#181615]/70">
              <span className="flex items-center gap-1.5 text-[#181615]/80 bg-[#F4EFEA] px-3 py-1 rounded-lg border border-[#EAE4DC]">
                <Flame className="w-3.5 h-3.5 text-[#C8351B]" />
                <span>Live Kitchen Ordering · Fresh to Order</span>
              </span>

              <button
                onClick={() => refreshProducts()}
                className="p-1 hover:text-[#C8351B] transition-colors cursor-pointer"
                title="Refresh menu items"
                aria-label="Refresh menu items"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin text-[#C8351B]' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C8351B] mb-2">
                <Flame className="w-4 h-4" />
                <span>Full Kitchen Menu</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#181615] tracking-tight">
                Crafted for Every Craving
              </h1>
              <p className="text-sm sm:text-base text-[#181615]/70 mt-2 max-w-2xl">
                Explore our flame-grilled smash burgers, freshly hand-rolled wraps, wood-fired sourdough pizzas, and crispy sides made to order.
              </p>
            </div>

            {/* Live Cart Snapshot Trigger */}
            {totalItems > 0 && (
              <button
                onClick={openCart}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-[#181615] text-white hover:bg-black transition-all shadow-md self-start md:self-auto cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#C8351B]" />
                <div className="text-left">
                  <span className="text-xs uppercase tracking-wider font-semibold block text-stone-300">
                    Order Bag
                  </span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {totalItems} items · ${subtotal.toFixed(2)}
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Search Bar & Sorting Controls */}
          <div className="mt-8 pt-6 border-t border-[#F2ECE4] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#181615]/50 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search burgers, rolls, ingredients, spices..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#FCFAF7] border border-[#EAE4DC] rounded-xl text-sm text-[#181615] placeholder:text-[#181615]/40 focus:bg-white focus:outline-hidden focus:border-[#C8351B] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#181615]/40 hover:text-[#181615]"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <span className="text-xs font-semibold text-[#181615]/60 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] text-[#181615] focus:outline-hidden focus:border-[#C8351B] cursor-pointer"
              >
                <option value="featured">Featured / Chef's Pick</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs Bar */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#C8351B] text-white shadow-xs'
                      : 'bg-[#F4EFEA] text-[#181615]/75 hover:bg-[#EAE4DC] hover:text-[#181615]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-[#181615]/60'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Error notification if any */}
        {productsError && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{productsError}</span>
          </div>
        )}

        {/* Results Counter / Filter status */}
        <div className="flex items-center justify-between text-xs text-[#181615]/60 font-medium mb-6">
          <span>
            Showing <strong className="text-[#181615]">{filteredItems.length}</strong> items
            {searchQuery && (
              <> matching &ldquo;{searchQuery}&rdquo;</>
            )}
          </span>

          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-[#C8351B] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Loading Skeleton */}
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#EAE4DC] p-4 animate-pulse space-y-4">
                <div className="aspect-[4/3] bg-stone-200 rounded-xl" />
                <div className="h-4 bg-stone-200 rounded w-1/3" />
                <div className="h-6 bg-stone-200 rounded w-3/4" />
                <div className="h-10 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-[#EAE4DC] p-8">
            <div className="w-16 h-16 rounded-full bg-[#F4EFEA] flex items-center justify-center mx-auto mb-4 text-[#181615]/40">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-black text-[#181615]">
              No menu items match your search
            </h3>
            <p className="text-sm text-[#181615]/65 mt-2 max-w-sm mx-auto">
              We couldn&apos;t find any items matching &ldquo;{searchQuery}&rdquo;. Try another term or reset your category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-6 px-6 py-2.5 bg-[#C8351B] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#B32D15] transition-colors"
            >
              View Full Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredItems.map((item) => (
              <ProductCard key={item.id} item={item} onOpenModal={onOpenModal} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
