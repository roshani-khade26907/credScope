import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, UserCheck, Mail, User } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { user, login, showAuthModal, setShowAuthModal } = useAuth();
  const [email, setEmail] = useState(user.email);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await login(email, displayName);
    setIsSubmitting(false);
  };

  const handleDemoSwitch = async (demoEmail: string, demoName: string) => {
    setIsSubmitting(true);
    await login(demoEmail, demoName);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Client Session &amp; Profile</h3>
            <p className="text-xs text-slate-400">Manage account identity to isolate prediction history</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-semibold text-xs shadow-md shadow-rose-950/40 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Save & Continue'}
          </button>
        </form>

        {/* Quick Demo Profiles Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Switch Pre-configured Profile:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoSwitch('roshanikhade2609@gmail.com', 'Roshani Khade')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
            >
              <div className="font-semibold text-slate-200 truncate">Roshani Khade</div>
              <div className="text-[10px] text-slate-500 truncate">Prime Score Profile</div>
            </button>
            <button
              onClick={() => handleDemoSwitch('alex.chen@fintech.test', 'Alex Chen')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
            >
              <div className="font-semibold text-slate-200 truncate">Alex Chen</div>
              <div className="text-[10px] text-slate-500 truncate">New Borrower Profile</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
