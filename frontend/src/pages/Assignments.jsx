import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, FileText, Calendar, Award, Plus, User, 
  Clock, CheckCircle, AlertCircle, X, Send, Eye, Edit3
} from 'lucide-react';
import API from '../services/api';

const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state for Teachers / Admins
  const [selectedClass, setSelectedClass] = useState('Class 11 Science');

  // Student Submit Modal state
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitText, setSubmitText] = useState('');
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Teacher Create Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subject: '',
    className: 'Class 11 Science',
    dueDate: '',
    maxMarks: 100,
    attachmentUrl: ''
  });

  // Submissions Viewer state
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmissionForGrading, setSelectedSubmissionForGrading] = useState(null);
  
  // Grading form state
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  const getActiveChild = () => {
    if (user?.role !== 'Parent' || !user?.profile?.children) return null;
    const activeChildId = localStorage.getItem('activeChildId');
    return user.profile.children.find(child => (child._id || child) === activeChildId) || user.profile.children[0];
  };

  const classOptions = [
    'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11 Science', 'Class 11 Commerce', 'Class 11 Arts',
    'Class 12 Science', 'Class 12 Commerce', 'Class 12 Arts'
  ];

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      if (user.role === 'Student') {
        const { data } = await API.get('/assignments/my-class');
        setAssignments(data.data || []);
      } else if (user.role === 'Parent') {
        const activeChildId = localStorage.getItem('activeChildId') || user.profile?.children?.[0]?._id || user.profile?.children?.[0];
        const { data } = await API.get(`/assignments/my-class?studentId=${activeChildId || ''}`);
        setAssignments(data.data || []);
      } else {
        const { data } = await API.get(`/assignments/my-class?class=${selectedClass}`);
        setAssignments(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching assignments:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [selectedClass]);

  // Handle student submit
  const handleOpenSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmitText(assignment.submission?.submissionText || '');
    setSubmitUrl(assignment.submission?.submissionUrl || '');
    setShowSubmitModal(true);
  };

  const handleHomeworkSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/assignments/submit/${selectedAssignment._id}`, {
        submissionText: submitText,
        submissionUrl: submitUrl
      });
      alert('Homework submitted successfully!');
      setShowSubmitModal(false);
      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting homework');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle teacher create
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await API.post('/assignments', newAssignment);
      alert('Assignment published successfully!');
      setShowCreateModal(false);
      setNewAssignment({
        title: '',
        description: '',
        subject: '',
        className: selectedClass,
        dueDate: '',
        maxMarks: 100,
        attachmentUrl: ''
      });
      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating assignment');
    }
  };

  // Handle view submissions
  const handleOpenSubmissionsModal = async (assignment) => {
    setActiveAssignment(assignment);
    setShowSubmissionsModal(true);
    try {
      const { data } = await API.get(`/assignments/submissions/${assignment._id}`);
      setSubmissions(data.data || []);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Handle open grading sub-form
  const handleOpenGradingForm = (sub) => {
    setSelectedSubmissionForGrading(sub);
    setGradeScore(sub.score?.toString() || '');
    setGradeFeedback(sub.feedback || '');
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/assignments/grade/${selectedSubmissionForGrading._id}`, {
        score: Number(gradeScore),
        feedback: gradeFeedback
      });
      alert('Submission graded successfully!');
      
      // Refresh submissions
      const { data } = await API.get(`/assignments/submissions/${activeAssignment._id}`);
      setSubmissions(data.data || []);
      
      setSelectedSubmissionForGrading(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error grading submission');
    }
  };

  const isTeacherOrAdmin = user.role === 'Teacher' || user.role === 'Admin';

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-gold-400" /> Homework & Assignments
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {isTeacherOrAdmin ? 'Publish homework criteria and grade student submissions.' : 'Track class assignments, submit responses, and view marks.'}
          </p>
        </div>

        {isTeacherOrAdmin ? (
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none"
            >
              {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={() => {
                setNewAssignment({ ...newAssignment, className: selectedClass });
                setShowCreateModal(true);
              }}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-xs text-white transition-all whitespace-nowrap shadow-md shadow-brand-500/10"
            >
              <Plus className="w-4 h-4" /> Create Homework
            </button>
          </div>
        ) : (
          <div className="bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-400 font-semibold">
            Class Standard: <span className="text-gold-400">
              {user.role === 'Parent' ? (getActiveChild()?.currentClass || 'N/A') : (user.profile?.currentClass || 'N/A')}
            </span>
          </div>
        )}
      </div>

      {/* Main List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="relative w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : assignments.length === 0 ? (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="font-bold text-slate-300 text-sm">No homework assignments found</h4>
          <p className="text-xs text-slate-500">
            {isTeacherOrAdmin ? `Publish the first assignment for ${selectedClass}.` : 'Hooray! No assignments pending in your class standard.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {assignments.map((asm) => {
            const hasSubmitted = !!asm.submission;
            const status = asm.submission?.status || 'Pending';
            
            return (
              <div key={asm._id} className="glass-panel p-6 rounded-2xl border border-slate-850 flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-950/40 text-brand-400 border border-brand-900/30 uppercase tracking-wide">
                      {asm.subject}
                    </span>

                    {!isTeacherOrAdmin && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        status === 'Graded' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' :
                        status === 'Submitted' ? 'bg-blue-950 text-blue-400 border border-blue-900/30' :
                        'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        {status}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-200 font-sans">{asm.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed truncate-3-lines">{asm.description}</p>
                </div>

                <div className="border-t border-slate-900 pt-3 space-y-2.5 text-xs text-slate-400">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-[10px] text-slate-500"><Calendar className="w-3.5 h-3.5" /> Due Date:</span>
                    <span className="font-semibold text-slate-300">{new Date(asm.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-[10px] text-slate-500"><Award className="w-3.5 h-3.5" /> Max Marks:</span>
                    <span className="font-semibold text-slate-300">{asm.maxMarks} Points</span>
                  </div>
                  {asm.attachmentUrl && (
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Resource:</span>
                      <a href={asm.attachmentUrl} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">📄 Material Link</a>
                    </div>
                  )}

                  {/* Graded Details for Students */}
                  {status === 'Graded' && (
                    <div className="bg-emerald-950/10 border border-emerald-900/30 p-3 rounded-xl space-y-1.5">
                      <div className="flex justify-between font-bold text-emerald-400">
                        <span>Score Obtained:</span>
                        <span>{asm.submission?.score} / {asm.maxMarks}</span>
                      </div>
                      {asm.submission?.feedback && (
                        <p className="text-[10px] text-slate-400 italic">"Feedback: {asm.submission.feedback}"</p>
                      )}
                    </div>
                  )}

                  {/* Button Actions */}
                  {isTeacherOrAdmin ? (
                    <button
                      onClick={() => handleOpenSubmissionsModal(asm)}
                      className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-800 text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Submissions
                    </button>
                  ) : (
                    status !== 'Graded' && (
                      <button
                        onClick={() => handleOpenSubmitModal(asm)}
                        className="w-full mt-2 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" /> {hasSubmitted ? 'Resubmit Homework' : 'Submit Homework'}
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODALS */}
      {/* ============================================================ */}

      {/* 1. STUDENT SUBMIT MODAL */}
      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 p-6 space-y-6 text-left relative">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200 font-sans">Submit Homework Response</h3>
                <p className="text-xs text-slate-500">{selectedAssignment.title} • {selectedAssignment.subject}</p>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-200 font-extrabold text-sm">✕</button>
            </div>

            <form onSubmit={handleHomeworkSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Homework Text Response (Optional)</label>
                <textarea
                  value={submitText}
                  onChange={(e) => setSubmitText(e.target.value)}
                  placeholder="Type notes or text answers here..."
                  rows="5"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none resize-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Upload Link (Cloudinary / File Link)</label>
                <input
                  type="text"
                  value={submitUrl}
                  onChange={(e) => setSubmitUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/.../homework.pdf"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 block mt-1">If submitting PDF reports or images, upload to Cloudinary and paste link.</span>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all"
                >
                  {submitting ? 'Submitting...' : 'Upload Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. TEACHER CREATE ASSIGNMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 p-6 space-y-6 text-left relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200 font-sans">Publish New Homework</h3>
                <p className="text-xs text-slate-500">Create target homework task sheet for {newAssignment.className}</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-200 font-extrabold text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Homework Title</label>
                <input
                  type="text"
                  required
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="e.g. Chapter 4 Thermodynamics Exercise"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description / Guidelines</label>
                <textarea
                  required
                  rows="4"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Write assignment instructions or question sheets..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    placeholder="e.g. Physics"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Max Score</label>
                  <input
                    type="number"
                    required
                    value={newAssignment.maxMarks}
                    onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Resource Link (Optional)</label>
                  <input
                    type="text"
                    value={newAssignment.attachmentUrl}
                    onChange={(e) => setNewAssignment({ ...newAssignment, attachmentUrl: e.target.value })}
                    placeholder="https://res.cloudinary.com/.../sheet.pdf"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all">
                  Publish Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. TEACHER SUBMISSIONS VIEWER MODAL */}
      {showSubmissionsModal && activeAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-4xl rounded-3xl border border-slate-800 p-6 space-y-6 text-left relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200 font-sans">Homework Submissions Feed</h3>
                <p className="text-xs text-slate-500">{activeAssignment.title} • Max Marks: {activeAssignment.maxMarks}</p>
              </div>
              <button onClick={() => setShowSubmissionsModal(false)} className="text-slate-400 hover:text-slate-200 font-extrabold text-sm">✕</button>
            </div>

            <div className="grid md:grid-cols-12 gap-6 items-start">
              {/* Submissions list */}
              <div className="md:col-span-7 space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {submissions.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-6">No submissions received yet for this task.</p>
                ) : (
                  submissions.map((sub) => (
                    <div
                      key={sub._id}
                      onClick={() => handleOpenGradingForm(sub)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                        selectedSubmissionForGrading?._id === sub._id 
                          ? 'bg-brand-950/20 border-brand-500/50' 
                          : 'bg-slate-900/40 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-200">{sub.student?.firstName} {sub.student?.lastName}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          sub.status === 'Graded' ? 'bg-emerald-950 text-emerald-400' : 'bg-blue-950 text-blue-400'
                        }`}>{sub.status}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Submitted at: {new Date(sub.submittedAt).toLocaleString()}</p>
                      {sub.score !== undefined && (
                        <p className="text-slate-300 font-semibold">Graded: <strong className="text-gold-400">{sub.score} / {activeAssignment.maxMarks}</strong></p>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Grading panel */}
              <div className="md:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-slate-200 text-xs font-sans border-b border-slate-850 pb-2 flex items-center gap-1">
                  <Edit3 className="w-4 h-4 text-gold-400" /> Grading Dashboard
                </h4>

                {selectedSubmissionForGrading ? (
                  <form onSubmit={handleGradeSubmission} className="space-y-4 text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold mb-1">Student: <span className="text-slate-200 font-bold">{selectedSubmissionForGrading.student?.firstName} {selectedSubmissionForGrading.student?.lastName}</span></p>
                      {selectedSubmissionForGrading.submissionText && (
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 mt-2 max-h-[120px] overflow-y-auto text-slate-300 italic whitespace-pre-wrap leading-relaxed">
                          "{selectedSubmissionForGrading.submissionText}"
                        </div>
                      )}
                      {selectedSubmissionForGrading.submissionUrl && (
                        <a href={selectedSubmissionForGrading.submissionUrl} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline block mt-2 font-semibold">
                          📄 Download/View Student File Link
                        </a>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Score Obtained (Max: {activeAssignment.maxMarks})</label>
                      <input
                        type="number"
                        required
                        min="0"
                        max={activeAssignment.maxMarks}
                        value={gradeScore}
                        onChange={(e) => setGradeScore(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Evaluation Feedback</label>
                      <textarea
                        value={gradeFeedback}
                        onChange={(e) => setGradeFeedback(e.target.value)}
                        placeholder="Well done. Excellent presentation."
                        rows="3"
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none resize-none font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-500/10"
                    >
                      Save Score
                    </button>
                  </form>
                ) : (
                  <p className="text-slate-500 text-xs text-center py-8">Select a student submission from the feed list to evaluate and grade.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Assignments;
