import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  Sliders,
  ArrowRight,
  Sparkles,
  Lock,
  FileCheck2,
  HelpCircle,
  ChevronDown,
  Layers,
  Banknote,
  GraduationCap,
  Home,
  Car
} from 'lucide-react';
import { CreditScoreGauge } from '../components/CreditScoreGauge';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Quick interactive estimator state for landing page
  const [quickIncome, setQuickIncome] = useState(5500);
  const [quickDebt, setQuickDebt] = useState(600);
  const [quickUtil, setQuickUtil] = useState(24);
  const [quickHistory, setQuickHistory] = useState(5);

  // Live calculation for preview
  const previewDti = Math.round((quickDebt / quickIncome) * 100);
  const estimatedPreviewScore = Math.max(300, Math.min(850, Math.round(
    675 +
    (quickUtil <= 25 ? 35 : quickUtil <= 50 ? -10 : -60) +
    (previewDti <= 20 ? 30 : previewDti <= 40 ? 10 : -40) +
    (quickHistory >= 6 ? 25 : 5)
  )));

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'Is CrediScope AI an official credit bureau or lender?',
      a: 'No. CrediScope AI is an educational decision-support prototype. It uses genuine machine learning models trained on academic benchmarks (German Credit Statlog and Give Me Some Credit) to estimate credit risk and eligibility. It does not pull hard inquiries or provide binding lending contracts.'
    },
    {
      q: 'How does the credit score estimation differ from loan eligibility?',
      a: 'A continuous credit score (300-850) assesses your historical repayment likelihood and debt habits. Loan eligibility evaluates product-specific affordability (Equated Monthly Installment vs your Debt-to-Income capacity, tenure, and collateral requirements) for Personal, Education, Home, or Vehicle financing.'
    },
    {
      q: 'Are protected demographic attributes used in predictions?',
      a: 'No. In strict accordance with responsible AI and the Equal Credit Opportunity Act principles, CrediScope AI never collects or processes race, gender, marital status, religion, or nationality. Predictions rely strictly on verified financial behavior and debt metrics.'
    },
    {
      q: 'What is SHAP and how does it explain predictions?',
      a: 'SHAP (Shapley Additive Explanations) is a game-theoretic approach to explain machine learning models. It calculates the exact positive or negative score points contributed by each financial factor (such as your utilization ratio or payment delays) relative to a population baseline.'
    }
  ];

  const loanCategories = [
    {
      id: 'personal',
      title: 'Personal Loans',
      icon: Banknote,
      interest: 'From 10.75% p.a.',
      tenure: 'Up to 5 years',
      description: 'Unsecured installment credit for consolidation, emergencies, and liquidity needs.'
    },
    {
      id: 'education',
      title: 'Education Loans',
      icon: GraduationCap,
      interest: 'From 7.95% p.a.',
      tenure: 'Up to 15 years',
      description: 'Specialized student financing with grace period flexibility and academic rate benefits.'
    },
    {
      id: 'home',
      title: 'Home Loans (Mortgage)',
      icon: Home,
      interest: 'From 6.45% p.a.',
      tenure: 'Up to 30 years',
      description: 'Residential property purchase and construction mortgages with high borrowing ceilings.'
    },
    {
      id: 'vehicle',
      title: 'Vehicle Loans (Auto)',
      icon: Car,
      interest: 'From 7.25% p.a.',
      tenure: 'Up to 7 years',
      description: 'Secured new and pre-owned vehicle financing with standardized amortization schedules.'
    }
  ];

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs font-medium">
                <BrainCircuit className="w-3.5 h-3.5 text-rose-400" />
                <span>Dual ML Benchmark · German Credit &amp; GMSC Engine</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                Understand Your Credit.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-200 to-amber-200">
                  Unlock Smarter Financial Decisions.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Explore your estimated credit profile, assess potential loan eligibility, and discover the financial factors that shape your creditworthiness with AI-powered insights.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('score')}
                  className="px-6 py-3.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-950/40 transition-all flex items-center gap-2"
                >
                  <span>Analyze My Credit Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('explainability')}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  <span>Explore How It Works</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>No Hard Credit Pull</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>Zero Demographic Bias</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span>SHAP XAI Explainability</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Hero Asset */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-2xl relative group">
                <img
                  src="/src/assets/images/hero_fintech_analytics_1793900929632.jpg"
                  alt="CrediScope AI Fintech Analytics Visualization"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Float Card Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400">Current Top Model</div>
                      <div className="font-bold text-white">Random Forest (n=150)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Cross-Validated AUC</div>
                      <div className="font-mono font-bold text-rose-400">0.892 ROC-AUC</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Quick Estimate Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 via-[#180912]/80 to-slate-950 border border-slate-800/90 shadow-xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Interactive Preview</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Test Real-Time Credit Factors
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Adjust key financial variables below to see immediate calibrated score response before starting full multi-step assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span>Monthly Gross Income</span>
                  <span className="font-mono font-semibold text-rose-400">${quickIncome.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="20000"
                  step="250"
                  value={quickIncome}
                  onChange={(e) => setQuickIncome(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span>Existing Monthly Debt Payments</span>
                  <span className="font-mono font-semibold text-rose-400">${quickDebt.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={quickDebt}
                  onChange={(e) => setQuickDebt(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span>Credit Card Utilization Ratio</span>
                  <span className="font-mono font-semibold text-rose-400">{quickUtil}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={quickUtil}
                  onChange={(e) => setQuickUtil(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span>Credit History Longevity</span>
                  <span className="font-mono font-semibold text-rose-400">{quickHistory} Years</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={quickHistory}
                  onChange={(e) => setQuickHistory(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between text-slate-400">
                <span>Calculated Debt-to-Income (DTI):</span>
                <span className={`font-mono font-bold ${previewDti > 45 ? 'text-rose-400' : 'text-rose-300'}`}>
                  {previewDti}% ({previewDti <= 36 ? 'Prudent' : previewDti <= 45 ? 'Moderate' : 'Elevated'})
                </span>
              </div>
            </div>

            {/* Gauge Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950/70 border border-slate-800">
              <CreditScoreGauge
                score={estimatedPreviewScore}
                riskCategory={estimatedPreviewScore >= 740 ? 'Very Good' : estimatedPreviewScore >= 670 ? 'Good' : 'Fair'}
                confidenceScore={0.86}
                size="compact"
              />
              <button
                onClick={() => onNavigate('score')}
                className="mt-4 px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-semibold text-xs shadow-md shadow-rose-950/30 transition-colors"
              >
                Launch Complete 4-Step Analysis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (4 Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Methodology</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            How CrediScope AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Engineered through rigorous data preprocessing, supervised learning comparison, and transparent attribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <span className="text-xs font-mono font-bold text-rose-400">01</span>
            <h3 className="text-base font-bold text-white mt-2 mb-2">Financial Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Input income, debt obligations, employment duration, and credit history across structured, validated steps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <span className="text-xs font-mono font-bold text-rose-400">02</span>
            <h3 className="text-base font-bold text-white mt-2 mb-2">Dual Model Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Continuous score calibration and supervised loan viability classifiers evaluate default likelihood.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <span className="text-xs font-mono font-bold text-rose-400">03</span>
            <h3 className="text-base font-bold text-white mt-2 mb-2">SHAP Explainability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deconstructs your score with game-theoretic additive attribution, revealing exact point contributions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <span className="text-xs font-mono font-bold text-rose-400">04</span>
            <h3 className="text-base font-bold text-white mt-2 mb-2">Simulation &amp; Actions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experiment with what-if scenarios, compare borrowing capacity, and receive actionable financial guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Loan Categories Suite */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Loan Products</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Retail Loan Eligibility Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Product-tailored risk thresholds, Equated Monthly Installment (EMI) calculations, and maximum borrowing limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loanCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{cat.title}</h3>
                  <div className="text-xs font-semibold text-rose-400 mb-2">{cat.interest}</div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{cat.description}</p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{cat.tenure}</span>
                  <button
                    onClick={() => onNavigate('loans')}
                    className="text-rose-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    Assess <ArrowRight className="w-3 h-3 text-rose-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Privacy and Security Commitment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 flex items-center justify-center text-rose-400">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Responsible AI Guardrails</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We exclude protected characteristics (race, gender, religion, marital status). Decisions reflect purely empirical repayment and debt obligations.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 flex items-center justify-center text-rose-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Academic Dataset Rigor</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Harmonized on the German Credit (Statlog) and Give Me Some Credit benchmarks with 5-fold cross-validation and verified confusion matrices.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 flex items-center justify-center text-rose-400">
              <Sliders className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Transparent Counterfactuals</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive what-if simulations give direct feedback on debt paydown, utilization reductions, and borrowing capacity changes.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-rose-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-[#180812] border border-rose-900/40 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Explore Your Financial Standing?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Run an in-depth credit profile analysis, receive SHAP explainability factors, and evaluate loan eligibility without impacting your credit score.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('score')}
              className="px-8 py-3.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-950/40 transition-all inline-flex items-center gap-2"
            >
              <span>Get Started with Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
