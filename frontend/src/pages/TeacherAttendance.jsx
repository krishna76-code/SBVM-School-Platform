import React, { useState } from 'react';
import { UserCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import API from '../services/api';

const TeacherAttendance = () => {
  const [className, setClassName] = useState('Class 11 Science');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // studentId: 'Present'/'Absent'
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const loadRoster = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/portal/students/class/${className}`);
      setStudents(data);
      
      // Initialize all to Present by default
      const initial = {};
      data.forEach(student => {
        initial[student._id] = 'Present';
      });
      setAttendanceRecords(initial);
    } catch (error) {
      console.error('Error fetching class roster:', error.message);
      alert('Error fetching class roster. Verify class name matches database.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (studentId, status) => {
    setAttendanceRecords({
      ...attendanceRecords,
      [studentId]: status
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (students.length === 0) return;

    const formattedRecords = Object.keys(attendanceRecords).map(key => ({
      studentId: key,
      status: attendanceRecords[key]
    }));

    try {
      await API.post('/portal/attendance/log', {
        className,
        date,
        records: formattedRecords
      });
      alert('Attendance logged successfully!');
    } catch (error) {
      console.error('Attendance log error:', error.message);
      alert('Error saving attendance records.');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-100 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-gold-400" /> Class Attendance Registry
        </h2>
        <p className="text-slate-400 text-xs mt-1">Select standard class roster, set term date, and log daily status.</p>
      </div>

      {/* Roster configuration form */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-wrap gap-4 items-end text-xs">
        <div>
          <label className="block text-slate-400 font-semibold mb-1">Standard Class Room</label>
          <input 
            type="text" 
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="e.g. Class 11 Science"
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 w-48"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Log Date</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 w-40"
          />
        </div>

        <button
          onClick={loadRoster}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all font-semibold text-slate-300"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Fetch Class Roster
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="relative w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : students.length > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">Roll</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-900/20 transition-all">
                    <td className="p-4 font-bold text-slate-400">{student.rollNumber || 'N/A'}</td>
                    <td className="p-4 font-semibold text-slate-200">{student.firstName} {student.lastName}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggle(student._id, 'Present')}
                          className={`px-3 py-1 rounded-lg font-bold text-[10px] transition-all border ${
                            attendanceRecords[student._id] === 'Present'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-900/50'
                              : 'bg-slate-900 text-slate-500 border-slate-850'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(student._id, 'Absent')}
                          className={`px-3 py-1 rounded-lg font-bold text-[10px] transition-all border ${
                            attendanceRecords[student._id] === 'Absent'
                              ? 'bg-red-950 text-red-400 border-red-900/50'
                              : 'bg-slate-900 text-slate-500 border-slate-850'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-sm text-white transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Save Attendance Ledger
          </button>
        </form>
      ) : (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-slate-500 text-xs">
          Enter standard class name above (e.g. "Class 11 Science") and fetch roster.
        </div>
      )}

    </div>
  );
};

export default TeacherAttendance;
