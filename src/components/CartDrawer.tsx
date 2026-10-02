import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    promoCode,
    promoApplied,
    applyPromo,
    setCurrentView
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState(false);

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const ok = applyPromo(inputCode);
    if (!ok) {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 2500);
    }
  };

  const handleProceedToCheckout = () => {
    closeCart();
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const freeDeliveryThreshold = 2000;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#181615]/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Click outside to close */}
      <div className="flex-1" onClick={closeCart} />

      {/* Slide-over panel */}
      <div className="w-full max-w-md bg-[#FCFAF7] h-full shadow-2xl border-l border-[#EAE4DC] flex flex-col z-10 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#EAE4DC] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C8351B]/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#C8351B]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#181615]">
                Your Order Bag
              </h3>
              <span className="text-[11px] font-semibold text-[#181615]/55 block">
                {items.length} {items.length === 1 ? 'item' : 'unique items'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-semibold text-[#181615]/50 hover:text-[#C8351B] transition-colors px-2 py-1"
              >
                Clear All
              </button>
            )}

            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-[#181615]/60 hover:text-[#181615] hover:bg-[#F5F1EB] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Goal Bar */}
        {subtotal > 0 && (
          <div className="px-5 py-3 bg-[#F4EFEA] border-b border-[#EAE4DC] text-xs">
            <div className="flex items-center justify-between font-semibold text-[#181615]">
              <span>
                {amountToFreeDelivery > 0
                  ? `Add Rs. ${Math.round(amountToFreeDelivery).toLocaleString('en-PK')} more for FREE delivery`
                  : '🎉 You have qualified for FREE delivery!'}
              </span>
              <span className="text-[11px] text-[#181615]/50 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#EAE4DC] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#C8351B] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#F5F1EB] flex items-center justify-center mb-4 text-[#181615]/30">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-display font-bold text-lg text-[#181615]">
                Your bag is empty
              </h4>
              <p className="text-xs text-[#181615]/60 mt-1 max-w-xs leading-relaxed">
                Add flame-seared burgers, hand-rolled wraps, crispy chicken, or craft fries from our menu.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  setCurrentView('menu');
                }}
                className="mt-6 px-6 py-2.5 bg-[#C8351B] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#B32D15] transition-colors cursor-pointer"
              >
                Browse Full Menu
              </button>
            </div>
          ) : (
            items.map((ci) => (
              <div
                key={`${ci.item.id}-${ci.selectedSpice}`}
                className="bg-white rounded-xl p-3.5 border border-[#EAE4DC] flex gap-3 items-center justify-between shadow-2xs hover:border-[#181615]/30 transition-all"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-[#F5F1EB] overflow-hidden shrink-0 border border-[#EAE4DC]">
                  <img
                    src={ci.item.image}
                    alt={ci.item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-xs sm:text-sm text-[#181615] truncate">
                    {ci.item.name}
                  </h4>
                  <div className="text-[11px] text-[#181615]/60 mt-0.5 truncate">
                    {ci.selectedSpice && (
                      <span className="font-semibold text-[#C8351B]">{ci.selectedSpice}</span>
                    )}
                    {ci.notes && <span className="truncate"> · {ci.notes}</span>}
                  </div>
                  <div className="text-xs font-bold text-[#181615] tabular-nums mt-1">
                    Rs. {(ci.item.price * ci.quantity).toLocaleString('en-PK')}
                    {ci.quantity > 1 && (
                      <span className="text-[10px] text-[#181615]/50 font-normal ml-1">
                        (Rs. {ci.item.price.toLocaleString('en-PK')} each)
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => removeFromCart(ci.item.id, ci.selectedSpice)}
                    className="text-[#181615]/35 hover:text-[#C8351B] transition-colors p-1"
                    aria-label={`Remove ${ci.item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center border border-[#EAE4DC] rounded-lg bg-[#FCFAF7] shadow-2xs">
                    <button
                      onClick={() => updateQuantity(ci.item.id, -1, ci.selectedSpice)}
                      className="w-6 h-6 flex items-center justify-center text-[#181615] hover:bg-[#EAE4DC] cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#181615] tabular-nums">
                      {ci.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(ci.item.id, 1, ci.selectedSpice)}
                      className="w-6 h-6 flex items-center justify-center text-[#181615] hover:bg-[#EAE4DC] cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Action */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#EAE4DC] bg-white space-y-3.5">
            {/* Promo Code Input */}
            {promoApplied ? (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Promo <strong>{promoCode}</strong> applied (10% off)
                </span>
                <span className="text-emerald-700 font-bold">✓</span>
              </div>
            ) : (
              <div>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (try HOT10)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] uppercase tracking-wider focus:outline-hidden focus:border-[#C8351B]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#181615] text-white text-xs font-bold uppercase rounded-xl hover:bg-black transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {promoError && (
                  <span className="text-[10px] text-red-600 mt-1 block">
                    Use code &ldquo;HOT10&rdquo; for 10% off.
                  </span>
                )}
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#181615]/70 pt-2 border-t border-[#F2ECE4]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#181615] tabular-nums">Rs. {Math.round(subtotal).toLocaleString('en-PK')}</span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-[#C8351B]">
                  <span>Promo Discount (10%)</span>
                  <span className="font-semibold tabular-nums">-Rs. {Math.round(discount).toLocaleString('en-PK')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-semibold text-[#181615] tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `Rs. ${Math.round(deliveryFee).toLocaleString('en-PK')}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Sales Tax (5% GST)</span>
                <span className="font-semibold text-[#181615] tabular-nums">Rs. {Math.round(tax).toLocaleString('en-PK')}</span>
              </div>

              <div className="flex justify-between items-baseline text-sm font-bold text-[#181615] pt-2 border-t border-[#F2ECE4]">
                <span>Total Amount</span>
                <span className="text-xl font-black text-[#C8351B] tabular-nums font-display">
                  Rs. {Math.round(total).toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              type="button"
              className="w-full py-3.5 px-4 bg-[#C8351B] hover:bg-[#B32D15] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#181615]/50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Contact-free delivery &amp; live kitchen tracking</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
