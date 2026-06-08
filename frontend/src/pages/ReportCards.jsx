import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Printer, Sparkles } from 'lucide-react';
import API from '../services/api';

const ReportCards = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const activeChildId = localStorage.getItem('activeChildId');
        const studentId = user.role === 'Parent'
          ? (activeChildId || user.profile?.children?.[0]?._id || user.profile?.children?.[0])
          : user.profile?._id;
        if (studentId) {
          const { data } = await API.get(`/portal/results/${studentId}`);
          setResults(data);
        }
      } catch (error) {
        console.error('Error fetching results:', error.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchResults();
    }
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-100 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-gold-400" /> Academic Report Cards
          </h2>
          <p className="text-slate-400 text-xs mt-1">Access term-wise grades, marks distribution lists, and cumulative ranks.</p>
        </div>
        {results.length > 0 && (
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all text-xs font-semibold text-slate-300"
          >
            <Printer className="w-3.5 h-3.5 text-gold-400" /> Print Cards
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="relative w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-3">
          <ClipboardList className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="font-bold text-slate-300 text-sm">No results available yet</h4>
          <p className="text-xs text-slate-500">Academic term results are currently being compiled by the class teacher.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {results.map((result) => (
            <div key={result._id} className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl print:border-none print:shadow-none">
              
              {/* Header card info */}
              <div className="bg-slate-900/50 p-6 border-b border-slate-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider bg-gold-950/20 px-2.5 py-0.5 rounded border border-gold-500/20">
                    {result.term} Examination
                  </span>
                  <h3 className="text-lg font-bold text-slate-200 font-sans mt-2">{result.academicYear} Academic Session</h3>
                  <p className="text-xs text-slate-500">Student Profile class: <strong>{result.class}</strong></p>
                </div>
                <div className="text-left sm:text-right space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Percentage:</span>
                  <span className="block text-2xl font-extrabold text-slate-100">{result.totalPercentage}%</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    result.overallGrade === 'Pass' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-red-950/40 text-red-400 border border-red-900/30'
                  }`}>{result.overallGrade}</span>
                </div>
              </div>

              {/* Subject details table */}
              <div className="p-6">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 font-bold border-b border-slate-800 pb-2">
                    <tr>
                      <th className="pb-3">Subject Name</th>
                      <th className="pb-3">Theory (Obtained/Max)</th>
                      <th className="pb-3">Practical (Obtained/Max)</th>
                      <th className="pb-3">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {result.subjects.map((sub, sIdx) => (
                      <tr key={sIdx} className="text-slate-300">
                        <td className="py-3.5 font-semibold text-slate-200">{sub.subjectName}</td>
                        <td className="py-3.5">{sub.theoryMarks} / {sub.maxMarks}</td>
                        <td className="py-3.5">{sub.practicalMarks !== undefined ? `${sub.practicalMarks} / 30` : 'N/A'}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            ['A1', 'A2', 'B1'].includes(sub.grade) ? 'bg-emerald-950/20 text-emerald-400' :
                            ['B2', 'C1', 'C2'].includes(sub.grade) ? 'bg-amber-950/20 text-amber-400' :
                            'bg-red-950/20 text-red-400'
                          }`}>{sub.grade || 'N/A'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {result.remarks && (
                  <div className="mt-6 p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 text-xs flex gap-2 items-start text-slate-400">
                    <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-300 block">Class Teacher Remarks:</span>
                      <p className="mt-1 leading-normal italic">"{result.remarks}"</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ReportCards;
