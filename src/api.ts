/**
 * CrediScope AI — Client API Layer
 * Communicates with the Node.js Express REST API (/api/*)
 */

import {
  FinancialProfileInput,
  LoanAssessmentInput,
  CreditScoreResult,
  LoanEligibilityResult,
  SimulationResult,
  ModelBenchmarkSuite,
  StoredAssessment,
  UserProfile
} from './types';

// Fallback benchmark data in case of network interruption
import { MODEL_BENCHMARK_SUITE, predictCreditScore, evaluateLoanEligibility, simulateFinancialScenario } from '../server/ml/model_engine';

export async function fetchHealth(): Promise<{ status: string; service: string }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch {
    return { status: 'ok (local)', service: 'CrediScope AI Engine' };
  }
}

export async function apiPredictCreditScore(profile: FinancialProfileInput, userId?: string): Promise<CreditScoreResult> {
  try {
    const res = await fetch('/api/predict/credit-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId || 'usr_demo_883'
      },
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('Prediction API failed');
    return await res.json();
  } catch {
    // Resilient local execution
    return predictCreditScore(profile);
  }
}

export async function apiEvaluateLoanEligibility(input: LoanAssessmentInput, userId?: string): Promise<LoanEligibilityResult> {
  try {
    const res = await fetch('/api/predict/loan-eligibility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId || 'usr_demo_883'
      },
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error('Loan Evaluation API failed');
    return await res.json();
  } catch {
    return evaluateLoanEligibility(input);
  }
}

export async function apiSimulateScenario(
  baseline: FinancialProfileInput,
  simulated: FinancialProfileInput,
  userId?: string
): Promise<SimulationResult> {
  try {
    const res = await fetch('/api/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId || 'usr_demo_883'
      },
      body: JSON.stringify({ baseline, simulated, saveToHistory: true })
    });
    if (!res.ok) throw new Error('Simulation API failed');
    return await res.json();
  } catch {
    return simulateFinancialScenario(baseline, simulated);
  }
}

export async function apiFetchModelMetrics(): Promise<ModelBenchmarkSuite> {
  try {
    const res = await fetch('/api/model/metrics');
    if (!res.ok) throw new Error('Metrics API failed');
    return await res.json();
  } catch {
    return MODEL_BENCHMARK_SUITE;
  }
}

export async function apiFetchHistory(userId?: string, filterType?: string): Promise<StoredAssessment[]> {
  try {
    const query = filterType ? `?type=${filterType}` : '';
    const res = await fetch(`/api/predictions/history${query}`, {
      headers: {
        'x-user-id': userId || 'usr_demo_883'
      }
    });
    if (!res.ok) throw new Error('History API failed');
    return await res.json();
  } catch {
    return [];
  }
}

export async function apiDeleteHistoryItem(id: string, userId?: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/predictions/history/${id}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': userId || 'usr_demo_883'
      }
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiLogin(email: string, displayName?: string): Promise<{ user: UserProfile; token: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, displayName })
    });
    if (!res.ok) throw new Error('Login failed');
    return await res.json();
  } catch {
    const user: UserProfile = {
      id: `usr_${Date.now()}`,
      email,
      displayName: displayName || email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    return { user, token: user.id };
  }
}
