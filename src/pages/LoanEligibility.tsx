import React, { useState } from 'react';
import { LoanAssessmentInput, LoanEligibilityResult } from '../types';
import { apiEvaluateLoanEligibility } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Banknote,
  GraduationCap,
  Home,
  Car,
  Calculator,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign,
  Calendar,
  Percent,
  SlidersHorizontal
} from 'lucide-react';

interface LoanEligibilityProps {
  onNavigate: (tab: string) => void;
}

export const LoanEligibility: React.FC<LoanEligibilityProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [loanType, setLoanType] = useState<'personal' | 'education' | 'home' | 'vehicle'>('personal');
  const [amount, setAmount] = useState<number>(25000);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(6500);
  const [monthlyDebtPayments, setMonthlyDebtPayments] = useState<number>(600);
  const [creditCardUtilization, setCreditCardUtilization] = useState<number>(25);
  const [delayedPayments, setDelayedPayments] = useState<number>(0);
  const [previousDefaults, setPreviousDefaults] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<LoanEligibilityResult | null>(null);

  // Dynamic limits per loan type
  const productConfigs = {
    personal: { label: 'Personal Loan', minAmt: 1000, maxAmt: 75000, minTen: 6, maxTen: 60, rate: 10.75, icon: Banknote },
    education: { label: 'Education Loan', minAmt: 5000, maxAmt: 150000, minTen: 12, maxTen: 180, rate: 7.95, icon: GraduationCap },
    home: { label: 'Home Loan (Mortgage)', minAmt: 25000, maxAmt: 1200000, minTen: 60, maxTen: 360, rate: 6.45, icon: Home },
    vehicle: { label: 'Vehicle Loan (Auto)', minAmt: 5000, maxAmt: 95000, minTen: 12, maxTen: 84, rate: 7.25, icon: Car }
  };

  const currentConfig = productConfigs[loanType];

  const handleTypeChange = (type: 'personal' | 'education' | 'home' | 'vehicle') => {
    setLoanType(type);
    const cfg = productConfigs[type];
    setAmount(Math.min(cfg.maxAmt, Math.max(cfg.minAmt, amount)));
    setTenureMonths(Math.min(cfg.maxTen, Math.max(cfg.minTen, tenureMonths)));
  };

  const handleEvaluate = async () => {
    setIsSubmitting(true);
    try {
      const payload: LoanAssessmentInput = {
        loanType,
        requestedAmount: amount,
        tenureMonths,
        monthlyIncome,
        monthlyExpenses: Math.round(monthlyIncome * 0.35),
        employmentCategory: 'salaried',
        employmentDurationMonths: 36,
        existingLoansCount: 1,
        outstandingDebt: monthlyDebtPayments * 20,
        monthlyDebtPayments,
        activeCreditAccounts: 3,
        creditHistoryYears: 5,
        creditCardUtilization,
        delayedPaymentsLast2Years: delayedPayments,
        previousDefaultsCount: previousDefaults
      };

      const res = await apiEvaluateLoanEligibility(payload, user.id);
      setResult(res);
    } catch (e) {
      console.error('Loan evaluation failed:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Run initial evaluation on first load
  React.useEffect(() => {
    handleEvaluate();
  }, [loanType]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Model B · Lending Viability Engine</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Retail Loan Eligibility Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Evaluate borrowing limits, amortized EMI commitments, and projected Debt-to-Income (DTI) impact across 4 retail loan categories.
        </p>
      </div>

      {/* Loan Type Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(productConfigs) as Array<keyof typeof productConfigs>).map((key) => {
          const cfg = productConfigs[key];
          const Icon = cfg.icon;
          const isActive = loanType === key;
          return (
            <button
              key={key}
              onClick={() => handleTypeChange(key)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-rose-950/60 border-rose-800/60 shadow-md shadow-rose-950/20'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-rose-700 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-rose-400">{cfg.rate}% p.a.</span>
              </div>
              <div>
                <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>{cfg.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Max ${cfg.maxAmt.toLocaleString()}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Loan Parameters Form */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <SlidersHorizontal className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Loan Parameters</h3>
          </div>

          {/* Requested Principal */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Requested Loan Principal</span>
              <span className="font-mono font-bold text-rose-400">${amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={currentConfig.minAmt}
              max={currentConfig.maxAmt}
              step={loanType === 'home' ? 5000 : 500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>${currentConfig.minAmt.toLocaleString()}</span>
              <span>${currentConfig.maxAmt.toLocaleString()}</span>
            </div>
          </div>

          {/* Repayment Tenure */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Repayment Tenure</span>
              <span className="font-mono font-bold text-rose-400">
                {tenureMonths} Months ({(tenureMonths / 12).toFixed(1)} Years)
              </span>
            </div>
            <input
              type="range"
              min={currentConfig.minTen}
              max={currentConfig.maxTen}
              step={6}
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>{currentConfig.minTen} mos</span>
              <span>{currentConfig.maxTen} mos</span>
            </div>
          </div>

          {/* Monthly Income */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Monthly Gross Income ($)
            </label>
            <input
              type="number"
              min="1000"
              max="50000"
              step="250"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Existing Debt Service */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Existing Monthly Debt Payments ($)
            </label>
            <input
              type="number"
              min="0"
              max="20000"
              step="50"
              value={monthlyDebtPayments}
              onChange={(e) => setMonthlyDebtPayments(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Card Utilization */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Credit Card Utilization</span>
              <span className="font-mono text-rose-400">{creditCardUtilization}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={creditCardUtilization}
              onChange={(e) => setCreditCardUtilization(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Delinquency Checkbox */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>Any Delinquent Marks (Past 2 yrs)?</span>
            <select
              value={delayedPayments}
              onChange={(e) => setDelayedPayments(Number(e.target.value))}
              className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-white"
            >
              <option value="0">0 (Clean)</option>
              <option value="1">1 delay</option>
              <option value="2">2+ delays</option>
            </select>
          </div>

          <button
            onClick={handleEvaluate}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Calculator className="w-4 h-4" />
            <span>{isSubmitting ? 'Evaluating...' : 'Recalculate Eligibility'}</span>
          </button>
        </div>

        {/* Right Column: Loan Assessment Results */}
        {result && (
          <div className="lg:col-span-7 space-y-6">
            {/* Status Hero Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                    {currentConfig.label} Assessment
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {result.eligibilityCategory}
                  </h2>
                </div>

                <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-mono self-start ${
                  result.eligibilityCategory === 'Higher Estimated Eligibility'
                    ? 'bg-rose-950/60 text-rose-300 border-rose-800/40'
                    : result.eligibilityCategory === 'Moderate Estimated Eligibility'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  Score: {result.eligibilityScorePct}/100
                </div>
              </div>

              {/* Financial Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Monthly Installment (EMI)</div>
                  <div className="text-lg font-bold font-mono text-rose-400 mt-0.5">
                    ${result.monthlyInstallmentEMI.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">at {result.annualInterestRatePct}% p.a.</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Projected DTI Ratio</div>
                  <div className={`text-lg font-bold font-mono mt-0.5 ${result.projectedDtiPct > 45 ? 'text-rose-400' : 'text-slate-100'}`}>
                    {result.projectedDtiPct}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Current: {result.currentDtiPct}%</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Recommended Capacity</div>
                  <div className="text-lg font-bold font-mono text-slate-100 mt-0.5">
                    ${result.maxRecommendedLoanCapacity.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">40% DTI limit</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Repayment Burden</div>
                  <div className="text-lg font-bold font-mono text-slate-100 mt-0.5">
                    {result.repaymentBurdenCategory}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Net cash flow test</div>
                </div>
              </div>

              {/* Total Repayment Summary */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-4 text-slate-400">
                <div>
                  Principal: <strong className="font-mono text-slate-200">${result.requestedAmount.toLocaleString()}</strong>
                </div>
                <div>
                  Total Interest: <strong className="font-mono text-slate-200">${result.totalInterestPayable.toLocaleString()}</strong>
                </div>
                <div>
                  Total Outflow: <strong className="font-mono text-rose-400">${result.totalRepaymentAmount.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Influencing Factors & Risk Audit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Positive Factors */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-400" />
                  <span>Strengths Identified</span>
                </h4>
                {result.positiveFactors.length > 0 ? (
                  <ul className="space-y-2 text-xs text-slate-300">
                    {result.positiveFactors.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-400 mt-0.5 font-bold">·</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">No major strength factors registered.</p>
                )}
              </div>

              {/* Risk Factors */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Risk Constraints</span>
                </h4>
                {result.riskFactors.length > 0 ? (
                  <ul className="space-y-2 text-xs text-slate-300">
                    {result.riskFactors.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-400 mt-0.5 font-bold">·</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">Zero adverse debt or delinquency constraints identified.</p>
                )}
              </div>
            </div>

            {/* Advisory Guidance */}
            {result.advisoryNotes.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-rose-400" />
                  <span>Underwriting Advisory Recommendations</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {result.advisoryNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">›</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
