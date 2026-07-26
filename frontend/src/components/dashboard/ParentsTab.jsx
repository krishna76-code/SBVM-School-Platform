import React from 'react';
import { Search } from 'lucide-react';

const ParentsTab = ({
  parents,
  parentSearch,
  setParentSearch,
  parentPage,
  parentPages,
  setParentPage,
  handleParentSearch,
  setSelectedParentDetail
}) => {
  return (
    <div className="space-y-4 font-sans">
      <form onSubmit={handleParentSearch} className="flex gap-2 w-full sm:w-auto bg-slate-900/20 p-4 rounded-2xl border border-slate-850">
        <input
          type="text"
          placeholder="Search Father/Mother Name or Contact..."
          value={parentSearch}
          onChange={(e) => setParentSearch(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none w-full sm:w-64"
        />
        <button type="submit" className="p-2 bg-brand-650 hover:bg-brand-600 rounded-xl text-white">
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Parents Directory Table */}
      <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="p-4">Father Name</th>
              <th className="p-4">Mother Name</th>
              <th className="p-4">Contact Phone</th>
              <th className="p-4">Email Credentials</th>
              <th className="p-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {(!parents || parents.length === 0) ? (
              <tr><td colSpan="5" className="p-6 text-center text-slate-500">No parent profiles registered.</td></tr>
            ) : (
              parents.map((p) => (
                <tr key={p._id} className="hover:bg-slate-900/20 transition-all text-slate-300">
                  <td className="p-4 font-bold text-slate-200">{p.fatherName}</td>
                  <td className="p-4 font-medium">{p.motherName}</td>
                  <td className="p-4 text-slate-300 font-semibold">{p.emergencyContact}</td>
                  <td className="p-4 font-medium text-slate-400">{p.user?.email || 'N/A'}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedParentDetail(p)}
                      className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 font-semibold text-[10px]"
                    >
                      Children ({p.children?.length || 0})
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Parent Pagination */}
      {parentPages > 1 && (
        <div className="flex justify-between items-center px-2 py-2">
          <button
            disabled={parentPage === 1}
            onClick={() => setParentPage(parentPage - 1)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 text-slate-400 disabled:opacity-40 text-xs font-semibold"
          >
            Previous
          </button>
          <span className="text-slate-400 text-xs">Page {parentPage} of {parentPages}</span>
          <button
            disabled={parentPage === parentPages}
            onClick={() => setParentPage(parentPage + 1)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 text-slate-400 disabled:opacity-40 text-xs font-semibold"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ParentsTab;
