import React, { useState } from 'react';
import { X, Plus, Minus, Check, Flame } from 'lucide-react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [spice, setSpice] = useState<string>(item?.spiceLevel || 'Medium');
  const [added, setAdded] = useState(false);
  const [extraCheese, setExtraCheese] = useState(false);
  const [extraSauce, setExtraSauce] = useState(false);

  if (!item) return null;

  const extraTotal = (extraCheese ? 150 : 0) + (extraSauce ? 100 : 0);
  const itemPrice = (item.price + extraTotal) * quantity;

  const handleAdd = () => {
    let notes = '';
    if (extraCheese) notes += 'Extra Melted Cheddar; ';
    if (extraSauce) notes += 'Extra House Garlic Aioli; ';
    addToCart(item, quantity, spice, notes.trim());
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181615]/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#EAE4DC] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white text-[#181615] rounded-full shadow-xs border border-[#EAE4DC] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image */}
        <div className="relative aspect-video w-full bg-[#181615]/5 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-4 bg-[#181615]/80 backdrop-blur-xs text-white text-xs font-semibold uppercase px-2.5 py-1 rounded-md">
            {item.category}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C8351B]">
                  {item.category}
                </span>
                <span className="text-[#181615]/30">·</span>
                <span className="text-xs text-[#181615]/70 flex items-center gap-1 font-semibold">
                  ★ {item.rating.toFixed(1)} ({item.ratingCount} reviews)
                </span>
              </div>
              <h3 className="font-display text-2xl font-black text-[#181615]">
                {item.name}
              </h3>
              <p className="text-xs text-[#181615]/60 font-semibold uppercase tracking-wider mt-1">
                Prep Time: {item.prepTime || '10 mins'} · {item.calories || 650} kcal
              </p>
            </div>
            <div className="text-right">
              <span className="font-display text-2xl font-black text-[#C8351B] tabular-nums">
                Rs. {item.price.toLocaleString('en-PK')}
              </span>
            </div>
          </div>

          <p className="text-sm text-[#181615]/80 mt-3 leading-relaxed">
            {item.description}
          </p>

          {/* Key Ingredients */}
          <div className="mt-5 pt-4 border-t border-[#F2ECE4]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#181615]/60 mb-2">
              Fresh Ingredients
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="text-xs font-medium text-[#181615]/80 bg-[#F4EFEA] px-2.5 py-1 rounded-md"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Spice Level Selector */}
          <div className="mt-5 pt-4 border-t border-[#F2ECE4]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#181615]/60 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#C8351B]" />
                Spice Level
              </h4>
              <span className="text-xs text-[#C8351B] font-semibold">{spice}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['Mild', 'Medium', 'Hot', 'Flame'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSpice(lvl)}
                  className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                    spice === lvl
                      ? 'border-[#C8351B] bg-[#C8351B] text-white shadow-xs'
                      : 'border-[#EAE4DC] bg-white text-[#181615]/70 hover:border-[#181615]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Add-ons */}
          <div className="mt-5 pt-4 border-t border-[#F2ECE4]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#181615]/60 mb-2">
              Kitchen Add-ons
            </h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#EAE4DC] hover:bg-[#FAF8F5] cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={extraCheese}
                    onChange={(e) => setExtraCheese(e.target.checked)}
                    className="w-4 h-4 accent-[#C8351B] rounded"
                  />
                  <span className="text-xs font-semibold text-[#181615]">Extra Melted Cheddar</span>
                </div>
                <span className="text-xs font-bold text-[#181615] tabular-nums">+Rs. 150</span>
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#EAE4DC] hover:bg-[#FAF8F5] cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={extraSauce}
                    onChange={(e) => setExtraSauce(e.target.checked)}
                    className="w-4 h-4 accent-[#C8351B] rounded"
                  />
                  <span className="text-xs font-semibold text-[#181615]">Side Smoked Garlic Aioli</span>
                </div>
                <span className="text-xs font-bold text-[#181615] tabular-nums">+Rs. 100</span>
              </label>
            </div>
          </div>

          {/* Quantity and Add to Cart Bottom Bar */}
          <div className="mt-6 pt-5 border-t border-[#EAE4DC] flex items-center justify-between gap-4">
            <div className="flex items-center border border-[#EAE4DC] rounded-lg bg-white p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded flex items-center justify-center text-[#181615] hover:bg-[#F3EFEA]"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-[#181615] tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded flex items-center justify-center text-[#181615] hover:bg-[#F3EFEA]"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`flex-1 py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                added
                  ? 'bg-[#181615] text-white'
                  : 'bg-[#C8351B] text-white hover:bg-[#B32D15] shadow-xs active:scale-[0.98]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Order</span>
                </>
              ) : (
                <>
                  <span>Add to Order · Rs. {itemPrice.toLocaleString('en-PK')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
