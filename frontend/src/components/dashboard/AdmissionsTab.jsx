import React from 'react';
import { Eye } from 'lucide-react';

const AdmissionsTab = ({ admissions, handleOpenAdmModal }) => {
  return (
    <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase font-semibold">
          <tr>
            <th className="p-4">Candidate</th>
            <th className="p-4">Class</th>
            <th className="p-4">Score</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-850">
          {(!admissions || admissions.length === 0) ? (
            <tr><td colSpan="5" className="p-6 text-center text-slate-500">No applications registered.</td></tr>
          ) : (
            admissions.map((app) => (
              <tr key={app._id} className="hover:bg-slate-900/20 transition-all">
                <td className="p-4">
                  <div className="font-bold text-slate-200">{app.firstName} {app.lastName}</div>
                  <div className="text-[10px] text-slate-500">{app.parentEmail}</div>
                </td>
                <td className="p-4 text-slate-300 font-medium">{app.appliedClass}</td>
                <td className="p-4 text-slate-300 font-medium">
                  {app.marksPercentage !== undefined && app.marksPercentage !== null ? `${app.marksPercentage}%` : 'N/A'}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    app.status === 'Submitted' ? 'bg-blue-950 text-blue-400 border border-blue-900/50' :
                    app.status === 'Under Review' ? 'bg-amber-950 text-amber-400 border border-amber-900/50' :
                    app.status === 'Approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50' :
                    app.status === 'Rejected' ? 'bg-rose-950 text-rose-400 border border-rose-900/50' :
                    'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleOpenAdmModal(app)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 font-semibold text-slate-300 transition-all text-[11px] inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Review
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdmissionsTab;
