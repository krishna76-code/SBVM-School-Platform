import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, Eye, RefreshCw, Calendar, Award, Users, 
  Bell, ClipboardList, Search, Filter, Plus, Trash2, FileText, X, AlertCircle,
  Image as ImageIcon, Sparkles, Camera
} from 'lucide-react';
import API from '../services/api';

import OverviewTab from '../components/dashboard/OverviewTab';
import AdmissionsTab from '../components/dashboard/AdmissionsTab';
import NoticesTab from '../components/dashboard/NoticesTab';
import ResultsTab from '../components/dashboard/ResultsTab';
import StudentsTab from '../components/dashboard/StudentsTab';
import ParentsTab from '../components/dashboard/ParentsTab';
import ScholarshipsTab from '../components/dashboard/ScholarshipsTab';
import GalleryTab from '../components/dashboard/GalleryTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // ==================== OVERVIEW STATE ====================
  const [overviewStats, setOverviewStats] = useState({
    totalApplications: 0,
    totalStudents: 0,
    pendingApplications: 0,
    recentActivity: []
  });

  // ==================== ADMISSIONS STATE ====================
  const [admissions, setAdmissions] = useState([]);
  const [selectedAdm, setSelectedAdm] = useState(null);
  const [admStatus, setAdmStatus] = useState('Submitted');
  const [admNotes, setAdmNotes] = useState('');
  const [admConcession, setAdmConcession] = useState('0');
  const [showAdmModal, setShowAdmModal] = useState(false);

  // ==================== NOTICES STATE ====================
  const [notices, setNotices] = useState([]);
  const [noticeSearch, setNoticeSearch] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('');
  const [noticePage, setNoticePage] = useState(1);
  const [noticePages, setNoticePages] = useState(1);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'General',
    targetAudience: 'All',
    targetClass: ''
  });

  // ==================== RESULTS STATE ====================
  const [results, setResults] = useState([]);
  const [resultSearch, setResultSearch] = useState('');
  const [resultClass, setResultClass] = useState('');
  const [resultTerm, setResultTerm] = useState('');
  const [resultPage, setResultPage] = useState(1);
  const [resultPages, setResultPages] = useState(1);
  const [showResultModal, setShowResultModal] = useState(false);
  
  // Create Result Form States
  const [classStudents, setClassStudents] = useState([]);
  const [uploadClass, setUploadClass] = useState('Class 11 Science');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [uploadTerm, setUploadTerm] = useState('Quarterly');
  const [uploadYear, setUploadYear] = useState('2026-27');
  const [uploadRemarks, setUploadRemarks] = useState('');
  const [uploadSubjects, setUploadSubjects] = useState([
    { subjectName: 'Physics', theoryMarks: 70, practicalMarks: 25, maxMarks: 100 },
    { subjectName: 'Chemistry', theoryMarks: 70, practicalMarks: 25, maxMarks: 100 },
    { subjectName: 'Mathematics', theoryMarks: 80, practicalMarks: 0, maxMarks: 100 },
    { subjectName: 'English', theoryMarks: 80, practicalMarks: 0, maxMarks: 100 }
  ]);

  // ==================== STUDENTS STATE ====================
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [studentPage, setStudentPage] = useState(1);
  const [studentPages, setStudentPages] = useState(1);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);

  // ==================== PARENTS STATE ====================
  const [parents, setParents] = useState([]);
  const [parentSearch, setParentSearch] = useState('');
  const [parentPage, setParentPage] = useState(1);
  const [parentPages, setParentPages] = useState(1);
  const [selectedParentDetail, setSelectedParentDetail] = useState(null);

  // ==================== SCHOLARSHIPS STATE ====================
  const [scholarshipRules, setScholarshipRules] = useState([]);
  const [editingRule, setEditingRule] = useState(null);
  const [savingRule, setSavingRule] = useState(false);

  // ==================== GALLERY STATE ====================
  const [galleryItems, setGalleryItems] = useState([]);
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('');
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [newGallery, setNewGallery] = useState({ title: '', category: 'General', tags: '', caption: '' });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [publishingGallery, setPublishingGallery] = useState(false);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/gallery?category=${galleryCategory}`);
      let items = data.data || [];
      if (gallerySearch) {
        items = items.filter(item => 
          item.title.toLowerCase().includes(gallerySearch.toLowerCase()) || 
          item.caption?.toLowerCase().includes(gallerySearch.toLowerCase()) ||
          item.tags?.some(t => t.toLowerCase().includes(gallerySearch.toLowerCase()))
        );
      }
      setGalleryItems(items);
    } catch (err) {
      console.error('Error fetching gallery:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCaption = async () => {
    if (!newGallery.tags) {
      alert('Please enter some tags (e.g. Annual Day, Dance, Stage) first.');
      return;
    }
    setGeneratingCaption(true);
    try {
      const { data } = await API.post('/gallery/generate-caption', {
        title: newGallery.title,
        category: newGallery.category,
        tags: newGallery.tags
      });
      setNewGallery(prev => ({ ...prev, caption: data.caption }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating caption.');
    } finally {
      setGeneratingCaption(false);
    }
  };

  const handleCreateGalleryItem = async (e) => {
    e.preventDefault();
    if (!selectedImageFile) {
      alert('Please select an image file to upload.');
      return;
    }
    setPublishingGallery(true);
    const form = new FormData();
    form.append('image', selectedImageFile);
    form.append('title', newGallery.title);
    form.append('category', newGallery.category);
    form.append('caption', newGallery.caption);
    const tagsArray = newGallery.tags.split(',').map(t => t.trim()).filter(Boolean);
    form.append('tags', JSON.stringify(tagsArray));

    try {
      await API.post('/gallery', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Image added to campus gallery successfully!');
      setShowGalleryModal(false);
      setNewGallery({ title: '', category: 'General', tags: '', caption: '' });
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      fetchGalleryItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading gallery item.');
    } finally {
      setPublishingGallery(false);
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery item permanently?')) return;
    try {
      await API.delete(`/gallery/${id}`);
      alert('Gallery item deleted.');
      fetchGalleryItems();
    } catch (err) {
      alert('Error deleting gallery item.');
    }
  };

  const handleGallerySearch = (e) => {
    e.preventDefault();
    fetchGalleryItems();
  };

  const fetchScholarshipRules = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/scholarships');
      setScholarshipRules(data.data || []);
    } catch (err) {
      console.error('Error fetching scholarship rules:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRule = async (e) => {
    e.preventDefault();
    setSavingRule(true);
    try {
      await API.put(`/scholarships/${editingRule._id}`, {
        boardTiers: editingRule.boardTiers,
        entranceTiers: editingRule.entranceTiers,
        sportsNationalConcession: editingRule.sportsNationalConcession,
        sportsStateConcession: editingRule.sportsStateConcession,
        incomeBelow25kConcession: editingRule.incomeBelow25kConcession,
        incomeBelow50kConcession: editingRule.incomeBelow50kConcession,
        maxTotalConcession: editingRule.maxTotalConcession,
        eligiblePrograms: editingRule.eligiblePrograms
      });
      alert('Scholarship rules configuration saved successfully!');
      setEditingRule(null);
      fetchScholarshipRules();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving rules');
    } finally {
      setSavingRule(false);
    }
  };

  // ==================== REUSABLE CLASS OPTIONS ====================
  const classOptions = [
    'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11 Science', 'Class 11 Commerce', 'Class 11 Arts',
    'Class 12 Science', 'Class 12 Commerce', 'Class 12 Arts'
  ];

  // ==================== FETCH ACTIONS ====================

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/portal/admin/stats');
      setOverviewStats(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admissions/applications');
      setAdmissions(data.data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/portal/admin/notices?page=${noticePage}&search=${noticeSearch}&category=${noticeCategory}`);
      setNotices(data.notices || []);
      setNoticePages(data.pages || 1);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/portal/admin/results?page=${resultPage}&search=${resultSearch}&class=${resultClass}&term=${resultTerm}`);
      setResults(data.results || []);
      setResultPages(data.pages || 1);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/portal/admin/students?page=${studentPage}&search=${studentSearch}&class=${studentClass}`);
      setStudents(data.students || []);
      setStudentPages(data.pages || 1);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchParents = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/portal/admin/parents?page=${parentPage}&search=${parentSearch}`);
      setParents(data.parents || []);
      setParentPages(data.pages || 1);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch depending on active tab
  useEffect(() => {
    if (activeTab === 'overview') fetchOverview();
    if (activeTab === 'admissions') fetchAdmissions();
    if (activeTab === 'notices') fetchNotices();
    if (activeTab === 'results') fetchResults();
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'parents') fetchParents();
    if (activeTab === 'scholarships') fetchScholarshipRules();
    if (activeTab === 'gallery') fetchGalleryItems();
  }, [activeTab, noticePage, resultPage, studentPage, parentPage, galleryCategory]);

  // Handle searches on enter / click
  const handleNoticeSearch = (e) => { e.preventDefault(); setNoticePage(1); fetchNotices(); };
  const handleResultSearch = (e) => { e.preventDefault(); setResultPage(1); fetchResults(); };
  const handleStudentSearch = (e) => { e.preventDefault(); setStudentPage(1); fetchStudents(); };
  const handleParentSearch = (e) => { e.preventDefault(); setParentPage(1); fetchParents(); };

  // ==================== SUBMODULE ACTIONS ====================

  // ADMISSIONS ACTION
  const handleOpenAdmModal = (app) => {
    setSelectedAdm(app);
    setAdmStatus(app.status);
    setAdmNotes(app.adminNotes || '');
    setAdmConcession(app.feeConcessionPercentage?.toString() || '0');
    setShowAdmModal(true);
  };

  const handleUpdateAdmStatus = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/admissions/applications/${selectedAdm._id}/status`, {
        status: admStatus,
        adminNotes: admNotes,
        feeConcessionPercentage: Number(admConcession)
      });
      alert('Candidate record updated successfully!');
      setShowAdmModal(false);
      fetchAdmissions();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  // NOTICES ACTION
  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newNotice,
        targetAudience: newNotice.targetAudience === 'All' ? ['All'] : [newNotice.targetAudience]
      };
      await API.post('/portal/notices', payload);
      alert('Notice published successfully!');
      setShowNoticeModal(false);
      setNewNotice({ title: '', content: '', category: 'General', targetAudience: 'All', targetClass: '' });
      fetchNotices();
    } catch (err) {
      alert('Error creating notice');
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await API.delete(`/portal/admin/notices/${id}`);
      alert('Notice deleted.');
      fetchNotices();
    } catch (err) {
      alert('Error deleting notice.');
    }
  };

  // RESULTS ACTIONS: Dynamic Student Loading by Class
  useEffect(() => {
    const fetchStudentsForUpload = async () => {
      if (!uploadClass) return;
      try {
        const { data } = await API.get(`/portal/students/class/${uploadClass}`);
        setClassStudents(data);
        if (data.length > 0) setSelectedStudent(data[0]._id);
        else setSelectedStudent('');
      } catch (err) {
        console.error('Error fetching class students:', err.message);
      }
    };
    if (showResultModal) {
      fetchStudentsForUpload();
    }
  }, [uploadClass, showResultModal]);

  const handleSubjectMarkChange = (index, field, value) => {
    const updated = [...uploadSubjects];
    updated[index][field] = field === 'subjectName' ? value : Number(value);
    setUploadSubjects(updated);
  };

  const handleAddSubjectField = () => {
    setUploadSubjects([...uploadSubjects, { subjectName: '', theoryMarks: 0, practicalMarks: 0, maxMarks: 100 }]);
  };

  const handleUploadResult = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('Please select a student.');
      return;
    }
    try {
      const payload = {
        studentId: selectedStudent,
        term: uploadTerm,
        academicYear: uploadYear,
        subjects: uploadSubjects,
        remarks: uploadRemarks
      };
      await API.post('/portal/results/upload', payload);
      alert('Student grades uploaded successfully!');
      setShowResultModal(false);
      setUploadRemarks('');
      fetchResults();
    } catch (err) {
      alert('Error uploading results.');
    }
  };

  const handleDeleteResult = async (id) => {
    if (!window.confirm('Delete this result record permanently?')) return;
    try {
      await API.delete(`/portal/admin/results/${id}`);
      alert('Result record deleted.');
      fetchResults();
    } catch (err) {
      alert('Error deleting result.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-gold-400 animate-pulse" /> Admin Console
          </h2>
          <p className="text-slate-400 text-xs mt-1">Saraswati Bal Vidya Mandir Management, Audits & Directory Services</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800/80 scrollbar-none">
        {[
          { id: 'overview', name: 'Overview', icon: Calendar },
          { id: 'admissions', name: 'Admissions', icon: ShieldCheck },
          { id: 'notices', name: 'Notices', icon: Bell },
          { id: 'results', name: 'Results', icon: ClipboardList },
          { id: 'students', name: 'Students', icon: Users },
          { id: 'parents', name: 'Parents', icon: Users },
          { id: 'scholarships', name: 'Scholarships', icon: Award },
          { id: 'gallery', name: 'Gallery', icon: ImageIcon }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT RENDERING */}
      {activeTab === 'overview' && <OverviewTab overviewStats={overviewStats} />}
      {activeTab === 'admissions' && <AdmissionsTab admissions={admissions} handleOpenAdmModal={handleOpenAdmModal} />}
      {activeTab === 'notices' && (
        <NoticesTab
          notices={notices}
          noticeSearch={noticeSearch}
          setNoticeSearch={setNoticeSearch}
          noticeCategory={noticeCategory}
          setNoticeCategory={setNoticeCategory}
          noticePage={noticePage}
          noticePages={noticePages}
          setNoticePage={setNoticePage}
          handleNoticeSearch={handleNoticeSearch}
          handleDeleteNotice={handleDeleteNotice}
          setShowNoticeModal={setShowNoticeModal}
        />
      )}
      {activeTab === 'results' && (
        <ResultsTab
          results={results}
          resultSearch={resultSearch}
          setResultSearch={setResultSearch}
          resultClass={resultClass}
          setResultClass={setResultClass}
          resultTerm={resultTerm}
          setResultTerm={setResultTerm}
          classOptions={classOptions}
          handleResultSearch={handleResultSearch}
          handleDeleteResult={handleDeleteResult}
          setShowResultModal={setShowResultModal}
        />
      )}
      {activeTab === 'students' && (
        <StudentsTab
          students={students}
          studentSearch={studentSearch}
          setStudentSearch={setStudentSearch}
          studentClass={studentClass}
          setStudentClass={setStudentClass}
          studentPage={studentPage}
          studentPages={studentPages}
          setStudentPage={setStudentPage}
          classOptions={classOptions}
          handleStudentSearch={handleStudentSearch}
          setSelectedStudentDetail={setSelectedStudentDetail}
        />
      )}
      {activeTab === 'parents' && (
        <ParentsTab
          parents={parents}
          parentSearch={parentSearch}
          setParentSearch={setParentSearch}
          parentPage={parentPage}
          parentPages={parentPages}
          setParentPage={setParentPage}
          handleParentSearch={handleParentSearch}
          setSelectedParentDetail={setSelectedParentDetail}
        />
      )}
      {activeTab === 'scholarships' && (
        <ScholarshipsTab
          scholarshipRules={scholarshipRules}
          editingRule={editingRule}
          setEditingRule={setEditingRule}
          savingRule={savingRule}
          classOptions={classOptions}
          handleSaveRule={handleSaveRule}
        />
      )}
      {activeTab === 'gallery' && (
        <GalleryTab
          galleryItems={galleryItems}
          gallerySearch={gallerySearch}
          setGallerySearch={setGallerySearch}
          galleryCategory={galleryCategory}
          setGalleryCategory={setGalleryCategory}
          handleGallerySearch={handleGallerySearch}
          handleDeleteGalleryItem={handleDeleteGalleryItem}
          setShowGalleryModal={setShowGalleryModal}
          setNewGallery={setNewGallery}
          setSelectedImageFile={setSelectedImageFile}
          setImagePreviewUrl={setImagePreviewUrl}
        />
      )}

      {/* ============================================================ */}
      {/* MODALS DEFINITION */}
      {/* ============================================================ */}

      {/* A. ADMISSIONS REVIEW MODAL */}
      {showAdmModal && selectedAdm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl rounded-3xl border border-slate-800 p-6 space-y-6 text-left relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200 font-sans">{selectedAdm.firstName} {selectedAdm.lastName}</h3>
                <p className="text-xs text-slate-500">Class applied: <strong>{selectedAdm.appliedClass}</strong></p>
              </div>
              <button onClick={() => setShowAdmModal(false)} className="text-slate-400 hover:text-slate-200 font-extrabold text-sm">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Guardian Details:</span>
                <span className="text-slate-300 font-bold block">{selectedAdm.parentName}</span>
                <span className="text-[10px] text-slate-400">{selectedAdm.parentPhone} • {selectedAdm.parentEmail}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Previous Record:</span>
                <span className="text-slate-300 font-bold block">{selectedAdm.previousSchool || 'N/A'}</span>
                <span className="text-[10px] text-slate-400">
                  {selectedAdm.previousClass ? `Class ${selectedAdm.previousClass}` : 'No Prior Class'} • {selectedAdm.marksPercentage !== undefined && selectedAdm.marksPercentage !== null ? `${selectedAdm.marksPercentage}%` : 'N/A'}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="text-slate-500 font-bold block pb-1 border-b border-slate-800/80">Uploaded Document Scanning:</span>
              <div className="flex flex-wrap gap-4 pt-1">
                {selectedAdm.documents?.studentPhotoUrl ? (
                  <a href={selectedAdm.documents.studentPhotoUrl} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline flex items-center gap-1">📷 Student Photo</a>
                ) : (
                  <span className="text-slate-600">📷 Photo Missing</span>
                )}
                {selectedAdm.documents?.aadhaarUrl ? (
                  <a href={selectedAdm.documents.aadhaarUrl} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline flex items-center gap-1">📄 Aadhaar Copy</a>
                ) : (
                  <span className="text-slate-600">📄 Aadhaar Missing</span>
                )}
                {selectedAdm.documents?.marksheetUrl ? (
                  <a href={selectedAdm.documents.marksheetUrl} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline flex items-center gap-1">📄 Marksheet / Cert</a>
                ) : (
                  <span className="text-slate-600">📄 Marksheet Missing</span>
                )}
              </div>
            </div>

            <form onSubmit={handleUpdateAdmStatus} className="space-y-4 border-t border-slate-800 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Update Status</label>
                  <select
                    value={admStatus}
                    onChange={(e) => setAdmStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="Submitted">Submitted (Reviewing)</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved (Approve & Seed Accounts)</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Scholarship Concession (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="75"
                    value={admConcession}
                    onChange={(e) => setAdmConcession(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Registrar Remarks</label>
                <textarea
                  value={admNotes}
                  onChange={(e) => setAdmNotes(e.target.value)}
                  placeholder="Decision rationales or interview details."
                  rows="3"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdmModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all">
                  Update Applicant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. PUBLISH NOTICE MODAL */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 p-6 space-y-6 text-left relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200 font-sans">Publish Notice Circular</h3>
                <p className="text-xs text-slate-500">Target announcements to parent, teacher, or student boards.</p>
              </div>
              <button onClick={() => setShowNoticeModal(false)} className="text-slate-400 hover:text-slate-200 font-extrabold text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. Summer Vacation Holidays Announcement"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Announcement Details</label>
                <textarea
                  required
                  rows="4"
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Write clear bulletin updates here..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Event">Event</option>
                    <option value="Exam">Exam</option>
                    <option value="Admission">Admission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Target Audience</label>
                  <select
                    value={newNotice.targetAudience}
                    onChange={(e) => setNewNotice({ ...newNotice, targetAudience: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="All">All Audiences</option>
                    <option value="Student">Students Only</option>
                    <option value="Parent">Parents Only</option>
                    <option value="Teacher">Teachers Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Class (Optional - for specific classes)</label>
                <select
                  value={newNotice.targetClass}
                  onChange={(e) => setNewNotice({ ...newNotice, targetClass: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="">All Classes</option>
                  {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all">
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. PUBLISH RESULTS MODAL */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-800 p-6 space-y-6 text-left relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200 font-sans">Publish Academic Grades</h3>
                <p className="text-xs text-slate-500">Record theory/practical term exam outcomes for a student.</p>
              </div>
              <button onClick={() => setShowResultModal(false)} className="text-slate-400 hover:text-slate-200 font-extrabold text-sm">✕</button>
            </div>

            <form onSubmit={handleUploadResult} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Select Class Standard</label>
                  <select
                    value={uploadClass}
                    onChange={(e) => setUploadClass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Select Student</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    {classStudents.length === 0 ? (
                      <option value="">No students in this class</option>
                    ) : (
                      classStudents.map(s => (
                        <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.rollNumber || 'No Roll'})</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Term</label>
                  <select
                    value={uploadTerm}
                    onChange={(e) => setUploadTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200"
                  >
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Academic Year</label>
                  <input
                    type="text"
                    required
                    value={uploadYear}
                    onChange={(e) => setUploadYear(e.target.value)}
                    placeholder="e.g. 2026-27"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Overall Remarks</label>
                  <input
                    type="text"
                    value={uploadRemarks}
                    onChange={(e) => setUploadRemarks(e.target.value)}
                    placeholder="e.g. Excellent progress."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              {/* Dynamic Subject Grades Editor */}
              <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-850">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200">Enter Subjects & Marks</span>
                  <button
                    type="button"
                    onClick={handleAddSubjectField}
                    className="px-2 py-1 bg-brand-950 text-brand-400 border border-brand-900 hover:bg-brand-900 rounded text-[10px] font-bold"
                  >
                    + Add Subject
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[160px] overflow-y-auto">
                  {uploadSubjects.map((sub, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2 text-xs items-center">
                      <input
                        type="text"
                        required
                        value={sub.subjectName}
                        onChange={(e) => handleSubjectMarkChange(idx, 'subjectName', e.target.value)}
                        placeholder="Subject Name"
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-slate-500">Th:</span>
                        <input
                          type="number"
                          required
                          min="0"
                          max={sub.maxMarks}
                          value={sub.theoryMarks}
                          onChange={(e) => handleSubjectMarkChange(idx, 'theoryMarks', e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs w-full"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-slate-500">Pr:</span>
                        <input
                          type="number"
                          min="0"
                          max={sub.maxMarks}
                          value={sub.practicalMarks}
                          onChange={(e) => handleSubjectMarkChange(idx, 'practicalMarks', e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs w-full"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-slate-500">Max:</span>
                        <input
                          type="number"
                          required
                          min="1"
                          value={sub.maxMarks}
                          onChange={(e) => handleSubjectMarkChange(idx, 'maxMarks', e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowResultModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={classStudents.length === 0}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all disabled:opacity-40"
                >
                  Publish Report Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. STUDENT PROFILE DETAIL MODAL */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 p-6 space-y-6 text-left relative">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200 font-sans">{selectedStudentDetail.firstName} {selectedStudentDetail.lastName}</h3>
                <p className="text-xs text-slate-500">Student File Dossier</p>
              </div>
              <button onClick={() => setSelectedStudentDetail(null)} className="text-slate-400 hover:text-slate-200 font-extrabold text-sm">✕</button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-semibold">Class Roster:</span>
                  <span className="font-bold text-slate-200">{selectedStudentDetail.currentClass} (Sec {selectedStudentDetail.section})</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-semibold">Admission / Roll No:</span>
                  <span className="font-bold text-slate-200">{selectedStudentDetail.admissionNumber} / Roll {selectedStudentDetail.rollNumber || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-semibold">Date of Birth:</span>
                  <span className="font-bold text-slate-200">{new Date(selectedStudentDetail.dob).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-semibold">Gender:</span>
                  <span className="font-bold text-slate-200">{selectedStudentDetail.gender}</span>
                </div>
              </div>

              <div className="border-t border-slate-850 pt-4">
                <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1">Linked Parent Directory Profile:</span>
                <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl">
                  <p className="font-bold text-slate-200">{selectedStudentDetail.parent?.fatherName || 'N/A'}</p>
                  <p className="text-[10px] text-slate-400">Emergency Phone: {selectedStudentDetail.parent?.emergencyContact || 'N/A'}</p>
                </div>
              </div>

              <div className="border-t border-slate-850 pt-4">
                <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-2">Recent Attendance Summary:</span>
                {selectedStudentDetail.attendanceRecords && selectedStudentDetail.attendanceRecords.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {selectedStudentDetail.attendanceRecords.slice(-10).map((r, index) => (
                      <span key={index} className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        r.status === 'Present' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' : 'bg-rose-950 text-rose-400 border border-rose-900/30'
                      }`}>
                        {new Date(r.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}: {r.status}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No attendance metrics recorded in active term.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E. PARENT PROFILE DETAIL MODAL */}
      {selectedParentDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 p-6 space-y-6 text-left relative">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200 font-sans">{selectedParentDetail.fatherName} & {selectedParentDetail.motherName}</h3>
                <p className="text-xs text-slate-500">Parent / Guardian Dossier</p>
              </div>
              <button onClick={() => setSelectedParentDetail(null)} className="text-slate-400 hover:text-slate-200 font-extrabold text-sm">✕</button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-semibold">Contact Email:</span>
                  <span className="font-bold text-slate-200 block truncate">{selectedParentDetail.user?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-semibold">Emergency Phone:</span>
                  <span className="font-bold text-slate-200 block">{selectedParentDetail.emergencyContact}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-2">Registered Children Roster:</span>
                <div className="space-y-2">
                  {selectedParentDetail.children && selectedParentDetail.children.length > 0 ? (
                    selectedParentDetail.children.map((child) => (
                      <div key={child._id} className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-200">{child.firstName} {child.lastName}</p>
                          <span className="text-[10px] text-slate-500">{child.currentClass}</span>
                        </div>
                        <span className="text-[10px] text-gold-400 font-semibold px-2 py-0.5 bg-gold-950/20 border border-gold-900/30 rounded">Student File Link</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No linked student files.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* F. GALLERY UPLOAD MODAL */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 p-6 space-y-6 text-left relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200 font-sans">Upload Campus Image</h3>
                <p className="text-xs text-slate-500">Publish high-quality photos with AI-generated captions.</p>
              </div>
              <button 
                onClick={() => {
                  setShowGalleryModal(false);
                  setSelectedImageFile(null);
                  setImagePreviewUrl('');
                }} 
                className="text-slate-400 hover:text-slate-250 font-extrabold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGalleryItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Image Title</label>
                <input
                  type="text"
                  required
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  placeholder="e.g. Annual Sports Meet 2026 Opening Ceremony"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={newGallery.category}
                    onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none font-semibold"
                  >
                    <option value="General">General</option>
                    <option value="Sports">Sports</option>
                    <option value="Academics">Academics</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Events">Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Metadata Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={newGallery.tags}
                    onChange={(e) => setNewGallery({ ...newGallery, tags: e.target.value })}
                    placeholder="e.g. Sports, Ceremony, Athletic Track"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Image upload area */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Select Event Photo</label>
                <div className="border border-slate-800 border-dashed rounded-xl bg-slate-950/20 p-4 flex flex-col items-center justify-center gap-3 relative hover:bg-slate-900/10 cursor-pointer min-h-[120px]">
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedImageFile(file);
                        setImagePreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {imagePreviewUrl ? (
                    <div className="flex items-center gap-4 w-full">
                      <img src={imagePreviewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-slate-800" />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 font-bold truncate">{selectedImageFile?.name}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{(selectedImageFile?.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-brand-400 opacity-40" />
                      <p className="text-[10px] text-slate-500 font-medium text-center">Drag and drop or click to select image (JPEG/PNG/WebP, max 5MB)</p>
                    </>
                  )}
                </div>
              </div>

              {/* AI Captioning Block */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-400">Description / Caption</label>
                  <button
                    type="button"
                    onClick={handleGenerateCaption}
                    disabled={generatingCaption}
                    className="text-[10px] bg-brand-950 text-brand-400 border border-brand-900 hover:bg-brand-900 disabled:opacity-40 px-2 py-1 rounded font-bold flex items-center gap-1 transition-all"
                  >
                    {generatingCaption ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-brand-400" /> Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" /> Generate Caption (AI)
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  value={newGallery.caption}
                  onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })}
                  placeholder="Provide details about the photo event, or click 'Generate Caption' to let AI write a premium description from tags."
                  rows="3"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowGalleryModal(false);
                    setSelectedImageFile(null);
                    setImagePreviewUrl('');
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={publishingGallery || !selectedImageFile}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all disabled:opacity-50"
                >
                  {publishingGallery ? 'Uploading to Cloudinary...' : 'Publish Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
