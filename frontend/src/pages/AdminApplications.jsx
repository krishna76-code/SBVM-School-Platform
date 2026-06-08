import React, { useEffect, useState } from 'react';
import { ShieldCheck, Eye, RefreshCw, Calendar, Award } from 'lucide-react';
import API from '../services/api';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Status Form States
  const [status, setStatus] = useState('Submitted');
  const [adminNotes, setAdminNotes] = useState('');
  const [feeConcessionPercentage, setFeeConcessionPercentage] = useState('0');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admissions/applications');
      setApplications(data.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setStatus(app.status);
    setAdminNotes(app.adminNotes || '');
    setFeeConcessionPercentage(app.feeConcessionPercentage?.toString() || '0');
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/admissions/applications/${selectedApp._id}/status`, {
        status,
        adminNotes,
        feeConcessionPercentage: Number(feeConcessionPercentage)
      });
      alert('Application updated successfully!');
      setShowStatusModal(false);
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error.response?.data || error.message);
      const errMsg = error.response?.data?.message || 'Error updating application. Please verify parameters.';
      alert(errMsg);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-gold-400" /> Admissions Review Pipeline
          </h2>
          <p className="text-slate-400 text-xs mt-1">Review student dossiers, manage status review pipelines, and assign scholarships.</p>
        </div>
        <button
          onClick={fetchApplications}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all text-slate-400 hover:text-slate-200"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="relative w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-12 gap-6 items-start">
          
          {/* Applications list */}
          <div className="md:col-span-8 glass-panel border border-slate-800 rounded-2xl overflow-hidden">
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
              <tbody className="divide-y divide-slate-800/60">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-slate-500">No admission applications found in pipeline.</td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-900/25 transition-all">
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
                          onClick={() => handleOpenStatusModal(app)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 font-semibold text-slate-300 transition-all text-[11px] inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Side stats card */}
          <div className="md:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="font-bold text-slate-200 text-sm font-sans flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold-400" /> Pipeline Stats
              </h4>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="block font-extrabold text-lg text-slate-200">{applications.length}</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Applications</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="block font-extrabold text-lg text-gold-400">
                    {applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Active Review</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Submitted (New):</span>
                  <span className="text-slate-200 font-bold">{applications.filter(a => a.status === 'Submitted').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Under Review:</span>
                  <span className="text-slate-200 font-bold">{applications.filter(a => a.status === 'Under Review').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Approved:</span>
                  <span className="text-emerald-400 font-bold">{applications.filter(a => a.status === 'Approved').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rejected:</span>
                  <span className="text-rose-400 font-bold">{applications.filter(a => a.status === 'Rejected').length}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Details / Status Change Modal */}
      {showStatusModal && selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl rounded-3xl border border-slate-800 p-6 space-y-6 text-left relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200 font-sans">{selectedApp.firstName} {selectedApp.lastName}</h3>
                <p className="text-xs text-slate-500">Class applied: <strong>{selectedApp.appliedClass}</strong></p>
              </div>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-slate-200 font-extrabold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Application Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Guardian Details:</span>
                <span className="text-slate-300 font-bold block">{selectedApp.parentName}</span>
                <span className="text-[10px] text-slate-400">{selectedApp.parentPhone} • {selectedApp.parentEmail}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Previous Record:</span>
                <span className="text-slate-300 font-bold block">{selectedApp.previousSchool || 'N/A'}</span>
                <span className="text-[10px] text-slate-400">
                  {selectedApp.previousClass ? `Class ${selectedApp.previousClass}` : 'No Prior Class'} • {selectedApp.marksPercentage !== undefined && selectedApp.marksPercentage !== null ? `${selectedApp.marksPercentage}%` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Document Scans Links */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="text-slate-500 font-bold block pb-1 border-b border-slate-800/80">Document Transcripts (Cloudinary Links):</span>
              <div className="flex flex-wrap gap-4 pt-1">
                {selectedApp.documents?.studentPhotoUrl ? (
                  <a href={selectedApp.documents.studentPhotoUrl} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline flex items-center gap-1">📷 Student Photo</a>
                ) : (
                  <span className="text-slate-600">📷 Photo Missing</span>
                )}
                {selectedApp.documents?.aadhaarUrl ? (
                  <a href={selectedApp.documents.aadhaarUrl} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline flex items-center gap-1">📄 Aadhaar Copy</a>
                ) : (
                  <span className="text-slate-600">📄 Aadhaar Missing</span>
                )}
                {selectedApp.documents?.marksheetUrl ? (
                  <a href={selectedApp.documents.marksheetUrl} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline flex items-center gap-1">📄 Marksheet / Cert</a>
                ) : (
                  <span className="text-slate-600">📄 Marksheet Missing</span>
                )}
              </div>
            </div>

            {/* Status Change Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 border-t border-slate-800 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Update Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="Submitted">Submitted (Reviewing)</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved (Approve & Seed Accounts)</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Scholarship Fee Concession (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="75"
                    value={feeConcessionPercentage}
                    onChange={(e) => setFeeConcessionPercentage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Registrar Remarks / Decision Reason</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Provide decision rationales or review details."
                  rows="3"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 resize-none font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                >
                  Update Applicant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
