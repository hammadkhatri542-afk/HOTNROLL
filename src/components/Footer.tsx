import React from 'react';
import { ArrowUp, Instagram, Facebook, Twitter } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useCart();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: 'home' | 'menu', hash?: string) => {
    setCurrentView(view);
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#181615] text-[#FCFAF7] pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => handleNavigate('home')}
              type="button"
              className="inline-flex items-center gap-1.5 group select-none text-left cursor-pointer"
            >
              <span className="font-display text-2xl font-black tracking-tight text-white group-hover:text-[#C8351B] transition-colors">
                Hot<span className="text-[#C8351B]">n</span>Roll
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8351B] mb-2" />
            </button>

            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Open flame smash burgers, 48-hour slow herb marinades, and fresh handmade flatbread rolls baked and prepared upon every single order.
            </p>

            {/* Social Media Placeholders */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="#social"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#C8351B] text-stone-300 hover:text-white transition-colors flex items-center justify-center"
                aria-label="Follow HotnRoll on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#C8351B] text-stone-300 hover:text-white transition-colors flex items-center justify-center"
                aria-label="Follow HotnRoll on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#C8351B] text-stone-300 hover:text-white transition-colors flex items-center justify-center"
                aria-label="Follow HotnRoll on X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#C8351B] text-stone-300 hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
                aria-label="Follow HotnRoll on TikTok"
              >
                TT
              </a>
            </div>
          </div>

          {/* Quick Links to Menu */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Menu
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => handleNavigate('menu')} className="hover:text-white transition-colors text-left">
                  Smash Burgers
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('menu')} className="hover:text-white transition-colors text-left">
                  Artisanal Rolls
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('menu')} className="hover:text-white transition-colors text-left">
                  Wood-Fired Pizza
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('menu')} className="hover:text-white transition-colors text-left">
                  Crispy Chicken &amp; Wings
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('menu')} className="hover:text-white transition-colors text-left">
                  Hand-Cut Fries &amp; Deals
                </button>
              </li>
            </ul>
          </div>

          {/* Kitchen & Experience */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
              Experience
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => handleNavigate('home', 'about')} className="hover:text-white transition-colors text-left">
                  Our Kitchen Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('home', 'reviews')} className="hover:text-white transition-colors text-left">
                  Guest Reviews
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('home', 'contact')} className="hover:text-white transition-colors text-left">
                  Private Catering
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('home', 'about')} className="hover:text-white transition-colors text-left">
                  100% Halal Angus Sourcing
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('home', 'contact')} className="hover:text-white transition-colors text-left">
                  Table Reservations
                </button>
              </li>
            </ul>
          </div>

          {/* Flagship Info */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
              Location &amp; Hours
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="text-white font-medium">482 Culinary Row</p>
              <p>Ember District, NY 10012</p>
              <p className="pt-2 text-white font-medium">Mon – Thu: 11am – 10:30pm</p>
              <p className="text-[#C8351B] font-medium">Fri – Sat: 11am – 12:00am</p>
              <p>Sun: 12pm – 10pm</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 HotnRoll Hospitality Group. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
