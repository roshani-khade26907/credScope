import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CreditScoreAssessment } from './pages/CreditScoreAssessment';
import { LoanEligibility } from './pages/LoanEligibility';
import { ModelEvaluation } from './pages/ModelEvaluation';
import { FinancialSimulator } from './pages/FinancialSimulator';
import { PredictionHistory } from './pages/PredictionHistory';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (['landing', 'dashboard', 'score', 'loans', 'explainability', 'simulator', 'history'].includes(hash)) {
      return hash;
    }
    return 'landing';
  });

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['landing', 'dashboard', 'score', 'loans', 'explainability', 'simulator', 'history'].includes(hash)) {
        setCurrentTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-white text-slate-100 dark:text-slate-100 light:text-slate-900 transition-colors flex flex-col">
          {/* Top Bar Contract Navigation */}
          <Navbar currentTab={currentTab} onSelectTab={handleSelectTab} />

          {/* Main Content Area */}
          <main className="flex-1">
            {currentTab === 'landing' && <LandingPage onNavigate={handleSelectTab} />}
            {currentTab === 'dashboard' && <Dashboard onNavigate={handleSelectTab} />}
            {currentTab === 'score' && <CreditScoreAssessment onNavigate={handleSelectTab} />}
            {currentTab === 'loans' && <LoanEligibility onNavigate={handleSelectTab} />}
            {currentTab === 'explainability' && <ModelEvaluation />}
            {currentTab === 'simulator' && <FinancialSimulator onNavigate={handleSelectTab} />}
            {currentTab === 'history' && <PredictionHistory />}
          </main>

          {/* Compliant Footer */}
          <Footer onSelectTab={handleSelectTab} />

          {/* Account & Profile Switcher Modal */}
          <AuthModal />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
