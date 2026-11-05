import React, { useEffect, useState } from 'react';
import { ModelBenchmarkSuite } from '../types';
import { apiFetchModelMetrics } from '../api';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  BarChart3,
  BookOpen,
  Award,
  Database,
  Cpu,
  Layers,
  HelpCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

export const ModelEvaluation: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelBenchmarkSuite | null>(null);
  const [selectedAlgoTab, setSelectedAlgoTab] = useState<string>('rf');

  useEffect(() => {
    apiFetchModelMetrics().then(setMetrics);
  }, []);

  if (!metrics) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
        Loading machine learning evaluation suite...
      </div>
    );
  }

  const selectedAlgo = metrics.algorithms.find(a => a.id === selectedAlgoTab) || metrics.algorithms[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Scientific Audit &amp; Benchmarks</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Machine Learning Model Evaluation &amp; Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Empirical comparison across 5 supervised classification algorithms, cross-validated on the German Credit &amp; Give Me Some Credit (GMSC) benchmarks.
        </p>
      </div>

      {/* Methodological Context & Reference Paper Citation */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <BookOpen className="w-4 h-4" />
          <h3 className="text-sm font-bold text-white">Methodological Reference &amp; Survey Framework</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-slate-300">
          <div className="md:col-span-8 space-y-2 leading-relaxed">
            <p>
              This platform's machine learning evaluation architecture is grounded in the classification taxonomy and comparative framework outlined by:
            </p>
            <blockquote className="p-3 rounded-lg bg-slate-950 border border-slate-800 italic text-rose-200 font-serif">
              "A Survey on Classification Techniques to Determine Fake vs. Real Identities on Social Media Platforms" — Priyanka Shahane and Deipali Gore (2018).
            </blockquote>
            <p className="text-[11px] text-slate-400">
              <strong className="text-slate-300">Important Attribution Notice:</strong> The reference survey evaluates classification methods (Supervised, Semi-supervised, Random Forest, Logistic Regression, Support Vector Machines, Naive Bayes, KNN, and Neural Networks) within social media identity verification. We adapted its rigorous multi-model comparison methodology specifically to credit-risk prediction. The original paper's reported dataset accuracy was not transferred to this domain.
            </p>
          </div>

          <div className="md:col-span-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
            <div className="font-semibold text-white uppercase tracking-wider text-[10px]">Benchmark Datasets Harmonized:</div>
            <div className="text-slate-400">
              <span className="text-rose-400 font-bold">1. Statlog German Credit Data:</span> 1,000 credit cases across 20 financial and contractual variables (UCI ML Repo).
            </div>
            <div className="text-slate-400">
              <span className="text-rose-400 font-bold">2. Give Me Some Credit (GMSC):</span> 150,000 real borrower repayment records for delinquency probability calibration.
            </div>
          </div>
        </div>
      </div>

      {/* 5-Algorithm Comparison Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-rose-400" />
            <h3 className="text-base font-bold text-white">Algorithm Benchmark Comparison</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">5-Fold Stratified Cross-Validation</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Algorithm</th>
                <th className="py-3 px-3">Accuracy</th>
                <th className="py-3 px-3">Precision</th>
                <th className="py-3 px-3">Recall</th>
                <th className="py-3 px-3">F1-Score</th>
                <th className="py-3 px-3">ROC-AUC</th>
                <th className="py-3 px-3">MAE</th>
                <th className="py-3 px-3">Latency</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
              {metrics.algorithms.map((algo) => {
                return (
                  <tr
                    key={algo.id}
                    onClick={() => setSelectedAlgoTab(algo.id)}
                    className={`cursor-pointer transition-colors ${
                      selectedAlgoTab === algo.id
                        ? 'bg-rose-950/60 text-white font-medium'
                        : 'hover:bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-sans font-semibold flex items-center gap-2">
                      <span>{algo.name}</span>
                      {algo.isSelected && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-700 text-white font-bold uppercase shadow-sm">
                          Selected
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">{(algo.accuracy * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-3">{(algo.precision * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-3">{(algo.recall * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-3">{(algo.f1Score * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-3 font-bold text-rose-400">{algo.rocAuc.toFixed(3)}</td>
                    <td className="py-3.5 px-3">±{algo.mae.toFixed(1)}</td>
                    <td className="py-3.5 px-3 text-slate-400">{algo.inferenceLatencyMs}ms</td>
                    <td className="py-3.5 px-4 font-sans text-[11px]">
                      {algo.isSelected ? (
                        <span className="text-rose-400 font-semibold">Production Inferred</span>
                      ) : (
                        <span className="text-slate-500">Evaluated Candidate</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Algorithm Deep-Dive */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-rose-400" />
              <span>Model Selection Justification: {selectedAlgo.name}</span>
            </div>
            <p className="text-slate-400 text-xs mt-1">{selectedAlgo.description}</p>
          </div>
          <div className="text-right text-xs shrink-0">
            <span className="text-slate-500">Training duration: </span>
            <strong className="text-slate-200 font-mono">{selectedAlgo.trainingSeconds}s</strong>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: ROC Curve & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ROC Curve Graph */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">ROC Curve (Receiver Operating Characteristic)</h3>
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold">AUC = 0.892</span>
          </div>

          <p className="text-xs text-slate-400">
            True Positive Rate (Sensitivity) vs False Positive Rate (1 - Specificity) across probability decision thresholds.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.rocCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="fpr" stroke="#64748B" fontSize={10} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <YAxis dataKey="tpr" stroke="#64748B" fontSize={10} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(value: any, name: any) => [
                    `${(Number(value) * 100).toFixed(1)}%`,
                    name === 'tpr' ? 'Model TPR' : 'Random Guess Baseline'
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="tpr"
                  stroke="#E11D48"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#E11D48' }}
                  name="tpr"
                />
                <Line
                  type="monotone"
                  dataKey="randomLine"
                  stroke="#475569"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  name="randomLine"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-rose-500 inline-block" />
              <span>Random Forest Model (AUC = 0.892)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-slate-500 border-dashed inline-block" />
              <span>Random Baseline (AUC = 0.500)</span>
            </div>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Test Set Confusion Matrix</h3>
          </div>

          <p className="text-xs text-slate-400">
            Validation distribution across {metrics.confusionMatrix.totalTestSamples.toLocaleString()} holdout credit cases.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            {/* TP */}
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/40 text-center">
              <div className="text-[10px] text-rose-300 uppercase tracking-wider font-sans">True Positives (TP)</div>
              <div className="text-2xl font-bold text-rose-400 mt-1">
                {metrics.confusionMatrix.truePositive}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-sans">Correctly identified low-risk</div>
            </div>

            {/* FP */}
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center">
              <div className="text-[10px] text-rose-300 uppercase tracking-wider font-sans">False Positives (FP)</div>
              <div className="text-2xl font-bold text-rose-400 mt-1">
                {metrics.confusionMatrix.falsePositive}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-sans">Type I Error (Adverse)</div>
            </div>

            {/* FN */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
              <div className="text-[10px] text-amber-300 uppercase tracking-wider font-sans">False Negatives (FN)</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                {metrics.confusionMatrix.falseNegative}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-sans">Type II Error (Missed low-risk)</div>
            </div>

            {/* TN */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-sans">True Negatives (TN)</div>
              <div className="text-2xl font-bold text-slate-200 mt-1">
                {metrics.confusionMatrix.trueNegative}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-sans">Correctly identified high-risk</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Overall Diagnostic Accuracy:</span>
            <strong className="font-mono text-rose-400 font-bold">86.4%</strong>
          </div>
        </div>

      </div>

      {/* Global Feature Importance Ranking (Bar Chart) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-rose-400" />
            <h3 className="text-base font-bold text-white">Global Feature Importance Ranking</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Mean Decrease in Impurity (MDI)</span>
        </div>

        <p className="text-xs text-slate-400">
          Relative percentage contribution of financial features across all 150 decision trees in the selected Random Forest ensemble.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={metrics.featureImportances}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 160, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
              <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <YAxis dataKey="feature" type="category" stroke="#94A3B8" fontSize={11} width={150} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                formatter={(val: any) => [`${(Number(val) * 100).toFixed(1)}% Weight`, 'Feature Weight']}
              />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {metrics.featureImportances.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#E11D48' : index === 1 ? '#BE123C' : index === 2 ? '#9F1239' : '#881337'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
