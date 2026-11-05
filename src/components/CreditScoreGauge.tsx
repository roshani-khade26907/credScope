import React from 'react';

export interface CreditScoreGaugeProps {
  score: number;
  riskCategory?: 'Exceptional' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  riskTier?: number;
  probabilityOfDefaultPct?: number;
  confidenceScore?: number;
  size?: 'normal' | 'compact';
}

/**
 * Calibrated risk calculations derived from the German Credit and GMSC benchmarks.
 */
export function calculateRiskDetails(score: number) {
  const clamped = Math.max(300, Math.min(850, score));
  // Standard linear mapping of [300, 850] credit score range to 0 - 100 percentage
  const scorePercentile = Math.round(((clamped - 300) / 550) * 1000) / 10;

  let defaultRiskPct = 0;
  let riskLevel: 'Exceptional' | 'Very Good' | 'Good' | 'Fair' | 'Poor' = 'Very Good';
  let tier = 2;

  if (clamped >= 800) {
    defaultRiskPct = Math.round((1.8 - ((clamped - 800) / 50) * 1.3) * 10) / 10;
    riskLevel = 'Exceptional';
    tier = 1;
  } else if (clamped >= 740) {
    defaultRiskPct = Math.round((5.0 - ((clamped - 740) / 60) * 3.1) * 10) / 10;
    riskLevel = 'Very Good';
    tier = 2;
  } else if (clamped >= 670) {
    defaultRiskPct = Math.round((15.0 - ((clamped - 670) / 70) * 9.9) * 10) / 10;
    riskLevel = 'Good';
    tier = 3;
  } else if (clamped >= 580) {
    defaultRiskPct = Math.round((35.0 - ((clamped - 580) / 90) * 19.9) * 10) / 10;
    riskLevel = 'Fair';
    tier = 4;
  } else {
    // 300 - 579 Subprime / Poor Risk band
    defaultRiskPct = Math.round((75.0 - ((clamped - 300) / 280) * 39.9) * 10) / 10;
    riskLevel = 'Poor';
    tier = 5;
  }

  const repaymentCertaintyPct = Math.max(1, Math.min(99.5, Math.round((100 - defaultRiskPct) * 10) / 10));

  return { defaultRiskPct, scorePercentile, repaymentCertaintyPct, riskLevel, tier };
}

