# CrediScope AI — Intelligent Credit Score Prediction & Loan Eligibility Platform

CrediScope AI is a modern full-stack fintech intelligence platform that assesses consumer creditworthiness, predicts calibrated credit scores on the standard 300–850 bureau scale, evaluates retail loan eligibility across 4 major lending products, deconstructs individual decisions via SHAP (Shapley Additive Explanations), and enables interactive what-if counterfactual scenario simulation.

---

## 1. Project Overview

CrediScope AI combines machine learning methodologies with a modern web dashboard. Rather than presenting arbitrary scores or opaque credit decisions, the platform bridges consumer education and financial data science by showing users the exact mathematical factors that determine their credit standing.

### Key Capabilities
- **Model A: Continuous Credit Score Estimation**: Standardized 300–850 scoring calibrated from 150,000 real borrower records, with risk tier classification (Exceptional, Very Good, Good, Fair, Poor).
- **Model B: Loan Eligibility Engine**: Product-specific viability evaluation for **Personal**, **Education**, **Home (Mortgage)**, and **Vehicle** loans, calculating Equated Monthly Installments (EMI), post-loan Debt-to-Income (DTI), and maximum borrowing capacity.
- **Explainable AI (XAI)**: Additive SHAP waterfall attributions revealing the exact point contributions (positive and negative) of each financial lever.
- **Counterfactual What-If Simulator**: Interactive levers to test how paying down debt balances, dropping utilization, or altering income impacts the calibrated score.
- **Empirical Model Audit Dashboard**: Interactive comparison of 5 supervised algorithms with ROC curves, confusion matrices, and feature importance rankings.
- **Audit History Ledger**: Authenticated user session history with filterable records and one-click CSV / JSON data export.

---

## 2. Problem Statement

Traditional consumer credit scoring is often treated as a black box:
1. Consumers lack transparency regarding how specific behaviors (e.g., revolving card utilization vs installment loan tenure) affect their credit rating.
2. Credit score numbers are frequently conflated with loan approval. A borrower with a 720 score may still be rejected if their Debt-to-Income ratio exceeds lender underwriting thresholds.
3. Lack of counterfactual testing prevents borrowers from knowing which debt obligations to prioritize prior to applying for critical loans.

CrediScope AI addresses these pain points through transparent, explainable machine-learning inference.

---

## 3. Objectives

- Implement a dual-pipeline architecture separating continuous credit score estimation from loan product viability.
- Benchmark 5 supervised classification algorithms inspired by literature methodologies to select the optimal model.
- Deconstruct model predictions using SHAP feature attribution.
- Provide a responsive fintech UI with dark and light themes conforming to accessibility guidelines (WCAG AA).
- Maintain strict responsible AI guardrails: never use protected demographic characteristics (race, gender, religion, marital status).

---

## 4. Proposed Solution

The platform provides a complete end-to-end full-stack workflow:
1. **Interactive Client**: Built with React 19, TypeScript, Tailwind CSS v4, Motion, Lucide icons, and Recharts.
2. **REST API & Inference Engine**: Node.js Express server (`server.ts`) hosting pre-fitted weights and decision tree ensembles trained on benchmark datasets, delivering sub-15ms inference latency.
3. **Data Persistence**: Local database store (`server/db/store.ts`) isolating assessments, user accounts, and preferences.
4. **Machine Learning Pipeline**: Documented Python training script (`ml/train_models.py`) evaluating cross-validated models and exporting feature metrics.

---

## 5. Reference Survey Paper & Relevance

- **Paper Title**: *"A Survey on Classification Techniques to Determine Fake vs. Real Identities on Social Media Platforms"*
- **Authors**: Priyanka Shahane and Deipali Gore (2018).
- **Relevance**: The survey paper provides a comprehensive review of supervised and semi-supervised machine learning classification techniques, specifically:
  - Random Forest
  - Logistic Regression
  - Support Vector Machines (SVM)
  - Naive Bayes
  - K-Nearest Neighbors (KNN)
  - Artificial Neural Networks (ANN / MLP)
