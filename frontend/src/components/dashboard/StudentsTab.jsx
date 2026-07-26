import React from 'react';
import { Search } from 'lucide-react';

const StudentsTab = ({
  students,
  studentSearch,
  setStudentSearch,
  studentClass,
  setStudentClass,
  studentPage,
  studentPages,
  setStudentPage,
  classOptions,
  handleStudentSearch,
  setSelectedStudentDetail
}) => {
  return (
    <div className="space-y-4 font-sans">
      <form onSubmit={handleStudentSearch} className="flex gap-2 w-full sm:w-auto bg-slate-900/20 p-4 rounded-2xl border border-slate-850">
        <input
          type="text"
          placeholder="Search Student Name / Adm No..."
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none w-full sm:w-64"
        />
        <select
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none"
        >
          <option value="">All Classes</option>
          {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" className="p-2 bg-brand-650 hover:bg-brand-600 rounded-xl text-white">
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Students Directory Table */}
      <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="p-4">Student Name</th>
              <th className="p-4">Admission Number</th>
              <th className="p-4">Class</th>
              <th className="p-4">Parent Reference</th>
              <th className="p-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {(!students || students.length === 0) ? (
              <tr><td colSpan="5" className="p-6 text-center text-slate-500">No student files registered.</td></tr>
            ) : (
              students.map((s) => (
                <tr key={s._id} className="hover:bg-slate-900/20 transition-all text-slate-300">
                  <td className="p-4 font-bold text-slate-200">
                    {s.firstName} {s.lastName}
                    <div className="text-[10px] text-slate-500 font-normal">Roll No: {s.rollNumber || 'N/A'}</div>
                  </td>
                  <td className="p-4 font-mono text-slate-400 font-semibold">{s.admissionNumber || 'Pending'}</td>
                  <td className="p-4 font-medium">{s.currentClass} (Sec {s.section})</td>
                  <td className="p-4">
                    <div className="font-medium">{s.parent?.fatherName || 'N/A'}</div>
                    <div className="text-[10px] text-slate-500">Phone: {s.parent?.emergencyContact || 'N/A'}</div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedStudentDetail(s)}
                      className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 font-semibold text-[10px]"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Student Pagination */}
      {studentPages > 1 && (
        <div className="flex justify-between items-center px-2 py-2">
          <button
            disabled={studentPage === 1}
            onClick={() => setStudentPage(studentPage - 1)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 text-slate-400 disabled:opacity-40 text-xs font-semibold"
          >
            Previous
          </button>
          <span className="text-slate-400 text-xs">Page {studentPage} of {studentPages}</span>
          <button
            disabled={studentPage === studentPages}
            onClick={() => setStudentPage(studentPage + 1)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 text-slate-400 disabled:opacity-40 text-xs font-semibold"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentsTab;
