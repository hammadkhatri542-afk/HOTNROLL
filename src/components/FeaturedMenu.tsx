import React, { useState } from 'react';
import { Category, MenuItem } from '../types.ts';
import { ProductCard } from './ProductCard.tsx';
import { useCart } from '../context/CartContext.tsx';
import { ArrowRight, Flame, Database, RefreshCw } from 'lucide-react';

interface FeaturedMenuProps {
  onOpenModal: (item: MenuItem) => void;
}

export const FeaturedMenu: React.FC<FeaturedMenuProps> = ({ onOpenModal }) => {
  const { setCurrentView, products, isLoadingProducts, refreshProducts, dataSource } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All Picks' },
    { id: 'burgers', label: 'Burgers' },
    { id: 'rolls', label: 'Rolls' },
    { id: 'pizza', label: 'Pizza' },
    { id: 'fries', label: 'Fries' },
    { id: 'chicken', label: 'Chicken' },
    { id: 'drinks', label: 'Drinks' },
    { id: 'deals', label: 'Deals' },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? products.slice(0, 8)
      : products.filter((item) => item.category === selectedCategory);

  return (
    <section id="menu" className="py-20 lg:py-28 bg-[#FCFAF7] border-t border-[#EAE4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8351B] mb-2">
              <Flame className="w-4 h-4 text-[#C8351B]" />
              <span>Signature Kitchen Lineup</span>
              <span aria-hidden="true" className="text-[#181615]/30">·</span>
              <span className="text-[#181615]/70">Freshly Handcrafted · 100% Halal Angus</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#181615] tracking-tight">
              Featured Food &amp; Combos
            </h2>
            <p className="text-sm sm:text-base text-[#181615]/70 mt-2 max-w-xl">
              Freshly ground daily cuts, handmade flatbreads, slow fermented dough, and house sauces with zero artificial additives.
            </p>
          </div>

          {/* Interactive Category Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#F0EBE3] rounded-xl overflow-x-auto max-w-full scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                  className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#181615] text-white shadow-xs'
                      : 'text-[#181615]/70 hover:text-[#181615] hover:bg-white/50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Skeleton State */}
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#EAE4DC] p-4 animate-pulse space-y-4">
                <div className="aspect-[4/3] bg-stone-200 rounded-xl" />
                <div className="h-4 bg-stone-200 rounded w-1/3" />
                <div className="h-6 bg-stone-200 rounded w-3/4" />
                <div className="h-10 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          /* Product Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredItems.map((item) => (
              <ProductCard key={item.id} item={item} onOpenModal={onOpenModal} />
            ))}
          </div>
        )}

        {/* View Full Menu Banner */}
        <div className="mt-14 p-6 sm:p-8 bg-white rounded-3xl border border-[#EAE4DC] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C8351B]/10 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-[#C8351B]" />
            </div>
            <div>
              <h4 className="font-display font-black text-base sm:text-lg text-[#181615]">
                Hungry for More? Explore Our Entire Kitchen Selection
              </h4>
              <p className="text-xs sm:text-sm text-[#181615]/70 mt-0.5">
                Browse all smash burgers, signature rolls, wood-fired pizzas, crispy chicken tenders, drinks and value deals.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentView('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            type="button"
            className="shrink-0 px-6 py-3 bg-[#181615] hover:bg-black text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Open Complete Menu</span>
            <ArrowRight className="w-4 h-4 text-[#C8351B]" />
          </button>
        </div>

      </div>
    </section>
  );
};
