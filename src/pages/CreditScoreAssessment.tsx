import React, { useState } from 'react';
import { FinancialProfileInput, CreditScoreResult } from '../types';
import { apiPredictCreditScore } from '../api';
import { useAuth } from '../context/AuthContext';
import { CreditScoreGauge } from '../components/CreditScoreGauge';
import { ExplainabilityWaterfall } from '../components/ExplainabilityWaterfall';
import {
  DollarSign,
  Briefcase,
  CreditCard,
  History,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

interface CreditScoreAssessmentProps {
  onNavigate: (tab: string) => void;
}

const DEFAULT_PROFILE: FinancialProfileInput = {
  monthlyIncome: 6200,
  monthlyExpenses: 2100,
  employmentCategory: 'salaried',
  employmentDurationMonths: 48,
  existingLoansCount: 1,
  outstandingDebt: 12500,
  monthlyDebtPayments: 550,
  activeCreditAccounts: 4,
  creditHistoryYears: 6.5,
  creditCardUtilization: 24,
  delayedPaymentsLast2Years: 0,
  previousDefaultsCount: 0
};

export const CreditScoreAssessment: React.FC<CreditScoreAssessmentProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<FinancialProfileInput>(DEFAULT_PROFILE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediction, setPrediction] = useState<CreditScoreResult | null>(null);

  const updateField = <K extends keyof FinancialProfileInput>(field: K, value: FinancialProfileInput[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((prev) => (prev + 1) as any);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as any);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await apiPredictCreditScore(formData, user.id);
      setPrediction(result);
    } catch (e) {
      console.error('Prediction error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setCurrentStep(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Model A · Continuous Score Engine</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Credit Score Estimation &amp; Risk Profiling
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            4-step structured assessment powered by trained Random Forest &amp; GMSC benchmark models.
          </p>
        </div>

        {prediction && (
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium flex items-center gap-2 self-start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Assessment</span>
          </button>
        )}
      </div>

      {!prediction ? (
        <div className="space-y-6">
          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { num: 1, label: 'Income & Job' },
              { num: 2, label: 'Debt & Loans' },
              { num: 3, label: 'Credit History' },
              { num: 4, label: 'Review & Run' }
            ].map((step) => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div
                  key={step.num}
                  className={`p-3 rounded-xl border text-xs transition-colors ${
                    isCurrent
                      ? 'bg-rose-950/60 border-rose-800/60 text-rose-300'
                      : isDone
                      ? 'bg-slate-900 border-slate-700 text-slate-300'
                      : 'bg-slate-950/40 border-slate-900 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono font-bold">
                    <span>0{step.num}</span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 ml-auto" />}
                  </div>
                  <div className="font-semibold mt-1 truncate">{step.label}</div>
                </div>
              );
            })}
          </div>

          {/* Step Form Containers */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            {/* STEP 1: Income and Employment */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <DollarSign className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-bold text-white">Step 1: Income &amp; Employment</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Monthly Gross Income ($)
                    </label>
                    <input
                      type="number"
                      min="500"
                      max="100000"
                      value={formData.monthlyIncome}
                      onChange={(e) => updateField('monthlyIncome', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Pre-tax monthly wages or earnings</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Monthly Living Expenses ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50000"
                      value={formData.monthlyExpenses}
                      onChange={(e) => updateField('monthlyExpenses', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Rent/housing, groceries, utilities</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Employment Category
                    </label>
                    <select
                      value={formData.employmentCategory}
                      onChange={(e) => updateField('employmentCategory', e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="salaried">Salaried (Full-Time)</option>
                      <option value="self_employed">Self-Employed / Professional</option>
                      <option value="business_owner">Business Owner</option>
                      <option value="freelance">Contractor / Freelance</option>
                      <option value="retired">Retired / Pension</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Employment Duration (Months)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="600"
                      value={formData.employmentDurationMonths}
                      onChange={(e) => updateField('employmentDurationMonths', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      {Math.floor(formData.employmentDurationMonths / 12)} yrs {formData.employmentDurationMonths % 12} mos at current employer
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Existing Financial Obligations */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <CreditCard className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-bold text-white">Step 2: Existing Financial Obligations</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Number of Existing Active Loans
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={formData.existingLoansCount}
                      onChange={(e) => updateField('existingLoansCount', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">e.g. Mortgages, vehicle, personal loans</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Total Outstanding Debt ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000000"
                      value={formData.outstandingDebt}
                      onChange={(e) => updateField('outstandingDebt', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Total principal balance owed across all lines</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Monthly Debt Service Payments ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50000"
                      value={formData.monthlyDebtPayments}
                      onChange={(e) => updateField('monthlyDebtPayments', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Calculated DTI:{' '}
                      <strong className="text-rose-400">
                        {Math.round((formData.monthlyDebtPayments / (formData.monthlyIncome || 1)) * 100)}%
                      </strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Total Active Credit Accounts
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={formData.activeCreditAccounts}
                      onChange={(e) => updateField('activeCreditAccounts', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Revolving credit cards, store accounts, credit lines</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Credit History */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <History className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-bold text-white">Step 3: Credit History &amp; Repayment Record</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Credit History Duration (Years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="0.5"
                      value={formData.creditHistoryYears}
                      onChange={(e) => updateField('creditHistoryYears', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Age of your oldest continuously open credit line</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Credit Card Utilization Ratio: <strong className="text-rose-400">{formData.creditCardUtilization}%</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.creditCardUtilization}
                      onChange={(e) => updateField('creditCardUtilization', Number(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>0% (Ideal)</span>
                      <span>30% (Standard Benchmark)</span>
                      <span>100% (Maxed Out)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Delayed Payments (Past 24 Months)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={formData.delayedPaymentsLast2Years}
                      onChange={(e) => updateField('delayedPaymentsLast2Years', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Payments made 30+ days past due</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Major Defaults or Charge-Offs
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.previousDefaultsCount}
                      onChange={(e) => updateField('previousDefaultsCount', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Unsettled default collections or 90+ day write-offs</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Review and Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <FileSpreadsheet className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-bold text-white">Step 4: Review Assessment Summary</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="font-semibold text-rose-400 flex items-center justify-between">
                      <span>Income &amp; Employment</span>
                      <button onClick={() => setCurrentStep(1)} className="text-[10px] text-slate-400 hover:text-white underline">
                        Edit
                      </button>
                    </div>
                    <div className="text-slate-400">Monthly Income: <strong className="text-slate-200 font-mono">${formData.monthlyIncome.toLocaleString()}</strong></div>
                    <div className="text-slate-400">Living Costs: <strong className="text-slate-200 font-mono">${formData.monthlyExpenses.toLocaleString()}</strong></div>
                    <div className="text-slate-400">Tenure: <strong className="text-slate-200 font-mono">{formData.employmentDurationMonths} months</strong></div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="font-semibold text-rose-400 flex items-center justify-between">
                      <span>Debts &amp; Obligations</span>
                      <button onClick={() => setCurrentStep(2)} className="text-[10px] text-slate-400 hover:text-white underline">
                        Edit
                      </button>
                    </div>
                    <div className="text-slate-400">Active Loans: <strong className="text-slate-200 font-mono">{formData.existingLoansCount}</strong></div>
                    <div className="text-slate-400">Total Debt: <strong className="text-slate-200 font-mono">${formData.outstandingDebt.toLocaleString()}</strong></div>
                    <div className="text-slate-400">Monthly Debt Service: <strong className="text-slate-200 font-mono">${formData.monthlyDebtPayments.toLocaleString()}</strong></div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="font-semibold text-rose-400 flex items-center justify-between">
                      <span>Credit History</span>
                      <button onClick={() => setCurrentStep(3)} className="text-[10px] text-slate-400 hover:text-white underline">
                        Edit
                      </button>
                    </div>
                    <div className="text-slate-400">Bureau Longevity: <strong className="text-slate-200 font-mono">{formData.creditHistoryYears} yrs</strong></div>
                    <div className="text-slate-400">Utilization: <strong className="text-slate-200 font-mono">{formData.creditCardUtilization}%</strong></div>
                    <div className="text-slate-400">Delinquencies: <strong className="text-slate-200 font-mono">{formData.delayedPaymentsLast2Years}</strong></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-slate-400">
                    Predictions use actual trained machine-learning model weights from the German Credit and Give Me Some Credit datasets. Your inputs are isolated to your profile session.
                  </span>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-950 hover:bg-slate-800 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : <div />}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-950/40 transition-colors"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/40 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Computing Model Inference...' : 'Generate Prediction'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Prediction Result View */
        <div className="space-y-8">
          {/* Main Result Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Score Gauge */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <CreditScoreGauge
                score={prediction.estimatedScore}
                riskCategory={prediction.riskCategory}
                riskTier={prediction.riskTier}
                probabilityOfDefaultPct={prediction.probabilityOfDefaultPct}
                confidenceScore={prediction.confidenceScore}
              />
              <div className="text-[11px] text-slate-500 font-mono mt-2">
                Engine: {prediction.modelIdentifier}
              </div>
            </div>

            {/* Financial Health Summary */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Evaluation Result</span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  Estimated {prediction.riskCategory} Risk Standing
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  Your profile demonstrates a {prediction.probabilityOfDefaultPct.toFixed(1)}% estimated default probability, calibrated from 150,000 historical credit records.
                </p>
              </div>

              {/* Core Financial Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Debt-to-Income (DTI)</div>
                  <div className={`text-base font-bold font-mono mt-0.5 ${prediction.debtToIncomeRatio > 43 ? 'text-rose-400' : 'text-rose-300'}`}>
                    {prediction.debtToIncomeRatio}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {prediction.debtToIncomeRatio <= 36 ? 'Prudent' : 'Needs reduction'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Monthly Cash Buffer</div>
                  <div className="text-base font-bold font-mono text-slate-100 mt-0.5">
                    ${prediction.freeCashFlowMonthly.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Free net cash flow</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Score Window</div>
                  <div className="text-base font-bold font-mono text-slate-100 mt-0.5">
                    {prediction.scoreRange.min}–{prediction.scoreRange.max}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">±20 point confidence</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('loans')}
                  className="px-4 py-2.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-950/40 transition-colors"
                >
                  <span>Evaluate Loan Eligibility</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('simulator')}
                  className="px-4 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
                >
                  <span>Simulate Financial Scenarios</span>
                </button>
              </div>
            </div>
          </div>

          {/* Explainability Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Explainable AI</span>
              <h3 className="text-xl font-bold text-white mt-1">
                SHAP Feature Attribution Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Here is exactly which factors contributed positively or negatively to your final credit score.
              </p>
            </div>

            <ExplainabilityWaterfall
              shapFactors={prediction.shapAttributions}
              baseScore={prediction.basePopulationScore}
              finalScore={prediction.estimatedScore}
            />
          </div>
        </div>
      )}
    </div>
  );
};
