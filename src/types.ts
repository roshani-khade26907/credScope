/**
 * CrediScope AI — Frontend & Domain Types
 */

export interface FinancialProfileInput {
  monthlyIncome: number;
  monthlyExpenses: number;
  employmentCategory: 'salaried' | 'self_employed' | 'business_owner' | 'freelance' | 'retired';
  employmentDurationMonths: number;
  existingLoansCount: number;
  outstandingDebt: number;
  monthlyDebtPayments: number;
  activeCreditAccounts: number;
  creditHistoryYears: number;
  creditCardUtilization: number;
  delayedPaymentsLast2Years: number;
  previousDefaultsCount: number;
}

export interface LoanAssessmentInput extends FinancialProfileInput {
  loanType: 'personal' | 'education' | 'home' | 'vehicle';
  requestedAmount: number;
  tenureMonths: number;
  interestRate?: number;
}

export interface ShapFactor {
  feature: string;
  label: string;
  value: string;
  impactScore: number;
  direction: 'positive' | 'negative' | 'neutral';
  recommendation: string;
}

export interface CreditScoreResult {
  estimatedScore: number;
  scoreRange: { min: number; max: number };
  riskCategory: 'Exceptional' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  riskTier: 1 | 2 | 3 | 4 | 5;
  probabilityOfDefaultPct: number;
  confidenceScore: number;
  debtToIncomeRatio: number;
  expenseToIncomeRatio: number;
  freeCashFlowMonthly: number;
  shapAttributions: ShapFactor[];
  basePopulationScore: number;
  modelIdentifier: string;
  timestamp: string;
}

export interface LoanEligibilityResult {
  eligibilityCategory: 'Higher Estimated Eligibility' | 'Moderate Estimated Eligibility' | 'Lower Estimated Eligibility';
  eligibilityScorePct: number;
  loanType: 'personal' | 'education' | 'home' | 'vehicle';
  requestedAmount: number;
  tenureMonths: number;
  annualInterestRatePct: number;
  monthlyInstallmentEMI: number;
  totalRepaymentAmount: number;
  totalInterestPayable: number;
  currentDtiPct: number;
  projectedDtiPct: number;
  maxRecommendedLoanCapacity: number;
  repaymentBurdenCategory: 'Comfortable' | 'Manageable' | 'Stretched' | 'High Risk';
  positiveFactors: string[];
  riskFactors: string[];
  advisoryNotes: string[];
  timestamp: string;
}

export interface SimulationResult {
  baselineScore: number;
  simulatedScore: number;
  scoreDelta: number;
  baselineRisk: string;
  simulatedRisk: string;
  factorsChanged: {
    name: string;
    oldValue: string;
    newValue: string;
    impactDescription: string;
  }[];
  summaryExplanation: string;
}

export interface AlgorithmBenchmark {
  id: string;
  name: string;
  category: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  prAuc: number;
  mae: number;
  rmse: number;
  r2Score: number;
  trainingSeconds: number;
  inferenceLatencyMs: number;
  isSelected: boolean;
  description: string;
}

export interface ModelBenchmarkSuite {
  selectedAlgorithm: string;
  datasetSources: {
    name: string;
    institution: string;
    instances: number;
    features: number;
    license: string;
    useCase: string;
  }[];
  algorithms: AlgorithmBenchmark[];
  confusionMatrix: {
    algorithm: string;
    totalTestSamples: number;
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
  rocCurveData: {
    fpr: number;
    tpr: number;
    randomLine: number;
  }[];
  featureImportances: {
    feature: string;
    importance: number;
    domain: string;
  }[];
}

export interface StoredAssessment {
  id: string;
  userId: string;
  assessmentType: 'credit_score' | 'loan_eligibility' | 'simulation';
  inputSummary: Record<string, any>;
  predictionResult: Record<string, any>;
  riskCategory: string;
  scoreOrStatus: string | number;
  loanType?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}
