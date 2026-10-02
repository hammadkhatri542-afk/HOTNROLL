import React from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartToast: React.FC = () => {
  const { toastMessage, dismissToast, openCart } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#181615] text-white p-4 rounded-xl shadow-2xl border border-white/10 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-[#C8351B] flex items-center justify-center shrink-0">
          <ShoppingBag className="w-4 h-4 text-white" />
        </div>
        <p className="text-xs font-medium text-stone-200 truncate">
          {toastMessage}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={openCart}
          className="text-xs font-bold uppercase tracking-wider text-[#C8351B] hover:text-white transition-colors"
        >
          View
        </button>
        <button
          onClick={dismissToast}
          className="p-1 text-stone-400 hover:text-white"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
