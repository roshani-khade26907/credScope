/**
 * CrediScope AI — Persistent Data Storage Layer
 * Manages user accounts, session profiles, prediction history, and user preferences.
 */

import fs from 'fs';
import path from 'path';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
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

export interface UserPreferences {
  userId: string;
  preferredTheme: 'dark' | 'light';
  preferredLoanType: 'personal' | 'education' | 'home' | 'vehicle';
  updatedAt: string;
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const STORE_FILE = path.join(DATA_DIR, 'crediscope_store.json');

interface DatabaseSchema {
  users: Record<string, UserProfile>;
  assessments: StoredAssessment[];
  preferences: Record<string, UserPreferences>;
}

// Initial seed profile and assessments for demonstration
const INITIAL_DEMO_USER: UserProfile = {
  id: 'usr_demo_883',
  email: 'roshanikhade2609@gmail.com',
  displayName: 'Roshani Khade',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
};

const SEED_ASSESSMENTS: StoredAssessment[] = [
  {
    id: 'asmt_01_init',
    userId: INITIAL_DEMO_USER.id,
    assessmentType: 'credit_score',
    inputSummary: {
      monthlyIncome: 6500,
      monthlyExpenses: 2200,
      monthlyDebtPayments: 650,
      creditCardUtilization: 22,
      creditHistoryYears: 6.5,
      delayedPaymentsLast2Years: 0,
      previousDefaultsCount: 0
    },
    predictionResult: {
      estimatedScore: 754,
      riskCategory: 'Very Good',
      probabilityOfDefaultPct: 3.8,
      debtToIncomeRatio: 10.0
    },
    riskCategory: 'Very Good',
    scoreOrStatus: 754,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString()
  },
  {
    id: 'asmt_02_home',
    userId: INITIAL_DEMO_USER.id,
    assessmentType: 'loan_eligibility',
    loanType: 'home',
    inputSummary: {
      loanType: 'home',
      requestedAmount: 320000,
      tenureMonths: 240,
      monthlyIncome: 6500,
      monthlyDebtPayments: 650
    },
    predictionResult: {
      eligibilityCategory: 'Higher Estimated Eligibility',
      eligibilityScorePct: 88,
      monthlyInstallmentEMI: 2378,
      projectedDtiPct: 46.6,
      maxRecommendedLoanCapacity: 345000
    },
    riskCategory: 'Very Good',
    scoreOrStatus: 'Higher Estimated Eligibility',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
  }
];

class CrediScopeStore {
  private db: DatabaseSchema = {
    users: { [INITIAL_DEMO_USER.id]: INITIAL_DEMO_USER },
    assessments: [...SEED_ASSESSMENTS],
    preferences: {
      [INITIAL_DEMO_USER.id]: {
        userId: INITIAL_DEMO_USER.id,
        preferredTheme: 'dark',
        preferredLoanType: 'home',
        updatedAt: new Date().toISOString()
      }
    }
  };

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.assessments) {
          this.db = parsed;
        }
      } else {
        this.persistToDisk();
      }
    } catch (e) {
      console.warn('Could not load persistent database, using memory fallback:', e);
    }
  }

  private persistToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not persist to disk:', e);
    }
  }

  public getOrCreateUser(email: string, displayName?: string): UserProfile {
    const existing = Object.values(this.db.users).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return existing;

    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const user: UserProfile = {
      id,
      email,
      displayName: displayName || email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    this.db.users[id] = user;
    this.persistToDisk();
    return user;
  }

  public getUserById(id: string): UserProfile | null {
    return this.db.users[id] || null;
  }

  public saveAssessment(
    userId: string,
    type: 'credit_score' | 'loan_eligibility' | 'simulation',
    inputSummary: Record<string, any>,
    predictionResult: Record<string, any>,
    riskCategory: string,
    scoreOrStatus: string | number,
    loanType?: string
  ): StoredAssessment {
    const assessment: StoredAssessment = {
      id: `asmt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      assessmentType: type,
      inputSummary,
      predictionResult,
      riskCategory,
      scoreOrStatus,
      loanType,
      createdAt: new Date().toISOString()
    };

    this.db.assessments.unshift(assessment);
    this.persistToDisk();
    return assessment;
  }

  public getAssessments(userId: string, filterType?: string): StoredAssessment[] {
    let list = this.db.assessments.filter(a => a.userId === userId);
    if (filterType && filterType !== 'all') {
      list = list.filter(a => a.assessmentType === filterType);
    }
    return list;
  }

  public deleteAssessment(id: string, userId: string): boolean {
    const prevLen = this.db.assessments.length;
    this.db.assessments = this.db.assessments.filter(a => !(a.id === id && a.userId === userId));
    if (this.db.assessments.length !== prevLen) {
      this.persistToDisk();
      return true;
    }
    return false;
  }

  public getUserPreferences(userId: string): UserPreferences {
    if (!this.db.preferences[userId]) {
      this.db.preferences[userId] = {
        userId,
        preferredTheme: 'dark',
        preferredLoanType: 'personal',
        updatedAt: new Date().toISOString()
      };
      this.persistToDisk();
    }
    return this.db.preferences[userId];
  }

  public updateUserPreferences(userId: string, prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getUserPreferences(userId);
    const updated: UserPreferences = {
      ...current,
      ...prefs,
      updatedAt: new Date().toISOString()
    };
    this.db.preferences[userId] = updated;
    this.persistToDisk();
    return updated;
  }
}

export const dbStore = new CrediScopeStore();
