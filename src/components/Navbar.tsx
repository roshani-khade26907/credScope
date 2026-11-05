import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, User, Menu, X, Shield, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, setShowAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'score', label: 'Score Predictor' },
    { id: 'loans', label: 'Loan Eligibility' },
    { id: 'explainability', label: 'XAI & Benchmarks' },
    { id: 'simulator', label: 'What-If Simulator' },
    { id: 'history', label: 'History' },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 dark:bg-slate-950/80 light:bg-white/80 backdrop-blur-md border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400 group-hover:border-rose-400 transition-colors shadow-sm shadow-rose-950">
            <Shield className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white dark:text-white light:text-slate-900 whitespace-nowrap shrink-0">
            CrediScope <span className="text-rose-400 font-semibold">AI</span>
          </span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                  isActive
                    ? 'text-rose-400 font-semibold'
                    : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full shadow-sm shadow-rose-500/50" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary action & User profile control */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Account / Profile */}
          <button
            onClick={() => setShowAuthModal(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300 hover:border-rose-500/40 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-rose-950 border border-rose-800/50 text-rose-300 flex items-center justify-center font-bold text-[10px]">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[120px] truncate">{user.displayName}</span>
          </button>

          {/* Quick Primary Assessment CTA */}
          <button
            onClick={() => handleNavClick('score')}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-600 rounded-lg shadow-md shadow-rose-950/40 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 border border-rose-600/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-200" />
            <span>Analyze Profile</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-slate-900 border-b border-slate-800 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentTab === item.id
                  ? 'bg-rose-950/60 text-rose-300 font-semibold border border-rose-800/40'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">{user.email}</span>
            <button
              onClick={() => {
                setShowAuthModal(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs text-rose-400 font-medium"
            >
              Account Settings
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
