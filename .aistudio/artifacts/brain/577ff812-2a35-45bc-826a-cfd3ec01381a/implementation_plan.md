# CrediScope AI — Intelligent Credit Score Prediction & Loan Eligibility Platform

CrediScope AI is a modern full-stack fintech intelligence platform that evaluates consumer creditworthiness, estimates standardized credit scores (300–850), determines loan eligibility across four consumer categories, and delivers transparent explainable AI insights powered by machine learning models trained on benchmark credit datasets.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural and problem framing choices confirmed with the user:
> - **Benchmark Datasets**: Dual integration of the **German Credit Dataset** (Statlog) and **Give Me Some Credit (GMSC)** benchmark, harmonized for both continuous score calibration and repayment eligibility classification.
> - **Execution Pipeline**: Node.js Express full-stack REST API (`server.ts`) running trained ML model ensembles (pre-fitted weights, tree ensembles, and SHAP-style attribution engines derived from Python scikit-learn & XGBoost pipelines) paired with a high-performance React 19 + TypeScript frontend.
> - **Loan Product Scope**: Full coverage of the 4 primary retail lending categories: **Personal Loans**, **Education Loans**, **Home Loans (Mortgages)**, and **Vehicle Loans**, each with distinct DTI thresholds, tenures, and interest structures.
> - **Ethical AI & Compliance Safeguard**: Strict prohibition of protected characteristics (race, gender, religion, marital status). Clear educational disclosure that outputs represent decision-support estimates rather than formal lender underwriting.

---

## 1. Overview & Core Concept

CrediScope AI bridges the gap between opaque credit bureau algorithms and consumer financial literacy. By combining rigorous machine learning methodologies (benchmarking Logistic Regression, Random Forest, XGBoost, Support Vector Machines, and K-Nearest Neighbors as inspired by classification research literature) with an intuitive fintech interface, the platform empowers users to:
1. **Estimate Credit Standing**: Assess a continuous credit score estimate (300–850 scale) with risk classification (Excellent, Very Good, Good, Fair, Poor).
2. **Evaluate Product-Specific Loan Eligibility**: Receive instant qualification probability, maximum loan capacity, and monthly EMI breakdown for Personal, Education, Home, and Auto loans.
3. **Inspect Explainable AI (XAI)**: View individual feature contribution breakdowns (waterfall charts and directional impacts) showing exactly which financial behaviors help or hurt their profile.
4. **Conduct What-If Financial Simulations**: Dynamically adjust income, debt obligations, and credit card utilization to preview how future financial moves impact their score and borrowing power.
5. **Analyze ML Model Benchmarks**: Inspect an interactive model evaluation dashboard displaying actual ROC-AUC, PR-AUC, confusion matrices, precision/recall curves, and cross-validated comparisons.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            LANDING PAGE & HERO                               │
│  "Understand Your Credit. Unlock Smarter Financial Decisions."              │
│  [Analyze My Credit Profile]                 [Explore How It Works]          │
└───────────────┬──────────────────────────────────────┬───────────────────────┘
                │                                      │
                ▼                                      ▼
┌────────────────────────────────┐     ┌───────────────────────────────────────┐
│     ASSESSMENT / SIMULATION    │     │       MODEL EVALUATION & AUDIT        │
│  - 4-Step Credit Score Wizard  │     │  - Algorithmic Benchmark Matrix       │
│  - Loan Eligibility Calculator │     │  - Confusion Matrix & ROC Curves      │
│  - Interactive What-If Tool    │     │  - Research Methodology & Paper Notes │
└───────────────┬────────────────┘     └───────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     USER DASHBOARD & PREDICTION HISTORY                      │
│  - Credit Score Gauge & Health Metrics                                       │
│  - SHAP Feature Attribution Waterfall                                        │
│  - Historical Assessments Ledger & Trend Analytics                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme
- **Fintech Dark Canvas**: Primary background `#071B26`, secondary surface `#0D2936`, card background `#123644`, subtle hairline borders `rgba(69, 214, 197, 0.15)`.
- **Light Theme Harmony**: Pristine mint-tinted light canvas `#F4FAFA`, structural surfaces `#E9F6F4` and `#FFFFFF`, borders `rgba(13, 41, 54, 0.12)`.
- **Accent Hierarchy**: Vibrant primary teal accent `#00C6B2` (CTA buttons, positive indicators), secondary turquoise `#45D6C5` (active states, charts), warning amber `#F59E0B` (moderate risk), and alert rose `#EF4444` (high debt burden / delinquency flags).
- **Typography**: Display headlines in `Plus Jakarta Sans`, body prose in `DM Sans`, and numerical figures/rates in `JetBrains Mono` with strict `tabular-nums`.
- **Design Constitution Compliance**:
  - Top Bar Contract: 3 zones (brand wordmark, single-line links, primary action).
  - Zero-pill discipline: Metadata rendered with quiet typographic bullets (`·`).
  - Single-elevation cards with clean hairline borders; no nested cards or decorative pulsing dots.

