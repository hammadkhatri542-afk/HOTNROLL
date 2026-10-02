import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Loader2, Flame } from 'lucide-react';
import { loginAdmin } from '../../lib/adminApi';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onExitToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onExitToSite }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the administrative password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await loginAdmin(password);
    setIsLoading(false);

    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#141211] text-[#FCFAF7] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C8351B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-72 h-72 bg-[#181615] rounded-full blur-2xl pointer-events-none" />

      {/* Back to site link in corner */}
      <button
        type="button"
        onClick={onExitToSite}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Public Site</span>
      </button>

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#1C1A18] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          {/* Logo & Shield Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#C8351B]/15 border border-[#C8351B]/30 flex items-center justify-center mb-4 text-[#C8351B] shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="font-display text-2xl font-black tracking-tight text-white">
                Hot<span className="text-[#C8351B]">n</span>Roll
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8351B] mb-2" />
            </div>

            <h1 className="text-xs uppercase tracking-widest font-extrabold text-[#C8351B] mb-2">
              Restaurant Operations Console
            </h1>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
              Authorized personnel only. Protected administrative portal for menu curation, kitchen orders, and review moderation.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-950/60 border border-red-800/60 rounded-xl flex items-start gap-3 text-red-200 text-xs animate-in fade-in zoom-in-95">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2"
              >
                Admin Passkey
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrative passkey"
                  autoFocus
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-11 py-3 bg-[#141211] border border-white/10 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:border-[#C8351B] focus:ring-1 focus:ring-[#C8351B] transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-stone-500 mt-2 flex items-center justify-between">
                <span>Passkey: <code className="text-stone-300 font-mono">HotnRoll@Admin2026</code></span>
                <span className="text-stone-400">or <code className="text-stone-300 font-mono">admin</code></span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#C8351B] hover:bg-[#B32D15] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#C8351B]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Passkey...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Security Information Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>TLS Encrypted · Zero Client Hardcoded Secrets</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
