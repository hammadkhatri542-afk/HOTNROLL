/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedMenu } from './components/FeaturedMenu';
import { MenuPage } from './components/MenuPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { AboutStory } from './components/AboutStory';
import { Reviews } from './components/Reviews';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CartToast } from './components/CartToast';
import { AdminApp } from './components/admin/AdminApp';
import { MenuItem } from './types';

function MainAppContent() {
  const { currentView } = useCart();
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7] text-[#181615]">
      {/* Navigation */}
      <Navbar />

      {/* Dynamic View Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero />
            <FeaturedMenu onOpenModal={(item) => setModalItem(item)} />
            <AboutStory />
            <Reviews />
            <ContactSection />
          </>
        )}

        {currentView === 'menu' && (
          <MenuPage onOpenModal={(item) => setModalItem(item)} />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage />
        )}

        {currentView === 'order-success' && (
          <OrderSuccessPage />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Overlays & Drawers */}
      <ProductModal item={modalItem} onClose={() => setModalItem(null)} />
      <CartDrawer />
      <CartToast />
    </div>
  );
}

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin'));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleExitToSite = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  if (isAdminRoute) {
    return <AdminApp onExitToSite={handleExitToSite} />;
  }

  return (
    <CartProvider>
      <MainAppContent />
    </CartProvider>
  );
}

