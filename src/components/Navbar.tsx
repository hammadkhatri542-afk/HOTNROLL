import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ViewType } from '../types';

export const Navbar: React.FC = () => {
  const { totalItems, openCart, currentView, setCurrentView } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: ViewType, hash?: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);

    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          scrolled
            ? 'bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#EAE4DC] shadow-xs py-3.5'
            : 'bg-[#FCFAF7] border-b border-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            type="button"
            className="flex items-center gap-1.5 group select-none cursor-pointer text-left bg-transparent border-none p-0"
            aria-label="HotnRoll Home"
          >
            <span className="font-display text-2xl font-black tracking-tight text-[#181615] group-hover:text-[#C8351B] transition-colors">
              Hot<span className="text-[#C8351B]">n</span>Roll
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8351B] mb-2 group-hover:scale-125 transition-transform" />
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#181615]/80">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-[#C8351B] transition-colors relative py-1 text-sm tracking-normal cursor-pointer ${
                currentView === 'home' ? 'text-[#C8351B] font-bold' : ''
              }`}
            >
              Home
              {currentView === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8351B] rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('menu')}
              className={`hover:text-[#C8351B] transition-colors relative py-1 text-sm tracking-normal cursor-pointer flex items-center gap-1 ${
                currentView === 'menu' ? 'text-[#C8351B] font-bold' : ''
              }`}
            >
              Menu
              <span className="text-[10px] px-1.5 py-0.2 bg-[#C8351B]/10 text-[#C8351B] rounded-md font-extrabold uppercase">
                All
              </span>
              {currentView === 'menu' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8351B] rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('home', 'about')}
              className="hover:text-[#C8351B] transition-colors relative py-1 text-sm tracking-normal cursor-pointer"
            >
              About
            </button>

            <button
              onClick={() => handleNavClick('home', 'reviews')}
              className="hover:text-[#C8351B] transition-colors relative py-1 text-sm tracking-normal cursor-pointer"
            >
              Reviews
            </button>

            <button
              onClick={() => handleNavClick('home', 'contact')}
              className="hover:text-[#C8351B] transition-colors relative py-1 text-sm tracking-normal cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Action Zone: Cart & Order CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              type="button"
              className="relative p-2.5 rounded-xl border border-[#EAE4DC] bg-white text-[#181615] hover:border-[#181615] hover:bg-[#F3EFEA] transition-all cursor-pointer flex items-center justify-center shadow-2xs"
              aria-label={`Cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5 text-[#181615]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-[#C8351B] text-white text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-xs animate-in zoom-in-75">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('menu')}
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#C8351B] hover:bg-[#B32D15] rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <span>Order Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 rounded-xl border border-[#EAE4DC] bg-white text-[#181615] hover:bg-[#F3EFEA] transition-colors cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-[#181615]/50 backdrop-blur-xs">
          <div className="bg-[#FCFAF7] border-b border-[#EAE4DC] p-6 shadow-2xl w-full">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE4DC]">
              <span className="font-display text-xl font-extrabold text-[#181615]">
                Hot<span className="text-[#C8351B]">n</span>Roll
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#181615] hover:text-[#C8351B]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 py-6">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-left text-lg font-bold py-1 ${
                  currentView === 'home' ? 'text-[#C8351B]' : 'text-[#181615]'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNavClick('menu')}
                className={`text-left text-lg font-bold py-1 flex items-center justify-between ${
                  currentView === 'menu' ? 'text-[#C8351B]' : 'text-[#181615]'
                }`}
              >
                <span>Full Menu</span>
                <span className="text-xs bg-[#C8351B] text-white px-2 py-0.5 rounded-full font-bold">
                  All Items
                </span>
              </button>

              <button
                onClick={() => handleNavClick('home', 'about')}
                className="text-left text-lg font-semibold text-[#181615] py-1"
              >
                About Our Kitchen
              </button>

              <button
                onClick={() => handleNavClick('home', 'reviews')}
                className="text-left text-lg font-semibold text-[#181615] py-1"
              >
                Customer Reviews
              </button>

              <button
                onClick={() => handleNavClick('home', 'contact')}
                className="text-left text-lg font-semibold text-[#181615] py-1"
              >
                Contact &amp; Location
              </button>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => handleNavClick('menu')}
                className="w-full text-center py-3 text-sm font-bold uppercase tracking-wider text-white bg-[#C8351B] hover:bg-[#B32D15] rounded-xl transition-colors shadow-xs"
              >
                Explore &amp; Order Online
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
                className="w-full py-2.5 text-sm font-semibold text-[#181615] border border-[#EAE4DC] bg-white rounded-xl flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#C8351B]" />
                View Cart ({totalItems} items)
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
