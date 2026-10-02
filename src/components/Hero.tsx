import React from 'react';
import { ArrowRight, Flame, Clock, Plus, Check } from 'lucide-react';
import { burgerImg, MENU_ITEMS } from '../data/menu';
import { useCart } from '../context/CartContext';

export const Hero: React.FC = () => {
  const { addToCart, items, setCurrentView, openCart } = useCart();
  const signatureBurger = MENU_ITEMS[0];
  const isAdded = items.some((ci) => ci.item.id === signatureBurger.id);

  const handleQuickAdd = () => {
    addToCart(signatureBurger);
  };

  return (
    <section id="home" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Subtle organic warm aura for depth */}
      <div className="absolute top-1/4 right-0 -z-10 w-96 h-96 bg-[#C8351B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 w-72 h-72 bg-[#181615]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline, Story & CTAs (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Clean Unboxed Metadata / Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8351B] mb-4">
              <Flame className="w-4 h-4 text-[#C8351B]" />
              <span>Flame-Fired Craft</span>
              <span aria-hidden="true" className="text-[#181615]/20">·</span>
              <span className="text-[#181615]/70">Freshly Hand-Rolled</span>
              <span aria-hidden="true" className="text-[#181615]/20">·</span>
              <span className="text-[#181615]/70">Ember District</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-[#181615] leading-[1.08] tracking-tight mb-6 max-w-2xl">
              Charred over open fire, <br className="hidden sm:inline" />
              <span className="text-[#C8351B]">rolled with obsession.</span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-[#181615]/75 leading-relaxed mb-8 max-w-xl">
              We smash aged prime Angus beef across screaming-hot cast iron, bake our golden brioche at dawn, and roll our charred wraps in flaky, herb-infused flatbread. Real ingredients, zero shortcuts.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                type="button"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white bg-[#C8351B] hover:bg-[#B32D15] rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                type="button"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#181615] bg-white border border-[#EAE4DC] hover:border-[#181615] hover:bg-[#F3EFEA] rounded-xl transition-all cursor-pointer"
              >
                <span>Explore Full Menu</span>
              </button>
            </div>

            {/* Proof & Standards */}
            <div className="pt-6 border-t border-[#EAE4DC] grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="font-display text-2xl font-black text-[#181615] tabular-nums">100%</p>
                <p className="text-xs text-[#181615]/60 mt-0.5 font-medium">Prime Angus Beef</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black text-[#181615] tabular-nums">48 hr</p>
                <p className="text-xs text-[#181615]/60 mt-0.5 font-medium">Slow Herb Marinade</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black text-[#181615] tabular-nums">&lt; 15m</p>
                <p className="text-xs text-[#181615]/60 mt-0.5 font-medium">Fresh Order Prep</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Food Showcase Image (5 cols on lg) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Image Frame with Single-Elevation Depth */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#EAE4DC] bg-[#181615]/5 aspect-square group">
                <img
                  src={burgerImg}
                  alt="HotnRoll Signature Double Smash Burger with melted aged cheddar and bacon on brioche"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle gradient scrim at bottom for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#181615]/80 via-[#181615]/10 to-transparent pointer-events-none" />

                {/* Elegant Chef's Seal in Top Corner */}
                <div className="absolute top-4 left-4 bg-[#181615]/90 backdrop-blur-md text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8351B]" />
                  <span>Signature Creation</span>
                </div>

                {/* Prominent Burger Price Badge */}
                <div className="absolute top-4 right-4 bg-[#C8351B] text-white px-3.5 py-1.5 rounded-xl shadow-xl font-display font-black text-base tabular-nums flex items-baseline gap-1 border border-white/20 z-10">
                  <span className="text-xs font-bold opacity-90">Rs.</span>
                  <span>1,450</span>
                </div>

                {/* Overlay Card on Image */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#EAE4DC] shadow-lg flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-display font-bold text-sm sm:text-base text-[#181615] truncate">
                        The Truffle Smoked Beast
                      </h2>
                    </div>
                    <p className="text-xs text-[#181615]/65 truncate mt-0.5">
                      Double smash, aged cheddar, crispy bacon
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-display font-black text-lg text-[#C8351B] tabular-nums">
                        Rs. 1,450
                      </span>
                      <span className="text-[11px] text-[#181615]/50 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 10-12 min
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <button
                    onClick={handleQuickAdd}
                    type="button"
                    className={`shrink-0 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-[#181615] text-white'
                        : 'bg-[#C8351B] text-white hover:bg-[#B32D15]'
                    }`}
                    aria-label="Add The Truffle Smoked Beast to cart"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Decorative culinary citation */}
              <div className="mt-3 flex items-center justify-between text-xs text-[#181615]/55 px-1 font-medium">
                <span>* Made fresh upon order</span>
                <span className="text-[#C8351B] font-semibold">100% Halal Angus</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
