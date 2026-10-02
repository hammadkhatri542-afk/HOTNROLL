import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { verifyAdminSession, clearAdminToken } from '../../lib/adminApi';
import { Loader2 } from 'lucide-react';

interface AdminAppProps {
  onExitToSite: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onExitToSite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      const valid = await verifyAdminSession();
      if (isMounted) {
        setIsAuthenticated(valid);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    clearAdminToken();
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#11100F] text-[#FCFAF7] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C8351B] animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest font-bold text-stone-400">
          Securing Admin Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onExitToSite={onExitToSite}
      />
    );
  }

  return (
    <AdminDashboard
      onLogout={handleLogout}
      onExitToSite={onExitToSite}
    />
  );
};