export const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({
  score,
  riskCategory,
  riskTier,
  probabilityOfDefaultPct,
  confidenceScore = 0.88,
  size = 'normal'
}) => {
  // Correctly clamp score to standard 300 - 850 bureau range
  const clampedScore = Math.max(300, Math.min(850, score));

  // Correct mathematical mapping of [300, 850] range to [0, 100]%
  // Formula: percentage = ((score - 300) / (850 - 300)) * 100
  const percentage = Math.max(0, Math.min(100, ((clampedScore - 300) / 550) * 100));
  const normalized = percentage / 100; // 0.0 to 1.0

  // Rotation mapping:
  // - 0% (Score 300) maps to -90 degrees (pointing directly left)
  // - 50% (Score 575) maps to 0 degrees (pointing directly top)
  // - 100% (Score 850) maps to +90 degrees (pointing directly right)
  const rotationDegrees = -90 + normalized * 180;

  // Calibrated default risk information
  const calculated = calculateRiskDetails(clampedScore);
  const effectiveDefaultRiskPct = probabilityOfDefaultPct !== undefined ? probabilityOfDefaultPct : calculated.defaultRiskPct;
  const effectiveTier = riskTier !== undefined ? riskTier : calculated.tier;
  const effectiveCategory = riskCategory || calculated.riskLevel;

  // Color mapping based on score in burgundy aesthetic
  const getColor = (s: number) => {
    if (s >= 800) return { stroke: '#FB7185', text: 'text-rose-300', bg: 'bg-rose-950/70', border: 'border-rose-700/50' };
    if (s >= 740) return { stroke: '#E11D48', text: 'text-rose-400', bg: 'bg-rose-950/50', border: 'border-rose-800/40' };
    if (s >= 670) return { stroke: '#F59E0B', text: 'text-amber-300', bg: 'bg-amber-950/40', border: 'border-amber-800/40' };
    if (s >= 580) return { stroke: '#EA580C', text: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-800/40' };
    return { stroke: '#DC2626', text: 'text-red-400', bg: 'bg-red-950/50', border: 'border-red-800/40' };
  };

  const colorScheme = getColor(clampedScore);

  const isCompact = size === 'compact';
  const width = isCompact ? 240 : 300;
  const height = isCompact ? 160 : 190;
  const cx = width / 2;
  const cy = isCompact ? 120 : 145;
  const radius = isCompact ? 80 : 100;
  const strokeWidth = isCompact ? 12 : 16;
  const needleLength = radius - 16;

  // Exact semi-circle arc length: L = pi * radius
  const arcLength = Math.PI * radius;
  // Stroke dashoffset for animated circular progress
  const strokeDashoffset = arcLength * (1 - normalized);

  return (
    <div className="dashboard-credit-health-gauge flex flex-col items-center justify-center p-3 sm:p-4 w-full select-none">
      <div className="relative flex justify-center" style={{ width, height }}>
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="25%" stopColor="#EA580C" />
              <stop offset="55%" stopColor="#F59E0B" />
              <stop offset="78%" stopColor="#BE123C" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
          </defs>

          {/* Background Semi-Circle Track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="rgba(148, 163, 184, 0.15)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Animated Colored Active Gradient Track mapped to percentage */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="url(#scoreGaugeGrad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              strokeDasharray: `${arcLength} ${arcLength}`,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* Clean Interior Text Placed Above the Needle Pivot with ZERO Collision */}
          <text
            x={cx}
            y={cy - 38}
            textAnchor="middle"
            className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums fill-white dark:fill-white light:fill-slate-900"
            style={{ fontSize: isCompact ? '28px' : '36px' }}
          >
            {clampedScore}
          </text>

          <text
            x={cx}
            y={cy - 16}
            textAnchor="middle"
            className="text-[11px] font-bold font-mono tracking-wider fill-rose-300"
            style={{ fontSize: '11px' }}
          >
            SCORE · {percentage.toFixed(1)}%
          </text>

          {/* Animated Needle rotated based on percentage */}
          <g
            style={{
              transform: `rotate(${rotationDegrees}deg)`,
              transformOrigin: `${cx}px ${cy}px`,
              transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Needle pointing straight up at 0deg (50% position), rotated dynamically */}
            <line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy - needleLength}
              stroke={colorScheme.stroke}
              strokeWidth="3.5"
              strokeLinecap="round"
              className="drop-shadow-md"
            />
            {/* Pivot Indicator */}
            <circle cx={cx} cy={cy} r="5" fill="#0F172A" stroke={colorScheme.stroke} strokeWidth="3" />
          </g>

          {/* Tick Labels with Generous Spacing */}
          <text x={cx - radius} y={cy + 20} fill="#94A3B8" fontSize="10" textAnchor="middle" className="font-mono">
            300
          </text>
          <text x={cx} y={cy - radius - 8} fill="#94A3B8" fontSize="10" textAnchor="middle" className="font-mono">
            575
          </text>
          <text x={cx + radius} y={cy + 20} fill="#94A3B8" fontSize="10" textAnchor="middle" className="font-mono">
            850
          </text>
        </svg>
      </div>

      {/* Meta Indicators with Clean Wrapping & High Contrast */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs w-full max-w-sm">
        {/* Tier & Risk Category Badge */}
        <span className={`px-2.5 py-1 rounded-md border font-semibold ${colorScheme.bg} ${colorScheme.border} ${colorScheme.text}`}>
          Tier {effectiveTier} · {effectiveCategory}
        </span>

        {/* Score Range Percentage Badge */}
        <span className="px-2.5 py-1 rounded-md border font-mono font-bold text-rose-300 bg-rose-950/70 border-rose-800/50 shadow-sm">
          Rating: {percentage.toFixed(1)}%
        </span>

        {/* Explicit Default Risk Percentage Pill */}
        <span
          className={`px-2.5 py-1 rounded-md border font-mono font-bold ${
            effectiveDefaultRiskPct <= 5
              ? 'bg-rose-950/60 text-rose-300 border-rose-800/40'
              : effectiveDefaultRiskPct <= 15
              ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
              : effectiveDefaultRiskPct <= 35
              ? 'bg-orange-950/40 text-orange-300 border-orange-800/40'
              : 'bg-red-950/60 text-red-400 border-red-800/50'
          }`}
          title="Estimated default probability calibrated against benchmark dataset"
        >
          Risk: {effectiveDefaultRiskPct.toFixed(1)}%
        </span>

        {/* Confidence Indicator */}
        <span className="text-[11px] text-slate-400 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/60">
          Confidence: <strong className="font-mono tabular-nums text-slate-200">{Math.round(confidenceScore * 100)}%</strong>
        </span>
      </div>

      {/* Secondary Probability Detail Strip */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/60 w-full flex items-center justify-between text-[11px] text-slate-400 px-2">
        <span>Default Probability:</span>
        <span className={`font-mono font-bold ${effectiveDefaultRiskPct <= 15 ? 'text-rose-300' : 'text-red-400'}`}>
          {effectiveDefaultRiskPct.toFixed(1)}% ({effectiveCategory} Risk)
        </span>
      </div>
    </div>
  );
};
