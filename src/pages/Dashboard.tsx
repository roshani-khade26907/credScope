import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetchHistory, apiPredictCreditScore } from '../api';
import { StoredAssessment, CreditScoreResult } from '../types';
import { CreditScoreGauge, calculateRiskDetails } from '../components/CreditScoreGauge';
import {
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Calendar,
  Layers,
  ArrowRight,
  PlusCircle,
  FileCheck2,
  PieChart as PieIcon,
  Activity,
  SlidersHorizontal,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<StoredAssessment[]>([]);
  const [activeProfileMode, setActiveProfileMode] = useState<'prime' | 'risky'>('prime');
  const [latestScore, setLatestScore] = useState<number>(754);
  const [latestRisk, setLatestRisk] = useState<string>('Very Good');
  const [latestTier, setLatestTier] = useState<number>(2);
  const [latestDefaultRate, setLatestDefaultRate] = useState<number>(3.8);
  const [latestDti, setLatestDti] = useState<number>(10.0);
  const [loading, setLoading] = useState(true);

  // Switch demo profile between Prime and High-Risk
  const setProfileMode = (mode: 'prime' | 'risky') => {
    setActiveProfileMode(mode);
    if (mode === 'risky') {
      setLatestScore(528);
      setLatestRisk('Poor');
      setLatestTier(5);
      setLatestDefaultRate(58.7);
      setLatestDti(51.6);
    } else {
      setLatestScore(754);
      setLatestRisk('Very Good');
      setLatestTier(2);
      setLatestDefaultRate(3.8);
      setLatestDti(10.0);
    }
  };

  useEffect(() => {
    apiFetchHistory(user.id).then((data) => {
      setAssessments(data);
      if (activeProfileMode === 'prime') {
        const scoreAssessment = data.find(a => a.assessmentType === 'credit_score');
        if (scoreAssessment) {
          const sc = Number(scoreAssessment.scoreOrStatus) || 754;
          setLatestScore(sc);
          const derived = calculateRiskDetails(sc);
          setLatestRisk(scoreAssessment.riskCategory || derived.riskLevel);
          setLatestTier(scoreAssessment.predictionResult?.riskTier ?? derived.tier);
          setLatestDefaultRate(
            scoreAssessment.predictionResult?.probabilityOfDefaultPct !== undefined
              ? Number(scoreAssessment.predictionResult.probabilityOfDefaultPct)
              : derived.defaultRiskPct
          );
          setLatestDti(scoreAssessment.predictionResult?.debtToIncomeRatio || 10.0);
        } else {
          const derived = calculateRiskDetails(754);
          setLatestDefaultRate(derived.defaultRiskPct);
          setLatestTier(derived.tier);
        }
      }
      setLoading(false);
    });
  }, [user.id, activeProfileMode]);

  // Generate historical progression trend data from assessments or realistic trajectory
  const trendData = activeProfileMode === 'risky' ? [
    { month: 'May', score: 635, dti: 38 },
    { month: 'Jul', score: 595, dti: 44 },
    { month: 'Sep', score: 565, dti: 48 },
    { month: 'Oct', score: 540, dti: 50 },
    { month: 'Nov', score: 528, dti: 51.6 }
  ] : [
    { month: 'May', score: 712, dti: 18 },
    { month: 'Jul', score: 728, dti: 15 },
    { month: 'Sep', score: 742, dti: 12 },
    { month: 'Oct', score: 748, dti: 11 },
    { month: 'Nov', score: latestScore, dti: latestDti }
  ];

  const recentList = assessments.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Welcome with Profile Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Authenticated Portfolio Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome back, {user.displayName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personal credit diagnostics, debt ratios, and borrowing eligibility overview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Demo Profile Toggle Buttons */}
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setProfileMode('prime')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeProfileMode === 'prime'
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Prime Profile (754)
            </button>
            <button
              onClick={() => setProfileMode('risky')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeProfileMode === 'risky'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚠ Risky Demo Profile (528)
            </button>
          </div>

          <button
            onClick={() => onNavigate('score')}
            className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-950/40 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* High Risk Banner Alert when in Risky Demo Mode */}
      {activeProfileMode === 'risky' && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-rose-300">
              Demonstration Mode: High-Risk Subprime Borrower Profile Loaded (Score: 528 · Tier 5)
            </div>
            <div className="text-slate-400 leading-relaxed">
              This demonstration simulates a profile with 88% credit card utilization, 51.6% DTI, 3 late payments, and a previous collection default. The Credit Health Gauge illustrates subprime risk posture with an estimated 58.7% default probability.
            </div>
          </div>
        </div>
      )}

      {/* 5 Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Card 1: Score */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Latest Score</span>
          <div className={`text-2xl font-extrabold font-mono tabular-nums ${activeProfileMode === 'risky' ? 'text-rose-400' : 'text-rose-400'}`}>
            {latestScore}
          </div>
          <div className="text-[11px] text-slate-400">Scale 300–850</div>
        </div>

        {/* Card 2: Risk Standing & Percentage */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Risk Standing</span>
          <div className="text-base font-bold text-slate-100 truncate mt-0.5 flex items-center justify-between">
            <span>{latestRisk}</span>
            <span className="text-xs font-mono font-bold text-rose-400 tabular-nums">
              {latestDefaultRate.toFixed(1)}% Risk
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Tier {latestTier} · <span className="text-emerald-400 font-mono">{(100 - latestDefaultRate).toFixed(1)}% Reliability</span>
          </div>
        </div>

        {/* Card 3: Debt to Income */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Debt-to-Income</span>
          <div className="text-2xl font-extrabold font-mono text-slate-100 tabular-nums">
            {latestDti}%
          </div>
          <div className="text-[11px] text-slate-400">Prudent &lt; 36%</div>
        </div>

        {/* Card 4: Last Evaluation */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Last Assessment</span>
          <div className="text-sm font-semibold text-slate-200 mt-1 truncate">
            {assessments.length > 0 ? new Date(assessments[0].createdAt).toLocaleDateString() : 'Today'}
          </div>
          <div className="text-[11px] text-slate-500">Continuous model</div>
        </div>

        {/* Card 5: Assessments Run */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 col-span-2 md:col-span-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Completed Runs</span>
          <div className="text-2xl font-extrabold font-mono text-slate-100 tabular-nums">
            {assessments.length}
          </div>
          <div className="text-[11px] text-rose-400">History saved</div>
        </div>
      </div>

      {/* Main Grid: Gauge + Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Score Gauge Card */}
        <div className="dashboard-credit-health-gauge lg:col-span-5 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col items-center justify-between space-y-5">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>Credit Health &amp; Risk Gauge</span>
            </h3>
            <span className="text-[11px] font-mono text-rose-400 font-bold">{latestDefaultRate.toFixed(1)}% Risk</span>
          </div>

          <CreditScoreGauge
            score={latestScore}
            riskCategory={latestRisk as any}
            riskTier={latestTier}
            confidenceScore={0.92}
            probabilityOfDefaultPct={latestDefaultRate}
            size="normal"
          />

          {/* Explicit Risk Percentage Details */}
          <div className="w-full grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Default Risk Rate</span>
              <div className="text-sm font-bold font-mono text-rose-400 tabular-nums mt-0.5">
                {latestDefaultRate.toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-400">GMSC Benchmark</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Repayment Probability</span>
              <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                {(100 - latestDefaultRate).toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-400">Prime Certainty</span>
            </div>
          </div>

          <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Explore loan products:</span>
            <button
              onClick={() => onNavigate('loans')}
              className="text-rose-400 font-semibold hover:underline flex items-center gap-1"
            >
              Loan Eligibility <ArrowRight className="w-3 h-3 text-rose-400" />
            </button>
          </div>
        </div>

        {/* Progression Trend Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-400" />
              <span>Estimated Score Progression (Past 6 Months)</span>
            </h3>
            <span className="text-xs font-mono text-rose-400 font-bold">+42 pts overall</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis domain={[650, 800]} stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#E11D48"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#E11D48' }}
                  name="Estimated Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-slate-400">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase">Credit Utilization</span>
              <div className="text-sm font-bold text-white font-mono mt-0.5">22% (Optimal &lt; 30%)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase">Payment Consistency</span>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">100% On-Time (24 mos)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launchers & Recent History List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Launchers */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-sm font-bold text-white">Diagnostic Tools</div>

          <button
            onClick={() => onNavigate('score')}
            className="w-full p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-left transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                Run Full Credit Diagnostic
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                4-step analysis with complete SHAP waterfall attribution.
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
          </button>

          <button
            onClick={() => onNavigate('loans')}
            className="w-full p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-left transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                Loan Affordability Calculator
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Check Personal, Education, Home, or Auto loan capacity.
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
          </button>

          <button
            onClick={() => onNavigate('simulator')}
            className="w-full p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-left transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                What-If Scenario Simulator
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Adjust debt balances and forecast score changes.
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
          </button>
        </div>

        {/* Recent History Table */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Recent Assessment Activity</h3>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-rose-400 hover:underline"
            >
              View Full History ({assessments.length})
            </button>
          </div>

          {recentList.length > 0 ? (
            <div className="divide-y divide-slate-800/60">
              {recentList.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-200 capitalize">
                      {item.assessmentType.replace('_', ' ')}
                      {item.loanType ? ` (${item.loanType})` : ''}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-rose-400">
                      {item.scoreOrStatus}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {item.riskCategory}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No assessments recorded yet. Run your first score prediction to build history.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
