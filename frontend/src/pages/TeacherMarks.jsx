import React, { useState } from 'react';
import { ClipboardList, Plus, Save, RefreshCw } from 'lucide-react';
import API from '../services/api';

const TeacherMarks = () => {
  const [className, setClassName] = useState('Class 11 Science');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form States for Marks entry
  const [term, setTerm] = useState('Half-Yearly');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [remarks, setRemarks] = useState('');
  
  // Marks mapping
  const [physicsTheory, setPhysicsTheory] = useState('');
  const [physicsPractical, setPhysicsPractical] = useState('');
  
  const [chemistryTheory, setChemistryTheory] = useState('');
  const [chemistryPractical, setChemistryPractical] = useState('');
  
  const [mathsTheory, setMathsTheory] = useState('');
  const [englishTheory, setEnglishTheory] = useState('');

  const loadRoster = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/portal/students/class/${className}`);
      setStudents(data);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error fetching class roster:', error.message);
      alert('Error fetching class roster.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMarksForm = (student) => {
    setSelectedStudent(student);
    setRemarks('');
    setPhysicsTheory('');
    setPhysicsPractical('');
    setChemistryTheory('');
    setChemistryPractical('');
    setMathsTheory('');
    setEnglishTheory('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const subjects = [
      { subjectName: 'Physics', theoryMarks: Number(physicsTheory), practicalMarks: Number(physicsPractical), maxMarks: 100 },
      { subjectName: 'Chemistry', theoryMarks: Number(chemistryTheory), practicalMarks: Number(chemistryPractical), maxMarks: 100 },
      { subjectName: 'Mathematics', theoryMarks: Number(mathsTheory), practicalMarks: 0, maxMarks: 100 },
      { subjectName: 'English', theoryMarks: Number(englishTheory), practicalMarks: 0, maxMarks: 100 }
    ];

    try {
      await API.post('/portal/results/upload', {
        studentId: selectedStudent._id,
        term,
        academicYear,
        subjects,
        remarks
      });
      alert('Student exam marks published successfully!');
      setSelectedStudent(null);
    } catch (error) {
      console.error('Publish results error:', error.message);
      alert('Error publishing marks records.');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-100 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-gold-400" /> Gradebook Marks Submissions
        </h2>
        <p className="text-slate-400 text-xs mt-1">Select standard class roster, set term limits, and input marks cards.</p>
      </div>

      {/* Roster configuration */}
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
        <div className="grid md:grid-cols-12 gap-6 items-start">
          
          {/* Roster list */}
          <div className="md:col-span-6 glass-panel border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">Roll</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-900/20 transition-all">
                    <td className="p-4 font-bold text-slate-400">{student.rollNumber || 'N/A'}</td>
                    <td className="p-4 font-semibold text-slate-200">{student.firstName} {student.lastName}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenMarksForm(student)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 font-semibold text-slate-300 transition-all text-[11px] inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Marks
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Marks input form */}
          <div className="md:col-span-6">
            {selectedStudent ? (
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-slate-200 font-sans text-sm">{selectedStudent.firstName} {selectedStudent.lastName}</h4>
                  <span className="text-[10px] text-slate-500">Roll: {selectedStudent.rollNumber} • Class: {selectedStudent.currentClass}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Select Term</label>
                      <select
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                      >
                        <option value="Quarterly">Quarterly</option>
                        <option value="Half-Yearly">Half-Yearly</option>
                        <option value="Annual">Annual Exam</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Academic Year</label>
                      <input
                        type="text"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-4 space-y-3">
                    <span className="font-bold text-slate-400 block pb-1 border-b border-slate-850">Subject Grades (Max: 100)</span>
                    
                    {/* Physics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">Physics Theory</label>
                        <input
                          type="number"
                          value={physicsTheory}
                          onChange={(e) => setPhysicsTheory(e.target.value)}
                          placeholder="Max: 70"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">Physics Practical</label>
                        <input
                          type="number"
                          value={physicsPractical}
                          onChange={(e) => setPhysicsPractical(e.target.value)}
                          placeholder="Max: 30"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Chemistry */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">Chemistry Theory</label>
                        <input
                          type="number"
                          value={chemistryTheory}
                          onChange={(e) => setChemistryTheory(e.target.value)}
                          placeholder="Max: 70"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">Chemistry Practical</label>
                        <input
                          type="number"
                          value={chemistryPractical}
                          onChange={(e) => setChemistryPractical(e.target.value)}
                          placeholder="Max: 30"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Maths & English */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">Mathematics Score</label>
                        <input
                          type="number"
                          value={mathsTheory}
                          onChange={(e) => setMathsTheory(e.target.value)}
                          placeholder="Max: 100"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">English Score</label>
                        <input
                          type="number"
                          value={englishTheory}
                          onChange={(e) => setEnglishTheory(e.target.value)}
                          placeholder="Max: 100"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Teacher Remarks</label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Excellent progress in sciences, keep it up."
                      rows="2"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-sm text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Publish Student Report
                  </button>
                </form>
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-slate-500 text-xs">
                Select a student from the roster list to enter their grades.
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-slate-500 text-xs">
          Enter class name (e.g. "Class 11 Science") and fetch roster to get started.
        </div>
      )}

    </div>
  );
};

export default TeacherMarks;