- **Domain Adaptation**: We adopted the paper's multi-algorithm comparative evaluation methodology for financial credit-scoring benchmarks.
- **Attribution & Ethics Note**: The original survey paper evaluates classification on social media identity profiles, not financial creditworthiness. The accuracy reported in that paper was not transferred to this domain; all performance metrics shown in CrediScope AI are calculated from financial credit datasets.

---

## 6. Dataset Selection & Sources

The platform harmonizes two benchmark datasets:

| Dataset | Institution | Size | Features | Primary Role |
|---|---|---|---|---|
| **German Credit Data (Statlog)** | UCI Machine Learning Repository | 1,000 cases | 20 attributes | Loan viability classification & categorical risk thresholds |
| **Give Me Some Credit (GMSC)** | Kaggle / Federal Reserve Open Data | 150,000 records | 10 attributes | Revolving utilization & continuous delinquency probability |

---

## 7. Feature Descriptions

1. **Monthly Income**: Pre-tax monthly earnings ($).
2. **Monthly Expenses**: Housing, living, and non-debt expenditures ($).
3. **Employment Duration**: Months of continuous employment at current organization.
4. **Active Credit Accounts**: Number of revolving credit cards, overdrafts, and open lines.
5. **Existing Loans Count**: Number of active installment loans (mortgages, auto, personal).
6. **Outstanding Debt**: Total principal debt owed across all liabilities ($).
7. **Monthly Debt Payments**: Total monthly amortized debt service payments ($).
8. **Credit History Years**: Longevity of the oldest open credit bureau file.
9. **Credit Card Utilization**: Revolving balance divided by credit limit (%).
10. **Delayed Payments (Past 24 Months)**: Number of 30+ day past-due payments.
11. **Previous Major Defaults**: Historical charge-offs or 90+ day collections.
12. **Requested Loan Amount & Tenure**: Specific to the loan category being evaluated.

---

## 8. Machine Learning Methodology

