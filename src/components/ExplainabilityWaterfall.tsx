import React from 'react';
import { ShapFactor } from '../types';
import { ArrowUpRight, ArrowDownRight, Lightbulb, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ExplainabilityWaterfallProps {
  shapFactors: ShapFactor[];
  baseScore?: number;
  finalScore?: number;
}

export const ExplainabilityWaterfall: React.FC<ExplainabilityWaterfallProps> = ({
  shapFactors,
  baseScore = 675,
  finalScore
}) => {
  const maxImpact = Math.max(...shapFactors.map(f => Math.abs(f.impactScore)), 50);

  const positiveFactors = shapFactors.filter(f => f.impactScore > 0);
  const negativeFactors = shapFactors.filter(f => f.impactScore < 0);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h4 className="font-semibold text-sm text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-rose-400" />
              <span>Additive SHAP Feature Attribution</span>
            </h4>
            <p className="text-slate-400 text-xs mt-0.5">
              Deconstructs how each financial metric pushed your score above or below the baseline population average.
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs shrink-0">
            <div className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
              <span className="text-slate-400">Base Score: </span>
              <strong className="text-slate-200">{baseScore}</strong>
            </div>
            {finalScore && (
              <div className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-800/50">
                <span className="text-rose-400">Result: </span>
                <strong className="text-rose-300">{finalScore}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Quick summary counts */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-rose-400" />
            <span className="text-slate-300">
              <strong className="font-mono text-rose-400">{positiveFactors.length}</strong> positive credit drivers
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">
              <strong className="font-mono text-amber-400">{negativeFactors.length}</strong> risk reduction areas
            </span>
          </div>
        </div>
      </div>

      {/* Waterfall Factor List */}
      <div className="space-y-3">
        {shapFactors.map((factor, idx) => {
          const isPos = factor.impactScore > 0;
          const barWidth = Math.min(100, Math.round((Math.abs(factor.impactScore) / maxImpact) * 100));

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-200">
                      {factor.label}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
                      {factor.value}
                    </span>
                  </div>

                  {/* Recommendation / Mechanism */}
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    {factor.recommendation}
                  </p>
                </div>

                {/* Score Point Delta Badge */}
                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-bold font-mono tabular-nums px-2.5 py-1 rounded-md border ${
                      isPos
                        ? 'bg-rose-950/60 text-rose-300 border-rose-800/50 shadow-sm'
                        : 'bg-red-950/60 text-red-400 border-red-800/50'
                    }`}
                  >
                    {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{isPos ? `+${factor.impactScore}` : factor.impactScore} pts</span>
                  </span>
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="mt-2.5 w-full bg-slate-800/60 h-1.5 rounded-full overflow-hidden flex">
                {isPos ? (
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                ) : (
                  <div
                    className="bg-red-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
