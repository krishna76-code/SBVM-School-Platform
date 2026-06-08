import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import API from '../services/api';

const Attendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const activeChildId = localStorage.getItem('activeChildId');
        const studentId = user.role === 'Parent'
          ? (activeChildId || user.profile?.children?.[0]?._id || user.profile?.children?.[0])
          : user.profile?._id;
        if (studentId) {
          const { data } = await API.get(`/portal/attendance/${studentId}`);
          setAttendance(data);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchAttendance();
    }
  }, [user]);

  // Compute metrics
  const totalDays = attendance.length;
  const presentDays = attendance.filter(r => r.status === 'Present').length;
  const absentDays = attendance.filter(r => r.status === 'Absent').length;
  const lateDays = attendance.filter(r => r.status === 'Late').length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-100 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-gold-400" /> Attendance Ledger
        </h2>
        <p className="text-slate-400 text-xs mt-1">Review student daily class presence records and compliance ratios.</p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="relative w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-12 gap-6 items-start">
          
          {/* Main stats block */}
          <div className="md:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Overall Attendance</span>
                <span className={`block text-4xl font-extrabold ${
                  attendancePercentage >= 75 ? 'text-emerald-400' : 'text-amber-500'
                }`}>{attendancePercentage}%</span>
                <span className="text-[10px] text-slate-500">Min. CBSE requirement: 75%</span>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Present Days</span>
                  <span className="font-bold text-slate-200">{presentDays}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><XCircle className="w-4 h-4 text-red-400" /> Absent Days</span>
                  <span className="font-bold text-slate-200">{absentDays}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-amber-400" /> Late Marks</span>
                  <span className="font-bold text-slate-200">{lateDays}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Records grid logs */}
          <div className="md:col-span-8 glass-panel border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50">
              <h4 className="font-bold text-slate-200 text-xs font-sans">Chronological Attendance Logs</h4>
            </div>

            <div className="divide-y divide-slate-800/40 max-h-[400px] overflow-y-auto">
              {attendance.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">No daily attendance logs submitted for this academic term.</div>
              ) : (
                [...attendance].reverse().map((record, rIdx) => (
                  <div key={rIdx} className="flex justify-between items-center p-4 text-xs">
                    <span className="text-slate-300 font-semibold">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      record.status === 'Present' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' :
                      record.status === 'Absent' ? 'bg-red-950/20 text-red-400 border border-red-900/30' :
                      'bg-amber-950/20 text-amber-400 border border-amber-900/30' // Late / Excused
                    }`}>{record.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Attendance;
