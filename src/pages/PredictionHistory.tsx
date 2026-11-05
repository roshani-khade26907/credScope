import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetchHistory, apiDeleteHistoryItem } from '../api';
import { StoredAssessment } from '../types';
import {
  History,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  X,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const PredictionHistory: React.FC = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<StoredAssessment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedItem, setSelectedItem] = useState<StoredAssessment | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const loadData = () => {
    apiFetchHistory(user.id, filterType).then(setAssessments);
  };

  useEffect(() => {
    loadData();
  }, [user.id, filterType]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this assessment from your private history?')) return;
    setIsDeleting(id);
    await apiDeleteHistoryItem(id, user.id);
    setAssessments(prev => prev.filter(a => a.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
    setIsDeleting(null);
  };

  const filteredAssessments = assessments.filter(item => {
    const term = searchTerm.toLowerCase();
    const typeMatch = item.assessmentType.toLowerCase().includes(term);
    const riskMatch = (item.riskCategory || '').toLowerCase().includes(term);
    const loanMatch = (item.loanType || '').toLowerCase().includes(term);
    return typeMatch || riskMatch || loanMatch;
  });

  // Export to CSV
  const exportCSV = () => {
    if (filteredAssessments.length === 0) return;
    const headers = ['ID', 'Date', 'Type', 'LoanType', 'ScoreOrStatus', 'RiskCategory'];
    const rows = filteredAssessments.map(a => [
      a.id,
      new Date(a.createdAt).toISOString(),
      a.assessmentType,
      a.loanType || 'N/A',
      `"${a.scoreOrStatus}"`,
      a.riskCategory
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `crediscope_assessments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportJSON = () => {
    if (filteredAssessments.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredAssessments, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `crediscope_assessments_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Audit Ledger</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Prediction History &amp; Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Encrypted private history associated with {user.email}. Export or drill down into prior evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-rose-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportJSON}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
          >
            <FileJson className="w-3.5 h-3.5 text-rose-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by risk, loan type..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs self-stretch sm:self-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Evaluations' },
            { id: 'credit_score', label: 'Credit Scores' },
            { id: 'loan_eligibility', label: 'Loan Eligibility' },
            { id: 'simulation', label: 'Simulations' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                filterType === tab.id
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono text-[10px]">
            <tr>
              <th className="py-3 px-4">Date &amp; Time</th>
              <th className="py-3 px-4">Assessment Type</th>
              <th className="py-3 px-4">Result / Status</th>
              <th className="py-3 px-4">Risk Classification</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredAssessments.length > 0 ? (
              filteredAssessments.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200 capitalize">
                    {item.assessmentType.replace('_', ' ')}
                    {item.loanType ? ` · ${item.loanType}` : ''}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-400">
                    {item.scoreOrStatus}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {item.riskCategory}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Inspect Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting === item.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-xs text-slate-500">
                  No prediction records match your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drill-down Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white capitalize">
                  {selectedItem.assessmentType.replace('_', ' ')} Details
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Recorded: {new Date(selectedItem.createdAt).toLocaleString()} · ID: {selectedItem.id}
                </p>
              </div>
            </div>

            {/* Core Outcome Summary */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Estimated Model Output</div>
                <div className="text-xl font-bold font-mono text-rose-400">{selectedItem.scoreOrStatus}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Classification</div>
                <div className="text-sm font-semibold text-slate-200">{selectedItem.riskCategory}</div>
              </div>
            </div>

            {/* Input Attributes */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Input Summary Profile</h4>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {Object.entries(selectedItem.inputSummary).map(([key, val]) => {
                  if (typeof val === 'object') return null;
                  return (
                    <div key={key}>
                      <span className="text-[10px] text-slate-500 uppercase">{key}: </span>
                      <strong className="text-slate-200 font-mono">{String(val)}</strong>
                    </div>
                  );
                })}
              </div>

              {/* Prediction Results JSON inspect */}
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-4">Calculated Metadata</h4>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-200/90 overflow-x-auto">
                {JSON.stringify(selectedItem.predictionResult, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
