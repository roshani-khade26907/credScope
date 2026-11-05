import React, { useState } from 'react';
import { FinancialProfileInput, SimulationResult } from '../types';
import { apiSimulateScenario } from '../api';
import { useAuth } from '../context/AuthContext';
import { CreditScoreGauge } from '../components/CreditScoreGauge';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info,
  DollarSign,
  Percent,
  CreditCard,
  History
} from 'lucide-react';

interface FinancialSimulatorProps {
  onNavigate: (tab: string) => void;
}

const BASELINE_SAMPLE: FinancialProfileInput = {
  monthlyIncome: 5500,
  monthlyExpenses: 2000,
  employmentCategory: 'salaried',
  employmentDurationMonths: 36,
  existingLoansCount: 1,
  outstandingDebt: 15000,
  monthlyDebtPayments: 650,
  activeCreditAccounts: 3,
  creditHistoryYears: 5,
  creditCardUtilization: 48,
  delayedPaymentsLast2Years: 1,
  previousDefaultsCount: 0
};

export const FinancialSimulator: React.FC<FinancialSimulatorProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [baseline, setBaseline] = useState<FinancialProfileInput>(BASELINE_SAMPLE);
  const [simulated, setSimulated] = useState<FinancialProfileInput>({
    ...BASELINE_SAMPLE,
    creditCardUtilization: 18,
    monthlyDebtPayments: 400,
    outstandingDebt: 8000,
    delayedPaymentsLast2Years: 0
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await apiSimulateScenario(baseline, simulated, user.id);
      setSimulation(res);
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  React.useEffect(() => {
    runSimulation();
  }, []);

  const resetToBaseline = () => {
    setSimulated({ ...baseline });
  };

  const loadRiskyScenario = async () => {
    const riskyBaseline: FinancialProfileInput = {
      monthlyIncome: 3200,
      monthlyExpenses: 1400,
      employmentCategory: 'salaried',
      employmentDurationMonths: 18,
      existingLoansCount: 2,
      outstandingDebt: 28000,
      monthlyDebtPayments: 1650,
      activeCreditAccounts: 4,
      creditHistoryYears: 2.5,
      creditCardUtilization: 88,
      delayedPaymentsLast2Years: 2,
      previousDefaultsCount: 1
    };
    const recoveredProfile: FinancialProfileInput = {
      ...riskyBaseline,
      creditCardUtilization: 20,
      monthlyDebtPayments: 600,
      delayedPaymentsLast2Years: 0,
      previousDefaultsCount: 0
    };
    setBaseline(riskyBaseline);
    setSimulated(recoveredProfile);
    setIsSimulating(true);
    try {
      const res = await apiSimulateScenario(riskyBaseline, recoveredProfile, user.id);
      setSimulation(res);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Counterfactual Engine</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Financial What-If Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate how strategic debt paydowns, balance reductions, or income changes alter your calibrated credit standing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={loadRiskyScenario}
            className="px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>⚠ Load Risky Demo (528)</span>
          </button>
          <button
            onClick={resetToBaseline}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sliders</span>
          </button>
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-950/40 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Recalculating...' : 'Recalculate Model'}</span>
          </button>
        </div>
      </div>

      {/* Main Comparative View */}
      {simulation && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Baseline Score */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Current Baseline
            </div>
            <CreditScoreGauge
              score={simulation.baselineScore}
              riskCategory={simulation.baselineRisk as any}
              size="compact"
            />
          </div>

          {/* Delta Pill & Summary */}
          <div className="lg:col-span-4 flex flex-col items-center text-center px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 shadow-md">
              {simulation.scoreDelta >= 0 ? (
                <TrendingUp className="w-5 h-5 text-rose-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-rose-400" />
              )}
              <span className={`text-2xl font-extrabold font-mono tabular-nums ${
                simulation.scoreDelta >= 0 ? 'text-rose-400' : 'text-rose-400'
              }`}>
                {simulation.scoreDelta >= 0 ? `+${simulation.scoreDelta}` : simulation.scoreDelta} Points
              </span>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed">
              {simulation.summaryExplanation}
            </div>

            <div className="text-[11px] text-slate-500 italic">
              *All counterfactual results represent hypothetical scenario projections generated by the underlying model pipeline.
            </div>
          </div>

          {/* Simulated Score */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-rose-900/30">
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
              Hypothetical Projected
            </div>
            <CreditScoreGauge
              score={simulation.simulatedScore}
              riskCategory={simulation.simulatedRisk as any}
              size="compact"
            />
          </div>
        </div>
      )}

      {/* Interactive Controls & Factors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sliders Area */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Adjust Financial Levers</h3>
          </div>

          {/* Lever 1: Utilization */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Credit Card Utilization:</span>
              <span className="font-mono font-bold text-rose-400">
                {baseline.creditCardUtilization}% → {simulated.creditCardUtilization}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={simulated.creditCardUtilization}
              onChange={(e) => {
                setSimulated(prev => ({ ...prev, creditCardUtilization: Number(e.target.value) }));
              }}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0% Paid in Full</span>
              <span>15% Optimal</span>
              <span>100% Maxed</span>
            </div>
          </div>

          {/* Lever 2: Monthly Debt Obligations */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Monthly Debt Obligations:</span>
              <span className="font-mono font-bold text-rose-400">
                ${baseline.monthlyDebtPayments} → ${simulated.monthlyDebtPayments}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={simulated.monthlyDebtPayments}
              onChange={(e) => {
                setSimulated(prev => ({ ...prev, monthlyDebtPayments: Number(e.target.value) }));
              }}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>$0 (Debt-Free)</span>
              <span>$1,500</span>
              <span>$3,000/mo</span>
            </div>
          </div>

          {/* Lever 3: Monthly Income */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Monthly Gross Income:</span>
              <span className="font-mono font-bold text-rose-400">
                ${baseline.monthlyIncome.toLocaleString()} → ${simulated.monthlyIncome.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="15000"
              step="250"
              value={simulated.monthlyIncome}
              onChange={(e) => {
                setSimulated(prev => ({ ...prev, monthlyIncome: Number(e.target.value) }));
              }}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Lever 4: Delinquencies Removed */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>Delayed Payments on Record:</span>
            <select
              value={simulated.delayedPaymentsLast2Years}
              onChange={(e) => {
                setSimulated(prev => ({ ...prev, delayedPaymentsLast2Years: Number(e.target.value) }));
              }}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-rose-500"
            >
              <option value="0">0 (Clean Streak)</option>
              <option value="1">1 delay</option>
              <option value="2">2 delays</option>
              <option value="3">3+ delays</option>
            </select>
          </div>
        </div>

        {/* Changes Audit Area */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Info className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Scenario Changes Breakdown</h3>
          </div>

          {simulation && simulation.factorsChanged.length > 0 ? (
            <div className="space-y-3">
              {simulation.factorsChanged.map((change, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{change.name}</span>
                    <span className="font-mono text-[11px] text-rose-400">
                      {change.oldValue} → {change.newValue}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {change.impactDescription}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No input variables currently differ from baseline. Adjust the sliders to see instant counterfactual results.
            </div>
          )}

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => onNavigate('loans')}
              className="w-full py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Test Loan Eligibility With These Values</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
