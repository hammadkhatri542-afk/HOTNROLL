import React from 'react';
import { CheckCircle2, Flame, Clock, MapPin, Phone, User, ShoppingBag, ArrowRight, Printer, Share2, Bike } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const OrderSuccessPage: React.FC = () => {
  const { activeOrder, setCurrentView } = useCart();

  if (!activeOrder) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#FCFAF7] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-[#EAE4DC] shadow-sm">
          <ShoppingBag className="w-12 h-12 text-[#181615]/40 mx-auto mb-3" />
          <h2 className="font-display text-2xl font-black text-[#181615]">
            No Active Order Found
          </h2>
          <p className="text-sm text-[#181615]/70 mt-2">
            You don&apos;t have an active order session right now.
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

  const handlePrint = () => {
    window.print();
  };

  const paymentLabels: Record<string, string> = {
    cod: 'Cash on Delivery',
    card_delivery: 'Card on Delivery (POS Machine)',
    online_card: 'Paid via Card / Digital Wallet'
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#FCFAF7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Banner Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE4DC] shadow-sm text-center mb-8 relative overflow-hidden">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs border border-emerald-100">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C8351B] mb-2">
            <Flame className="w-4 h-4" />
            <span>Kitchen Order Confirmed &amp; In Queue</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#181615] tracking-tight">
            Thank You, {activeOrder.customerName}!
          </h1>

          <p className="text-sm sm:text-base text-[#181615]/75 mt-2 max-w-lg mx-auto leading-relaxed">
            Your flame-grilled feast is officially firing up in our kitchen. We&apos;ve cleared your cart and assigned your personal order number:
          </p>

          <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-[#FCFAF7] border-2 border-dashed border-[#C8351B]/40 rounded-2xl">
            <span className="text-xs uppercase font-bold text-[#181615]/60 tracking-wider">
              Order Number:
            </span>
            <span className="font-display font-black text-2xl text-[#C8351B] tracking-wider select-all">
              #{activeOrder.orderNumber}
            </span>
          </div>

          {/* Real-time Order Progress Stepper */}
          <div className="mt-10 pt-8 border-t border-[#F2ECE4] max-w-2xl mx-auto">
            <div className="grid grid-cols-4 gap-2 text-center relative">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#C8351B] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  ✓
                </div>
                <span className="font-display font-bold text-xs text-[#181615] mt-2">Placed</span>
                <span className="text-[10px] text-[#181615]/50">{activeOrder.createdAt}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#C8351B] text-white flex items-center justify-center text-xs font-bold animate-pulse shadow-xs">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="font-display font-bold text-xs text-[#C8351B] mt-2">Grilling Now</span>
                <span className="text-[10px] text-[#181615]/50">500° Cast Iron</span>
              </div>

              <div className="flex flex-col items-center opacity-50">
                <div className="w-8 h-8 rounded-full bg-[#F2ECE4] text-[#181615] flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="font-display font-bold text-xs text-[#181615] mt-2">En Route</span>
                <span className="text-[10px] text-[#181615]/50">Hot Thermal Box</span>
              </div>

              <div className="flex flex-col items-center opacity-50">
                <div className="w-8 h-8 rounded-full bg-[#F2ECE4] text-[#181615] flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <span className="font-display font-bold text-xs text-[#181615] mt-2">Delivered</span>
                <span className="text-[10px] text-[#181615]/50">At Your Door</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details & Receipt Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Itemized Receipt (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE4DC] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE4]">
              <h3 className="font-display text-lg font-bold text-[#181615]">
                Itemized Receipt
              </h3>
              <span className="text-xs text-[#181615]/60 font-semibold">
                {activeOrder.items.length} {activeOrder.items.length === 1 ? 'dish' : 'dishes'}
              </span>
            </div>

            <div className="divide-y divide-[#F2ECE4] my-2">
              {activeOrder.items.map((ci, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={ci.item.image}
                      alt={ci.item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-[#F5F1EB] shrink-0 border border-[#EAE4DC]"
                    />
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-sm text-[#181615] truncate">
                        {ci.item.name}
                      </h4>
                      <p className="text-xs text-[#181615]/60">
                        Qty: {ci.quantity} {ci.selectedSpice && `· ${ci.selectedSpice}`}
                        {ci.notes && ` (${ci.notes})`}
                      </p>
                    </div>
                  </div>

                  <span className="font-display font-bold text-sm text-[#181615] tabular-nums shrink-0">
                    Rs. {(ci.item.price * ci.quantity).toLocaleString('en-PK')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-[#F2ECE4] space-y-2 text-xs text-[#181615]/75">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#181615] tabular-nums">Rs. {Math.round(activeOrder.subtotal).toLocaleString('en-PK')}</span>
              </div>

              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-[#C8351B]">
                  <span>Discount</span>
                  <span className="font-semibold tabular-nums">-Rs. {Math.round(activeOrder.discount).toLocaleString('en-PK')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-semibold text-[#181615] tabular-nums">
                  {activeOrder.deliveryFee === 0 ? 'FREE' : `Rs. ${Math.round(activeOrder.deliveryFee).toLocaleString('en-PK')}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Sales Tax (5% GST)</span>
                <span className="font-semibold text-[#181615] tabular-nums">Rs. {Math.round(activeOrder.tax).toLocaleString('en-PK')}</span>
              </div>

              <div className="pt-3 border-t border-[#F2ECE4] flex justify-between items-baseline text-sm">
                <span className="font-display font-black text-base text-[#181615]">Total Amount</span>
                <span className="font-display font-black text-2xl text-[#C8351B] tabular-nums">
                  Rs. {Math.round(activeOrder.total).toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F2ECE4] flex items-center justify-between text-xs text-[#181615]/60">
              <span>Payment Mode:</span>
              <span className="font-bold text-[#181615]">
                {paymentLabels[activeOrder.paymentMethod] || 'Cash on Delivery'}
              </span>
            </div>
          </div>

          {/* Right Column: Delivery Details & Quick Actions (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Delivery Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE4DC] shadow-xs space-y-4">
              <h3 className="font-display text-base font-bold text-[#181615] pb-3 border-b border-[#F2ECE4]">
                Delivery Information
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-[#C8351B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#181615]/50 uppercase tracking-wider block font-bold text-[10px]">
                      Recipient
                    </span>
                    <span className="font-semibold text-[#181615]">{activeOrder.customerName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#C8351B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#181615]/50 uppercase tracking-wider block font-bold text-[10px]">
                      Contact Phone
                    </span>
                    <span className="font-semibold text-[#181615]">{activeOrder.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C8351B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#181615]/50 uppercase tracking-wider block font-bold text-[10px]">
                      Delivery Address
                    </span>
                    <span className="font-semibold text-[#181615] leading-relaxed">{activeOrder.deliveryAddress}</span>
                  </div>
                </div>

                {activeOrder.orderNotes && (
                  <div className="pt-2 border-t border-[#F2ECE4]">
                    <span className="text-[#181615]/50 uppercase tracking-wider block font-bold text-[10px] mb-1">
                      Order Notes
                    </span>
                    <p className="italic text-[#181615]/80 bg-[#FCFAF7] p-2.5 rounded-lg border border-[#EAE4DC]">
                      &ldquo;{activeOrder.orderNotes}&rdquo;
                    </p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-[#181615]/70">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#C8351B]" /> Estimated ETA:
                  </span>
                  <span className="font-bold text-[#181615]">25 – 35 minutes</span>
                </div>

                {activeOrder.assignedRiderName && (
                  <div className="pt-2 border-t border-[#F2ECE4] flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
                      <Bike className="w-3.5 h-3.5 text-emerald-600" /> Assigned Rider:
                    </span>
                    <span className="font-bold text-[#181615] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {activeOrder.assignedRiderName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions & Print */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE4DC] shadow-xs space-y-3">
              <button
                onClick={() => setCurrentView('menu')}
                className="w-full py-3.5 px-4 bg-[#C8351B] hover:bg-[#B32D15] text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Order More / Back to Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrint}
                className="w-full py-3 px-4 bg-[#FCFAF7] hover:bg-[#F2ECE4] text-[#181615] border border-[#EAE4DC] font-display font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#181615]/70" />
                <span>Print Order Receipt</span>
              </button>
            </div>

            {/* Kitchen Hotline Support */}
            <div className="p-4 rounded-2xl bg-[#F5F1EB] border border-[#EAE4DC] text-center text-xs text-[#181615]/70">
              <p>Need to update your delivery address or contact the driver?</p>
              <a href="tel:+15553927655" className="font-bold text-[#C8351B] hover:underline mt-1 inline-block">
                Call Direct Kitchen Hotline: +1 (555) 392-7655
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
