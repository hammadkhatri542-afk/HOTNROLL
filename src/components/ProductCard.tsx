import React, { useState } from 'react';
import { Plus, Check, Eye, Star, Flame } from 'lucide-react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  item: MenuItem;
  onOpenModal: (item: MenuItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onOpenModal }) => {
  const { addToCart, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  // Check how many of this item is currently in the cart
  const inCartQty = items
    .filter((ci) => ci.item.id === item.id)
    .reduce((sum, ci) => sum + ci.quantity, 0);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={() => onOpenModal(item)}
      className="group bg-white rounded-2xl border border-[#EAE4DC] hover:border-[#181615] hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative top-0 hover:-top-1"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] bg-[#F5F1EB] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Minimal Category & Badge */}
        {item.badge && (
          <div className="absolute top-3 left-3 bg-[#181615]/90 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
            {item.badge}
          </div>
        )}

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-0 bg-[#181615]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#181615] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <Eye className="w-3.5 h-3.5 text-[#C8351B]" />
            Quick View
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Metadata & Rating Row */}
          <div className="flex items-center justify-between gap-2 text-xs mb-2">
            <span className="text-[#C8351B] font-bold uppercase tracking-wider text-[11px]">
              {item.category}
            </span>

            {/* Star Rating UI */}
            <div className="flex items-center gap-1 text-[#181615] font-semibold text-xs bg-[#FCFAF7] px-2 py-0.5 rounded border border-[#EAE4DC]">
              <Star className="w-3.5 h-3.5 fill-[#C8351B] text-[#C8351B]" />
              <span className="tabular-nums font-bold">{item.rating.toFixed(1)}</span>
              <span className="text-[#181615]/40 text-[10px]">({item.ratingCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-display text-lg font-black text-[#181615] group-hover:text-[#C8351B] transition-colors leading-snug line-clamp-1">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#181615]/70 mt-1.5 line-clamp-2 leading-relaxed font-normal">
            {item.description}
          </p>
        </div>

        {/* Price and Add CTA baseline */}
        <div className="mt-5 pt-4 border-t border-[#F2ECE4] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-[#181615]/50 font-semibold">
              Price
            </span>
            <span className="font-display text-xl font-black text-[#181615] tabular-nums">
              Rs. {item.price.toLocaleString('en-PK')}
            </span>
          </div>

          <button
            onClick={handleAdd}
            type="button"
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
              justAdded
                ? 'bg-[#181615] text-white scale-105'
                : 'bg-[#C8351B] text-white hover:bg-[#B32D15] active:scale-95'
            }`}
            aria-label={`Add ${item.name} to cart`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : inCartQty > 0 ? (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add ({inCartQty})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