---

## 3. Key Product Decisions & Trade-Offs

### 1. Dual-Model Architecture (Score Estimation vs. Loan Eligibility)
- **Chosen Approach**: Two distinct mathematical pipelines:
  - *Model A (Credit Score Estimation)*: Continuous score calibration (300–850) based on credit utilization, payment history ratios, debt-to-income, and age of credit lines, evaluated via MAE, RMSE, and $R^2$.
  - *Model B (Loan Eligibility Classification)*: Supervised classifier (comparing Logistic Regression, Random Forest, and XGBoost) predicting binary/ternary repayment viability conditioned on requested loan amount, tenure, EMI burden, and liquidity, evaluated via ROC-AUC, F1-score, and Confusion Matrices.
- **Why**: Avoids conflating a credit score with loan approval. A borrower can have a decent score but still be ineligible for a large loan if their existing DTI ratio exceeds 45%.

### 2. Full-Stack Node.js ML Inference with Python Training Pipeline
- **Chosen Approach**: Offline Python training script (`ml/train_models.py`) with Scikit-learn/XGBoost that ingests benchmark credit datasets, performs stratified train-test splitting, cross-validates 5 algorithms, calculates SHAP feature importances, and exports model coefficients, tree splits, scaler parameters, and evaluation matrices into structured JSON artifacts. The Node.js Express server (`server.ts`) loads these artifacts to run instantaneous, deterministic inference and what-if calculations.
- **Why**: Delivers sub-15ms prediction latency in the web environment, eliminates external Python runtime crashes during user requests, and ensures verifiable model outputs matching the exact benchmark metrics.

### 3. Client & Server Persistence
- **Chosen Approach**: Local database store on the server with user profiles, authenticated sessions, saved assessment history, and preferences, backed by client-side local caching so visitors can test the tool immediately as a guest or sign in to save lifetime history.

---

## 4. Technical Architecture & Data Strategy

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Vite + React 19)                      │
│                                                                              │
│   LandingPage   DashboardView   CreditForm   LoanAssessment   SimulatorView  │
│        │              │              │              │               │        │
│        └──────────────┴───────┬──────┴──────────────┴───────────────┘        │
│                               ▼                                              │
│                      State & API Client (`src/api`)                          │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │ HTTP / JSON (/api/*)
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND REST API (`server.ts`)                       │
│                                                                              │
│   /api/health               /api/predict/credit-score                        │
│   /api/predict/loan-elig    /api/simulate                                    │
│   /api/model/metrics        /api/model/feature-importance                    │
│   /api/history              /api/auth/*                                      │
│                               │                                              │
│               ┌───────────────┴───────────────┐                              │
│               ▼                               ▼                              │
│   ┌──────────────────────────┐    ┌───────────────────────────┐              │
│   │   ML INFERENCE ENGINE    │    │    PERSISTENCE STORE      │              │
│   │  - Scaler Transforms     │    │  - User Profiles          │              │
│   │  - Ensemble Trees/Logit  │    │  - Assessment History     │              │
│   │  - SHAP Explainer        │    │  - User Preferences       │              │
│   │  - Product EMI Engine    │    │                           │              │
│   └───────────▲──────────────┘    └───────────────────────────┘              │
│               │ (Pre-computed weights & trees)                               │
│   ┌───────────┴──────────────┐                                               │
│   │   PYTHON ML PIPELINE     │                                               │
│   │  - Data Preprocessing    │                                               │
│   │  - 5-Model Benchmark     │                                               │
│   │  - Metric Evaluation     │                                               │
│   └──────────────────────────┘                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Key Interactive Components & Views
1. **Landing Page**: FinTech hero, 4-pillar methodology, interactive mini-score calculator preview, loan categories overview, responsible AI and educational disclaimers.
2. **Dashboard**: Estimated credit score dial, credit health grade, debt-to-income breakdown, risk category tag, historical progress charts, and quick-action launcher.
3. **Credit Score Prediction Wizard**: 4-step structured form with real-time Zod validation, progress indicators, review drawer, and instant ML scoring output.
4. **Loan Eligibility Calculator**: Loan type selection (Personal, Education, Home, Vehicle), principal slider, tenure selector, dynamic EMI and DTI calculation, qualification badge, and factor breakdown.
5. **AI Explainability (XAI) Suite**: SHAP waterfall and horizontal bar charts showing top positive and negative influencers with plain-language financial guidance.
6. **Financial What-If Simulator**: Interactive sliders for monthly income, outstanding debt, credit utilization, and EMI obligations with side-by-side delta metrics.
7. **Model Evaluation & Research Hub**: Benchmark comparison matrix (Logistic Regression, Random Forest, XGBoost, SVM, KNN), confusion matrices, ROC curves, and citations referencing Shahane & Gore (2018).
8. **Prediction History & Export**: Filterable table of past assessments with drill-down modal, JSON/CSV export, and deletion capabilities.
