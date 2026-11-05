import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  predictCreditScore,
  evaluateLoanEligibility,
  simulateFinancialScenario,
  MODEL_BENCHMARK_SUITE,
  LOAN_PRODUCT_POLICIES,
  FinancialProfileInput,
  LoanAssessmentInput
} from './server/ml/model_engine.js';
import { dbStore } from './server/db/store.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Helper to extract authenticated user (defaults to demo user)
function getRequestUserId(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token) return token;
  }
  return req.headers['x-user-id'] as string || 'usr_demo_883';
}

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'CrediScope AI Engine',
    version: '2.1.0',
    modelLoaded: 'Random Forest & Calibrated GMSC Ensemble',
    benchmarkStatus: 'Trained & Operational',
    timestamp: new Date().toISOString()
  });
});

// 2. Predict Credit Score
app.post('/api/predict/credit-score', (req: Request, res: Response) => {
  try {
    const profile: FinancialProfileInput = req.body;
    if (profile.monthlyIncome === undefined || profile.monthlyIncome === null) {
      return res.status(400).json({ error: 'monthlyIncome is required' });
    }

    const prediction = predictCreditScore(profile);
    const userId = getRequestUserId(req);

    // Persist assessment to history
    if (req.body.saveToHistory !== false) {
      dbStore.saveAssessment(
        userId,
        'credit_score',
        profile,
        prediction,
        prediction.riskCategory,
        prediction.estimatedScore
      );
    }

    res.json(prediction);
  } catch (error: any) {
    console.error('Error during credit score prediction:', error);
    res.status(500).json({ error: error.message || 'Credit prediction failed' });
  }
});

// 3. Evaluate Loan Eligibility
app.post('/api/predict/loan-eligibility', (req: Request, res: Response) => {
  try {
    const input: LoanAssessmentInput = req.body;
    if (!input.loanType || !input.requestedAmount) {
      return res.status(400).json({ error: 'loanType and requestedAmount are required' });
    }

    const result = evaluateLoanEligibility(input);
    const userId = getRequestUserId(req);

    if (req.body.saveToHistory !== false) {
      dbStore.saveAssessment(
        userId,
        'loan_eligibility',
        input,
        result,
        result.eligibilityCategory,
        result.eligibilityCategory,
        input.loanType
      );
    }

    res.json(result);
  } catch (error: any) {
    console.error('Error during loan eligibility evaluation:', error);
    res.status(500).json({ error: error.message || 'Loan evaluation failed' });
  }
});

// 4. Financial What-If Simulator
app.post('/api/simulate', (req: Request, res: Response) => {
  try {
    const { baseline, simulated } = req.body;
    if (!baseline || !simulated) {
      return res.status(400).json({ error: 'Both baseline and simulated profiles are required' });
    }

    const simulationResult = simulateFinancialScenario(baseline, simulated);
    const userId = getRequestUserId(req);

    if (req.body.saveToHistory) {
      dbStore.saveAssessment(
        userId,
        'simulation',
        { baseline, simulated },
        simulationResult,
        simulationResult.simulatedRisk,
        `${simulationResult.scoreDelta >= 0 ? '+' : ''}${simulationResult.scoreDelta} pts`
      );
    }

    res.json(simulationResult);
  } catch (error: any) {
    console.error('Error during financial simulation:', error);
    res.status(500).json({ error: error.message || 'Simulation failed' });
  }
});

// 5. Model Evaluation Metrics
app.get('/api/model/metrics', (_req: Request, res: Response) => {
  res.json(MODEL_BENCHMARK_SUITE);
});

// 6. Feature Importance & SHAP Metadata
app.get('/api/model/feature-importance', (_req: Request, res: Response) => {
  res.json({
    featureImportances: MODEL_BENCHMARK_SUITE.featureImportances,
    loanPolicies: LOAN_PRODUCT_POLICIES,
    selectedAlgorithm: MODEL_BENCHMARK_SUITE.selectedAlgorithm,
    citations: {
      surveyPaper: 'Shahane, P., & Gore, D. (2018). A Survey on Classification Techniques to Determine Fake vs. Real Identities on Social Media Platforms.',
      methodologyNote: 'Methodological comparison of Supervised Classification algorithms adapted for financial credit-scoring benchmarks.'
    }
  });
});

// 7. Prediction History
app.get('/api/predictions/history', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const filterType = req.query.type as string | undefined;
  const assessments = dbStore.getAssessments(userId, filterType);
  res.json(assessments);
});

app.delete('/api/predictions/history/:id', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const id = req.params.id;
  const deleted = dbStore.deleteAssessment(id, userId);
  if (deleted) {
    res.json({ success: true, message: 'Assessment removed' });
  } else {
    res.status(404).json({ error: 'Assessment not found or not owned by user' });
  }
});

// 8. Authentication & User Profile
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, displayName } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const user = dbStore.getOrCreateUser(email, displayName);
  res.json({ user, token: user.id });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const user = dbStore.getUserById(userId) || dbStore.getUserById('usr_demo_883');
  res.json({ user });
});

app.get('/api/preferences', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const prefs = dbStore.getUserPreferences(userId);
  res.json(prefs);
});

app.put('/api/preferences', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const updated = dbStore.updateUserPreferences(userId, req.body);
  res.json(updated);
});

// Start server and mount Vite dev middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CrediScope AI server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
