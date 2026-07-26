import React from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';

const NoticesTab = ({
  notices,
  noticeSearch,
  setNoticeSearch,
  noticeCategory,
  setNoticeCategory,
  noticePage,
  noticePages,
  setNoticePage,
  handleNoticeSearch,
  handleDeleteNotice,
  setShowNoticeModal
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/20 p-4 rounded-2xl border border-slate-850">
        <form onSubmit={handleNoticeSearch} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search notices..."
            value={noticeSearch}
            onChange={(e) => setNoticeSearch(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none w-full sm:w-64"
          />
          <select
            value={noticeCategory}
            onChange={(e) => setNoticeCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Event">Event</option>
            <option value="Exam">Exam</option>
            <option value="Admission">Admission</option>
            <option value="General">General</option>
          </select>
          <button type="submit" className="p-2 bg-brand-650 hover:bg-brand-600 rounded-xl text-white">
            <Search className="w-4 h-4" />
          </button>
        </form>
        <button
          onClick={() => setShowNoticeModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-bold text-white transition-all w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Create Notice
        </button>
      </div>

      {/* Notices Data Table */}
      <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Audience</th>
              <th className="p-4">Published By</th>
              <th className="p-4 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {(!notices || notices.length === 0) ? (
              <tr><td colSpan="5" className="p-6 text-center text-slate-500">No notices matches filters.</td></tr>
            ) : (
              notices.map((n) => (
                <tr key={n._id} className="hover:bg-slate-900/20 transition-all text-slate-300">
                  <td className="p-4 font-bold text-slate-200">
                    <div>{n.title}</div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5 truncate max-w-sm">{n.content}</div>
                  </td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950/60 text-purple-300 border border-purple-900/40">{n.category}</span></td>
                  <td className="p-4 font-medium">{n.targetAudience?.join(', ') || 'All'}</td>
                  <td className="p-4 text-slate-400 font-medium">{n.publishedBy?.email || 'System'}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteNotice(n._id)}
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

      {/* Pagination Controls */}
      {noticePages > 1 && (
        <div className="flex justify-between items-center px-2 py-2">
          <button
            disabled={noticePage === 1}
            onClick={() => setNoticePage(noticePage - 1)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 text-slate-400 disabled:opacity-40 text-xs font-semibold"
          >
            Previous
          </button>
          <span className="text-slate-400 text-xs">Page {noticePage} of {noticePages}</span>
          <button
            disabled={noticePage === noticePages}
            onClick={() => setNoticePage(noticePage + 1)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 text-slate-400 disabled:opacity-40 text-xs font-semibold"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NoticesTab;
