import React from 'react';
import { ShieldCheck, Info, BookOpen } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Compliance & Regulatory Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-10 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="p-2 rounded-lg bg-rose-950/60 text-rose-400 shrink-0 border border-rose-900/30">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-rose-300">Important Regulatory &amp; Decision-Support Notice:</span> CrediScope AI is an academic machine learning prototype and financial education tool. The calculated scores (300–850) and eligibility classifications are model estimates based on the German Credit and Give Me Some Credit datasets. They do not constitute official FICO®, VantageScore®, or bureau credit reports, nor do they represent legally binding credit offers or guaranteed lender underwriting approvals.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-bold text-white">CrediScope AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent, explainable machine-learning intelligence for consumer credit assessment, debt risk diagnostics, and retail loan eligibility analysis.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>Model v2.1</span>
              <span>·</span>
              <span>Dual Dataset Benchmark</span>
              <span>·</span>
              <span>XAI Enabled</span>
            </div>
          </div>

          {/* Col 2: Platform Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTab('landing')} className="hover:text-rose-400 transition-colors">
                  Platform Overview
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('dashboard')} className="hover:text-rose-400 transition-colors">
                  Personal Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('score')} className="hover:text-rose-400 transition-colors">
                  Credit Score Predictor
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('loans')} className="hover:text-rose-400 transition-colors">
                  Loan Eligibility Engine
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('simulator')} className="hover:text-rose-400 transition-colors">
                  What-If Scenario Simulator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Methodological Foundation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Methodology Citation</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>Classification Methodology Reference:</span>
              </div>
              <p className="text-[11px] italic text-slate-400 leading-normal">
                Priyanka Shahane and Deipali Gore (2018). "A Survey on Classification Techniques to Determine Fake vs. Real Identities on Social Media Platforms."
              </p>
              <p className="text-[10px] text-slate-500">
                Note: The paper's supervised classification comparison framework was adapted for financial risk modeling. Original paper results concern identity classification.
              </p>
            </div>
          </div>

          {/* Col 4: Benchmark Datasets & Privacy */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Datasets & Governance</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>· German Credit Dataset (Statlog / UCI)</li>
              <li>· Give Me Some Credit (GMSC / Kaggle)</li>
              <li>· No Protected Demographic Attributes Used</li>
              <li>· Client-Authorized History Isolation</li>
              <li>· Explainable SHAP Attribution Architecture</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} CrediScope AI. Academic Decision Support Prototype.
          </div>
          <div className="flex items-center gap-4">
            <span>Non-Depository Prototype</span>
            <span>·</span>
            <span>WCAG AA Accessible</span>
            <span>·</span>
            <span>Pure Client-Server Inference</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
