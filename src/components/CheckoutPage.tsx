import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Clock, MapPin, Phone, User, FileText, CreditCard, Banknote, CheckCircle, Flame, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    promoCode,
    promoApplied,
    applyPromo,
    placeOrder,
    setCurrentView
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card_delivery' | 'online_card'>('cod');
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If cart is empty, show return prompt
  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#FCFAF7] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-[#EAE4DC] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#F4EFEA] flex items-center justify-center mx-auto mb-4 text-[#181615]/40">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl font-black text-[#181615]">
            Your Bag is Empty
          </h2>
          <p className="text-sm text-[#181615]/70 mt-2">
            Please add some delicious items from our menu before proceeding to checkout.
          </p>
          <button
            onClick={() => setCurrentView('menu')}
            className="mt-6 px-6 py-3 bg-[#C8351B] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#B32D15] transition-colors"
          >
            Explore Menu
          </button>
        </div>
      </div>
    );
  }

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const ok = applyPromo(promoInput);
    if (!ok) {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 3000);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setErrorMsg('Please enter a valid phone number for delivery coordination.');
      return;
    }
    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      setErrorMsg('Please enter a complete delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      await placeOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        orderNotes: orderNotes.trim(),
        paymentMethod
      });
    } catch (err: any) {
      console.error('Order submission error:', err);
      setErrorMsg('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#FCFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="py-4">
          <button
            onClick={() => setCurrentView('menu')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#181615]/60 hover:text-[#C8351B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8351B] mb-2">
            <Flame className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#181615] tracking-tight">
            Review & Place Your Order
          </h1>
          <p className="text-sm text-[#181615]/70 mt-1">
            Freshly prepared upon your confirmation. Estimated delivery time: 25 – 35 minutes.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Customer & Delivery Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Contact Information */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE4DC] shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#F2ECE4] mb-5">
                <div className="w-7 h-7 rounded-lg bg-[#C8351B] text-white flex items-center justify-center font-display font-bold text-xs">
                  1
                </div>
                <h3 className="font-display text-lg font-bold text-[#181615]">
                  Customer Contact
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#181615]/70 mb-1.5">
                    Customer Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#181615]/40" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam Sterling"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] focus:bg-white focus:outline-hidden focus:border-[#C8351B] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#181615]/70 mb-1.5">
                    Phone Number (WhatsApp for Rider) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#181615]/40" />
                    <input
                      type="tel"
                      required
                      placeholder="0300 1234567 or +92 300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] focus:bg-white focus:outline-hidden focus:border-[#C8351B] transition-colors"
                    />
                  </div>
                  <span className="text-[10px] text-[#181615]/50 mt-1 block">
                    Our delivery rider will call or message before arrival.
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address & Notes */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE4DC] shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#F2ECE4] mb-5">
                <div className="w-7 h-7 rounded-lg bg-[#C8351B] text-white flex items-center justify-center font-display font-bold text-xs">
                  2
                </div>
                <h3 className="font-display text-lg font-bold text-[#181615]">
                  Delivery Address & Instructions
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#181615]/70 mb-1.5">
                    Complete Address & Sector / Block *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-[#181615]/40" />
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. House 42-B, Street 14, Phase 6 DHA / Block 4 Clifton (Near Shell Pump)"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] focus:bg-white focus:outline-hidden focus:border-[#C8351B] transition-colors resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#181615]/70 mb-1.5">
                    Optional Rider Instructions / Nearby Landmark
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3.5 top-3 text-[#181615]/40" />
                    <textarea
                      rows={2}
                      placeholder="e.g. Near Masjid, gate code, call upon reaching main gate, please bring exact cash change..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] focus:bg-white focus:outline-hidden focus:border-[#C8351B] transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE4DC] shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#F2ECE4] mb-5">
                <div className="w-7 h-7 rounded-lg bg-[#C8351B] text-white flex items-center justify-center font-display font-bold text-xs">
                  3
                </div>
                <h3 className="font-display text-lg font-bold text-[#181615]">
                  Payment Method
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-[#C8351B] bg-[#C8351B]/5 text-[#181615]'
                      : 'border-[#EAE4DC] hover:border-[#181615]/40 text-[#181615]/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Banknote className="w-5 h-5 text-[#C8351B]" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#C8351B]"
                    />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-[#181615]">
                      Cash on Delivery
                    </h4>
                    <p className="text-[11px] text-[#181615]/60 mt-0.5">
                      Pay cash to rider upon delivery
                    </p>
                  </div>
                </label>

                {/* Card on Delivery */}
                <label
                  onClick={() => setPaymentMethod('card_delivery')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'card_delivery'
                      ? 'border-[#C8351B] bg-[#C8351B]/5 text-[#181615]'
                      : 'border-[#EAE4DC] hover:border-[#181615]/40 text-[#181615]/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <CreditCard className="w-5 h-5 text-[#C8351B]" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card_delivery'}
                      onChange={() => setPaymentMethod('card_delivery')}
                      className="accent-[#C8351B]"
                    />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-[#181615]">
                      Card on Delivery
                    </h4>
                    <p className="text-[11px] text-[#181615]/60 mt-0.5">
                      Rider carries card machine
                    </p>
                  </div>
                </label>

                {/* Online Card / Digital */}
                <label
                  onClick={() => setPaymentMethod('online_card')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'online_card'
                      ? 'border-[#C8351B] bg-[#C8351B]/5 text-[#181615]'
                      : 'border-[#EAE4DC] hover:border-[#181615]/40 text-[#181615]/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <CheckCircle className="w-5 h-5 text-[#C8351B]" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'online_card'}
                      onChange={() => setPaymentMethod('online_card')}
                      className="accent-[#C8351B]"
                    />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-[#181615]">
                      Online / Digital
                    </h4>
                    <p className="text-[11px] text-[#181615]/60 mt-0.5">
                      Debit Card / JazzCash / Raast
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-[#181615]/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Encrypted transmission. No payment information is ever shared with third parties.</span>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE4DC] shadow-sm sticky top-28">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE4]">
                <h3 className="font-display text-lg font-bold text-[#181615]">
                  Order Summary
                </h3>
                <span className="text-xs font-semibold text-[#181615]/60">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#F2ECE4] max-h-64 overflow-y-auto py-2 pr-1">
                {items.map((ci) => (
                  <div key={`${ci.item.id}-${ci.selectedSpice}`} className="py-3 flex items-center gap-3">
                    <img
                      src={ci.item.image}
                      alt={ci.item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-[#F5F1EB] shrink-0 border border-[#EAE4DC]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-xs sm:text-sm text-[#181615] truncate">
                        {ci.item.name}
                      </h4>
                      <p className="text-[11px] text-[#181615]/55 truncate">
                        Qty: {ci.quantity} {ci.selectedSpice && `· ${ci.selectedSpice}`}
                        {ci.notes && ` · ${ci.notes}`}
                      </p>
                    </div>
                    <span className="font-display font-bold text-xs sm:text-sm text-[#181615] tabular-nums shrink-0">
                      Rs. {(ci.item.price * ci.quantity).toLocaleString('en-PK')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo code form */}
              <div className="pt-4 border-t border-[#F2ECE4]">
                {promoApplied ? (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between">
                    <span>Code <strong>{promoCode}</strong> applied (10% off)</span>
                    <span className="text-emerald-700 font-bold">✓ Active</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code (e.g. HOT10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] uppercase tracking-wider focus:outline-hidden focus:border-[#C8351B]"
                      />
                      <button
                        type="button"
                        onClick={handlePromoSubmit}
                        className="px-3.5 py-2 bg-[#181615] text-white text-xs font-bold uppercase rounded-xl hover:bg-black transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <span className="text-[11px] text-red-600 block">
                        Invalid code. Try using &ldquo;HOT10&rdquo; for 10% off.
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="mt-4 pt-4 border-t border-[#F2ECE4] space-y-2 text-xs text-[#181615]/75">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#181615] tabular-nums">Rs. {Math.round(subtotal).toLocaleString('en-PK')}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-[#C8351B]">
                    <span>Discount</span>
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

                <div className="pt-3 border-t border-[#F2ECE4] flex justify-between items-baseline">
                  <span className="font-display font-black text-base text-[#181615]">Total to Pay</span>
                  <span className="font-display font-black text-2xl text-[#C8351B] tabular-nums">
                    Rs. {Math.round(total).toLocaleString('en-PK')}
                  </span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-[#C8351B] hover:bg-[#B32D15] active:scale-[0.99] text-white font-display font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Firing Up Grill & Dispatching...
                    </span>
                  ) : (
                    <>
                      <span>Place Order (Rs. {Math.round(total).toLocaleString('en-PK')})</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F2ECE4] flex items-center justify-between text-[11px] text-[#181615]/50">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C8351B]" /> 25-35 mins delivery
                </span>
                <span>HotnRoll Fresh Seal Guarantee</span>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