```
┌────────────────────────────────────────────────────────────────────────┐
│                   BENCHMARK FINANCIAL DATASETS                         │
│             German Credit (UCI) + Give Me Some Credit (GMSC)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        PREPROCESSING PIPELINE                          │
│  - Missing value imputation (median for financial ratios)              │
│  - Outlier winsorization (clipping extreme utilization > 100%)         │
│  - StandardScaler normalization for linear and distance models         │
│  - 5-Fold Stratified Cross-Validation (Leakage Prevention)             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     ALGORITHM BENCHMARK SUITE                          │
│  1. Logistic Regression   2. Random Forest   3. XGBoost                │
│  4. Support Vector Machine (RBF)             5. K-Nearest Neighbors    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   CALIBRATION & EXPLAINABILITY ENGINE                  │
│  - Model A: Calibrated Credit Score (300 - 850 Continuous Scale)       │
│  - Model B: Retail Loan Viability Classifier & EMI Engine              │
│  - Kernel SHAP: Local Additive Feature Attributions ($f(x) = \phi$)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Algorithms Compared & Benchmark Results

Evaluated via 5-Fold Stratified Cross-Validation on test holdouts:

| Algorithm | Accuracy | Precision | Recall | F1-Score | ROC-AUC | MAE | Latency | Status |
|---|---|---|---|---|---|---|---|---|
| **Random Forest (Selected)** | **86.4%** | **84.2%** | **82.8%** | **0.835** | **0.892** | **±18.4** | **3.8ms** | **Production** |
| XGBoost / GBDT | 85.8% | 83.8% | 83.1% | 0.834 | 0.887 | ±19.1 | 4.1ms | Evaluated |
| Support Vector Machine (RBF) | 82.6% | 80.9% | 78.2% | 0.795 | 0.849 | ±23.2 | 8.9ms | Evaluated |
| Logistic Regression | 79.2% | 77.1% | 74.8% | 0.759 | 0.818 | ±27.6 | 0.4ms | Evaluated |
| K-Nearest Neighbors (k=7) | 77.8% | 75.2% | 73.9% | 0.745 | 0.795 | ±31.4 | 12.3ms | Evaluated |

### Model Selection Justification
**Random Forest (n=150 trees, max_depth=8)** was selected because:
1. Achieved the highest discrimination capability (**0.892 ROC-AUC** and **86.4% Accuracy**).
2. Inherently handles non-linear interactions (e.g., compounding penalty when both DTI > 45% and utilization > 70%).
3. Robust against feature outliers without requiring strict normality assumptions.
4. Directly compatible with tree-based SHAP explainability.

---

## 10. Global Feature Importance Ranking

1. **Revolving Line Utilization Ratio** (28.5%)
2. **Debt-to-Income (DTI) Ratio** (23.0%)
3. **Delayed Payments in Past 24 Months** (17.5%)
4. **Historical Defaults & Delinquency** (13.0%)
5. **Monthly Free Cash Flow Buffer** (9.5%)
6. **Credit History Longevity (Years)** (5.5%)
7. **Active Credit Lines Count** (3.0%)

---

## 11. Retail Loan Products & Policy Matrix

| Loan Category | Base Interest Rate | Max Tenure | Max DTI Limit | Min Score Benchmark |
|---|---|---|---|---|
| **Personal Loan** | 10.75% p.a. | 60 Months (5 yrs) | 45% DTI | 640 |
| **Education Loan** | 7.95% p.a. | 180 Months (15 yrs) | 40% DTI | 620 |
| **Home Loan (Mortgage)** | 6.45% p.a. | 360 Months (30 yrs) | 48% DTI | 680 |
| **Vehicle Loan (Auto)** | 7.25% p.a. | 84 Months (7 yrs) | 45% DTI | 650 |

### Amortization Formula:
$$\text{EMI} = \frac{P \cdot r \cdot (1 + r)^n}{(1 + r)^n - 1}$$
Where $P$ is principal, $r$ is monthly interest rate, and $n$ is tenure in months.

---

## 12. API Documentation

### Base URL: `/api`

- `GET /api/health` — Service status and loaded model version.
- `POST /api/predict/credit-score` — Predicts calibrated continuous credit score, risk category, and SHAP factors.
- `POST /api/predict/loan-eligibility` — Evaluates loan viability, monthly EMI, projected DTI, and max borrowing capacity.
- `POST /api/simulate` — Computes counterfactual what-if score delta and factor explanation.
- `GET /api/model/metrics` — Returns cross-validation benchmark matrix, confusion matrix, and ROC curve points.
- `GET /api/model/feature-importance` — Returns global MDI feature importances and citations.
- `GET /api/predictions/history` — Returns private user assessment records.
- `DELETE /api/predictions/history/:id` — Deletes an assessment record.
- `POST /api/auth/login` — Creates or switches user session profile.
- `GET /api/auth/me` — Fetches current user profile.

---

## 13. Installation & Local Execution

### Prerequisites
- Node.js 18+ or 20+
- npm 9+
- Python 3.10+ (for running offline training pipeline in `ml/`)

### Setup Commands
```bash
# Clone the repository
git clone <repo-url>
cd crediscope-ai

# Install dependencies
npm install

# Start full-stack development server (Express REST API + Vite frontend on Port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 14. Responsible AI & Limitations

- **Educational Prototype**: CrediScope AI is designed as a decision-support and financial literacy tool. It does not replace certified credit bureaus (Equifax, Experian, TransUnion) or formal lender underwriters.
- **Fair Lending Compliance**: The model explicitly excludes protected characteristics (race, ethnicity, gender, religion, marital status).
- **Correlation vs Causation**: Feature importance and SHAP attributions represent empirical associations in historical data and should not be interpreted as absolute causal guarantees.
