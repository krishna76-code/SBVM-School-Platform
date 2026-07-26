import React from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';

const ResultsTab = ({
  results,
  resultSearch,
  setResultSearch,
  resultClass,
  setResultClass,
  resultTerm,
  setResultTerm,
  classOptions,
  handleResultSearch,
  handleDeleteResult,
  setShowResultModal
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/20 p-4 rounded-2xl border border-slate-850">
        <form onSubmit={handleResultSearch} className="flex gap-2 w-full sm:w-auto flex-wrap">
          <input
            type="text"
            placeholder="Student Name..."
            value={resultSearch}
            onChange={(e) => setResultSearch(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none w-full sm:w-48"
          />
          <select
            value={resultClass}
            onChange={(e) => setResultClass(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none"
          >
            <option value="">All Classes</option>
            {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={resultTerm}
            onChange={(e) => setResultTerm(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none"
          >
            <option value="">All Terms</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Half-Yearly">Half-Yearly</option>
            <option value="Annual">Annual</option>
          </select>
          <button type="submit" className="p-2 bg-brand-650 hover:bg-brand-600 rounded-xl text-white">
            <Search className="w-4 h-4" />
          </button>
        </form>
        <button
          onClick={() => setShowResultModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-bold text-white transition-all w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Publish Grades
        </button>
      </div>

      {/* Results Table */}
      <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Class</th>
              <th className="p-4">Term</th>
              <th className="p-4">Percentage</th>
              <th className="p-4 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {(!results || results.length === 0) ? (
              <tr><td colSpan="5" className="p-6 text-center text-slate-500">No report cards logged.</td></tr>
            ) : (
              results.map((r) => (
                <tr key={r._id} className="hover:bg-slate-900/20 transition-all text-slate-300">
                  <td className="p-4 font-bold text-slate-200">
                    {r.student?.firstName} {r.student?.lastName}
                    <div className="text-[10px] text-slate-500 font-normal">Roll Num: {r.student?.rollNumber || 'N/A'}</div>
                  </td>
                  <td className="p-4 font-semibold">{r.class}</td>
                  <td className="p-4 font-medium">{r.term} ({r.academicYear})</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.overallGrade === 'Pass' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' : 'bg-rose-950 text-rose-400 border border-rose-900/30'
                    }`}>
                      {r.totalPercentage}% • {r.overallGrade}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteResult(r._id)}
                      className="p-1.5 rounded bg-rose-950/30 border border-rose-900/40 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTab;
