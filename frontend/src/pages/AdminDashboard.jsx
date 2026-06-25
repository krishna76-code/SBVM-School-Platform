import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, Eye, RefreshCw, Calendar, Award, Users, 
  Bell, ClipboardList, Search, Filter, Plus, Trash2, FileText, X, AlertCircle,
  Image as ImageIcon, Sparkles, Camera
} from 'lucide-react';
import API from '../services/api';

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

      {/* ============================================================ */}
      {/* 1. OVERVIEW TAB */}
      {/* ============================================================ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Dashboard Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400">Total Applications</span>
                <span className="p-1.5 bg-blue-950 text-blue-400 rounded-lg text-xs font-bold">Admissions</span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-100">{overviewStats.totalApplications}</h3>
              <p className="text-[10px] text-slate-500">Total candidates in system</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400">Enrolled Students</span>
                <span className="p-1.5 bg-emerald-950 text-emerald-400 rounded-lg text-xs font-bold">Roster</span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-100">{overviewStats.totalStudents}</h3>
              <p className="text-[10px] text-slate-500">Active permanent student files</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400">Pending Reviews</span>
                <span className="p-1.5 bg-amber-950 text-amber-400 rounded-lg text-xs font-bold animate-pulse">Action Required</span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-100">{overviewStats.pendingApplications}</h3>
              <p className="text-[10px] text-slate-500">Awaiting document verification</p>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-200 text-sm font-sans flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-gold-400 animate-spin" style={{ animationDuration: '6s' }} /> Recent Institutional Activity
            </h3>
            
            <div className="divide-y divide-slate-850">
              {overviewStats.recentActivity.length === 0 ? (
                <p className="text-slate-500 text-xs py-4 text-center">No recent activities logged.</p>
              ) : (
                overviewStats.recentActivity.map((act, index) => (
                  <div key={index} className="py-3.5 flex justify-between items-start gap-4 text-xs">
                    <div className="space-y-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        act.type === 'Admission' ? 'bg-blue-950 text-blue-400 border border-blue-900/30' :
                        act.type === 'Notice' ? 'bg-purple-950 text-purple-400 border border-purple-900/30' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-900/30'
                      }`}>
                        {act.type}
                      </span>
                      <p className="text-slate-300 mt-1 font-medium">{act.description}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 font-medium">{new Date(act.date).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. ADMISSIONS PIPELINE */}
      {/* ============================================================ */}
      {activeTab === 'admissions' && (
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
              {admissions.length === 0 ? (
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
                        'bg-slate-900 text-slate-400 border border-slate-800' // Draft
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
      )}

      {/* ============================================================ */}
      {/* 3. NOTICES MODULE */}
      {/* ============================================================ */}
      {activeTab === 'notices' && (
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
                {notices.length === 0 ? (
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
      )}

      {/* ============================================================ */}
      {/* 4. RESULTS MODULE */}
      {/* ============================================================ */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/20 p-4 rounded-2xl border border-slate-850">
            <form onSubmit={handleResultSearch} className="flex gap-2 w-full sm:w-auto flex-wrap">
              <input
                type="text"
                placeholder="Student Name..."
                value={resultSearch}
                onChange={(e) => setResultSearch(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none w-full sm:w-48"
              />
              <select
                value={resultClass}
                onChange={(e) => setResultClass(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none"
              >
                <option value="">All Classes</option>
                {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={resultTerm}
                onChange={(e) => setResultTerm(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none"
              >
                <option value="">All Terms</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half-Yearly">Half-Yearly</option>
                <option value="Annual">Annual</option>
              </select>
              <button type="submit" className="p-2 bg-brand-650 hover:bg-brand-600 rounded-xl text-white">
                <Search className="w-4 h-4" />
              </button>
            </form>
            <button
              onClick={() => setShowResultModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-bold text-white transition-all w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" /> Publish Grades
            </button>
          </div>

          {/* Results Table */}
          <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Term</th>
                  <th className="p-4">Percentage</th>
                  <th className="p-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {results.length === 0 ? (
                  <tr><td colSpan="5" className="p-6 text-center text-slate-500">No report cards logged.</td></tr>
                ) : (
                  results.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-900/20 transition-all text-slate-300">
                      <td className="p-4 font-bold text-slate-200">
                        {r.student?.firstName} {r.student?.lastName}
                        <div className="text-[10px] text-slate-500 font-normal">Roll Num: {r.student?.rollNumber || 'N/A'}</div>
                      </td>
                      <td className="p-4 font-semibold">{r.class}</td>
                      <td className="p-4 font-medium">{r.term} ({r.academicYear})</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.overallGrade === 'Pass' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' : 'bg-rose-950 text-rose-400 border border-rose-900/30'
                        }`}>
                          {r.totalPercentage}% • {r.overallGrade}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteResult(r._id)}
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

          {/* Results Pagination */}
          {resultPages > 1 && (
            <div className="flex justify-between items-center px-2 py-2">
              <button
                disabled={resultPage === 1}
                onClick={() => setResultPage(resultPage - 1)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 text-slate-400 disabled:opacity-40 text-xs font-semibold"
              >
                Previous
              </button>
              <span className="text-slate-400 text-xs">Page {resultPage} of {resultPages}</span>
              <button
                disabled={resultPage === resultPages}
                onClick={() => setResultPage(resultPage + 1)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 text-slate-400 disabled:opacity-40 text-xs font-semibold"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. STUDENTS DIRECTORY */}
      {/* ============================================================ */}
      {activeTab === 'students' && (
        <div className="space-y-4">
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
                {students.length === 0 ? (
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
      )}

      {/* ============================================================ */}
      {/* 6. PARENTS DIRECTORY */}
      {/* ============================================================ */}
      {activeTab === 'parents' && (
        <div className="space-y-4">
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
                {parents.length === 0 ? (
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
      )}

    {/* ============================================================ */}
    {/* 7. SCHOLARSHIPS RULES EDITOR */}
    {/* ============================================================ */}
    {activeTab === 'scholarships' && (
      <div className="space-y-6 font-sans">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-1.5 font-sans">
              <Award className="w-5 h-5 text-gold-400 animate-pulse" /> Scholarship Rules Panel
            </h3>
            <p className="text-slate-400 text-xs mt-1 font-normal">Configure merit score tiers, sports/need criteria, and eligible classes in real-time.</p>
          </div>
        </div>

        {editingRule ? (
          <form onSubmit={handleSaveRule} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 text-xs text-left">
            <div className="flex justify-between items-center border-b border-slate-850 pb-4">
              <h4 className="text-sm font-bold text-slate-200">Editing Rules for: <span className="text-gold-455 font-sans">{editingRule.classRange}</span></h4>
              <button type="button" onClick={() => setEditingRule(null)} className="text-slate-400 hover:text-slate-200 font-bold">✕ Close Editor</button>
            </div>

            {/* Tiers Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Board Tiers */}
              <div className="space-y-4">
                <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wide border-b border-slate-850 pb-1.5">Previous Board Marks Tiers</span>
                {editingRule.boardTiers.map((tier, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="text-[10px] text-slate-500 font-semibold w-16">Min Marks %:</span>
                    <input 
                      type="number" 
                      value={tier.minScore} 
                      onChange={(e) => {
                        const updated = [...editingRule.boardTiers];
                        updated[idx].minScore = Number(e.target.value);
                        setEditingRule({ ...editingRule, boardTiers: updated });
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 w-20 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 font-semibold">Waiver %:</span>
                    <input 
                      type="number" 
                      value={tier.concession} 
                      onChange={(e) => {
                        const updated = [...editingRule.boardTiers];
                        updated[idx].concession = Number(e.target.value);
                        setEditingRule({ ...editingRule, boardTiers: updated });
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 w-20 focus:outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        const updated = editingRule.boardTiers.filter((_, i) => i !== idx);
                        setEditingRule({ ...editingRule, boardTiers: updated });
                      }}
                      className="text-rose-400 hover:text-rose-300 font-semibold px-2 text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => {
                    const updated = [...editingRule.boardTiers, { minScore: 80, concession: 10 }];
                    setEditingRule({ ...editingRule, boardTiers: updated });
                  }}
                  className="text-brand-400 hover:text-brand-350 block font-bold text-[10px]"
                >
                  + Add Board Score Tier
                </button>
              </div>

              {/* Entrance Tiers */}
              <div className="space-y-4">
                <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wide border-b border-slate-850 pb-1.5">Entrance Test Tiers</span>
                {editingRule.entranceTiers.map((tier, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="text-[10px] text-slate-500 font-semibold w-16">Min Score %:</span>
                    <input 
                      type="number" 
                      value={tier.minScore} 
                      onChange={(e) => {
                        const updated = [...editingRule.entranceTiers];
                        updated[idx].minScore = Number(e.target.value);
                        setEditingRule({ ...editingRule, entranceTiers: updated });
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 w-20 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 font-semibold">Waiver %:</span>
                    <input 
                      type="number" 
                      value={tier.concession} 
                      onChange={(e) => {
                        const updated = [...editingRule.entranceTiers];
                        updated[idx].concession = Number(e.target.value);
                        setEditingRule({ ...editingRule, entranceTiers: updated });
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 w-20 focus:outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        const updated = editingRule.entranceTiers.filter((_, i) => i !== idx);
                        setEditingRule({ ...editingRule, entranceTiers: updated });
                      }}
                      className="text-rose-400 hover:text-rose-300 font-semibold px-2 text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => {
                    const updated = [...editingRule.entranceTiers, { minScore: 80, concession: 10 }];
                    setEditingRule({ ...editingRule, entranceTiers: updated });
                  }}
                  className="text-brand-400 hover:text-brand-350 block font-bold text-[10px]"
                >
                  + Add Entrance Score Tier
                </button>
              </div>
            </div>

            {/* Other Concessions */}
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-850">
              <div className="space-y-4">
                <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wide border-b border-slate-850 pb-1.5">Sports Achievement Concessions</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-medium mb-1">National Level Concession %</label>
                    <input 
                      type="number" 
                      value={editingRule.sportsNationalConcession} 
                      onChange={(e) => setEditingRule({ ...editingRule, sportsNationalConcession: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-medium mb-1">State Level Concession %</label>
                    <input 
                      type="number" 
                      value={editingRule.sportsStateConcession} 
                      onChange={(e) => setEditingRule({ ...editingRule, sportsStateConcession: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wide border-b border-slate-850 pb-1.5">Need-based & Caps</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-medium mb-1">Income &lt; 2.5L %</label>
                    <input 
                      type="number" 
                      value={editingRule.incomeBelow25kConcession} 
                      onChange={(e) => setEditingRule({ ...editingRule, incomeBelow25kConcession: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-medium mb-1">Income &lt; 5.0L %</label>
                    <input 
                      type="number" 
                      value={editingRule.incomeBelow50kConcession} 
                      onChange={(e) => setEditingRule({ ...editingRule, incomeBelow50kConcession: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-medium mb-1">Total Cap %</label>
                    <input 
                      type="number" 
                      value={editingRule.maxTotalConcession} 
                      onChange={(e) => setEditingRule({ ...editingRule, maxTotalConcession: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Eligible Classes */}
            <div className="space-y-3 pt-4 border-t border-slate-850">
              <span className="text-slate-400 font-bold block uppercase text-[10px] tracking-wide border-b border-slate-850 pb-1.5">Eligible Programs / Standard Options</span>
              <div className="flex flex-wrap gap-2.5 pt-1.5">
                {classOptions.map((c) => {
                  const isChecked = editingRule.eligiblePrograms.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        const updated = isChecked
                          ? editingRule.eligiblePrograms.filter(p => p !== c)
                          : [...editingRule.eligiblePrograms, c];
                        setEditingRule({ ...editingRule, eligiblePrograms: updated });
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        isChecked
                          ? 'bg-brand-950/40 border-brand-500 text-brand-400'
                          : 'bg-slate-900 border-slate-850 text-slate-450 hover:text-slate-350'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setEditingRule(null)}
                className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={savingRule}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all shadow-md shadow-brand-500/10"
              >
                {savingRule ? 'Saving Changes...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {scholarshipRules.map((rule) => (
              <div key={rule._id} className="glass-panel p-6 rounded-2xl border border-slate-850 space-y-4 text-xs flex flex-col justify-between hover:border-slate-800 transition-all">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-extrabold text-gold-400 tracking-wider bg-gold-950/20 px-2.5 py-0.5 rounded border border-gold-500/20 inline-block font-sans">
                    {rule.classRange}
                  </span>
                  
                  <div className="space-y-1.5 pt-2">
                    <span className="text-slate-400 font-bold block mb-1">Concession Merit Thresholds:</span>
                    {rule.boardTiers.map((t, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>Board Marks &ge; {t.minScore}%:</span>
                        <span className="font-bold text-slate-200">{t.concession}% Waiver</span>
                      </div>
                    ))}
                    {rule.entranceTiers.map((t, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>Entrance Marks &ge; {t.minScore}%:</span>
                        <span className="font-bold text-slate-200">{t.concession}% Waiver</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-900 pt-2.5 space-y-1.5">
                    <div className="flex justify-between text-slate-400">
                      <span>Sports (National / State):</span>
                      <span className="font-semibold text-slate-300">{rule.sportsNationalConcession}% / {rule.sportsStateConcession}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Needs (Below 2.5L / 5L):</span>
                      <span className="font-semibold text-slate-300">{rule.incomeBelow25kConcession}% / {rule.incomeBelow50kConcession}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-bold text-gold-400 pt-1 border-t border-slate-900/50 font-sans">
                      <span>Maximum Concession Cap:</span>
                      <span>{rule.maxTotalConcession}% Cap</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setEditingRule(JSON.parse(JSON.stringify(rule)))}
                  className="w-full py-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 hover:border-slate-700 text-slate-300 font-bold text-[11px] transition-all"
                >
                  Edit Rules Configuration
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {/* ============================================================ */}
    {/* 8. GALLERY MANAGEMENT PANEL */}
    {/* ============================================================ */}
    {activeTab === 'gallery' && (
      <div className="space-y-4 font-sans text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/20 p-4 rounded-2xl border border-slate-850">
          <form onSubmit={handleGallerySearch} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search title, tags, or caption..."
              value={gallerySearch}
              onChange={(e) => setGallerySearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none w-full sm:w-64"
            />
            <select
              value={galleryCategory}
              onChange={(e) => setGalleryCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="Sports">Sports</option>
              <option value="Academics">Academics</option>
              <option value="Cultural">Cultural</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Events">Events</option>
              <option value="General">General</option>
            </select>
            <button type="submit" className="p-2 bg-brand-650 hover:bg-brand-600 rounded-xl text-white">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <button
            onClick={() => {
              setNewGallery({ title: '', category: 'General', tags: '', caption: '' });
              setSelectedImageFile(null);
              setImagePreviewUrl('');
              setShowGalleryModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-bold text-white transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" /> Add Event Image
          </button>
        </div>

        {/* Gallery Admin Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 text-xs glass-panel rounded-2xl border border-slate-800">
              No gallery images found.
            </div>
          ) : (
            galleryItems.map((item) => (
              <div key={item._id} className="glass-panel border border-slate-850 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-800 transition-all">
                <div>
                  <div className="h-40 overflow-hidden relative bg-slate-950 flex items-center justify-center">
                    <img src={item.imageUrl} alt={item.title} className="max-w-full max-h-full object-cover" />
                    <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-brand-300 bg-brand-950/80 px-2 py-0.5 rounded-full border border-brand-900/50">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-200 line-clamp-1">{item.title}</h4>
                    {item.caption && <p className="text-[10px] text-slate-450 line-clamp-3 italic">"{item.caption}"</p>}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.map((t, i) => (
                          <span key={i} className="text-[8px] text-slate-500 bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 pt-0 flex justify-end">
                  <button
                    onClick={() => handleDeleteGalleryItem(item._id)}
                    className="p-1.5 rounded bg-rose-950/30 border border-rose-900/40 hover:bg-rose-900 text-rose-450 hover:text-white transition-colors text-[10px] flex items-center gap-1 font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
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
