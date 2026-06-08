import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, ArrowRight, ArrowLeft, Save, ShieldCheck, Wallet, Sparkles, XCircle } from 'lucide-react';
import API from '../services/api';

const ApplyAdmission = () => {
  const { user, checkAuth } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    previousSchool: '',
    previousClass: '',
    appliedClass: 'Class 11 Science',
    marksPercentage: '',
    documents: {
      studentPhotoUrl: '',
      aadhaarUrl: '',
      marksheetUrl: ''
    }
  });

  const [provisionedCreds, setProvisionedCreds] = useState(null);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const { data } = await API.get('/admissions/my-application');
        if (data && data.applicant) {
          const app = data.applicant;
          setFormData({
            firstName: app.firstName || '',
            lastName: app.lastName || '',
            dob: app.dob ? app.dob.split('T')[0] : '',
            gender: app.gender || 'Male',
            parentName: app.parentName || '',
            parentEmail: app.parentEmail || '',
            parentPhone: app.parentPhone || '',
            previousSchool: app.previousSchool || '',
            previousClass: app.previousClass || '',
            appliedClass: app.appliedClass || 'Class 11 Science',
            marksPercentage: app.marksPercentage !== undefined && app.marksPercentage !== null ? app.marksPercentage.toString() : '',
            documents: {
              studentPhotoUrl: app.documents?.studentPhotoUrl || '',
              aadhaarUrl: app.documents?.aadhaarUrl || '',
              marksheetUrl: app.documents?.marksheetUrl || ''
            }
          });
        }
      } catch (error) {
        console.error('Error fetching application:', error.message);
      }
    };

    if (user && user.role === 'Guest') {
      fetchApplicationData();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDocumentChange = (e) => {
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [e.target.name]: e.target.value
      }
    });
  };

  const cleanPayload = (data) => {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      gender: data.gender,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      previousSchool: data.previousSchool || null,
      previousClass: data.previousClass || null,
      appliedClass: data.appliedClass,
      marksPercentage: data.marksPercentage === '' ? null : Number(data.marksPercentage),
      documents: {
        studentPhotoUrl: data.documents.studentPhotoUrl,
        aadhaarUrl: data.documents.aadhaarUrl,
        marksheetUrl: data.documents.marksheetUrl
      }
    };
  };

  const handleSaveDraft = async () => {
    setSaveMessage('');
    try {
      const payload = cleanPayload(formData);
      // For draft, we bypass strict validation but clean standard payload
      await API.put('/admissions/save-draft', payload);
      setSaveMessage('Draft saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Save draft error:', error.message);
      alert('Error saving draft. Please try again.');
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = cleanPayload(formData);
      await API.post('/admissions/apply', payload);
      alert('Application submitted successfully!');
      await checkAuth(); // Refresh user state
    } catch (error) {
      console.error('Submit error:', error.response?.data || error.message);
      const errMsg = error.response?.data?.message || 'Error submitting application. Verify all inputs.';
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Simulate payment of admission fees and accept offer
  const handleAcceptOffer = async () => {
    setLoading(true);
    try {
      // Complete fee check simulated on client side using saved tempCredentials from database
      setTimeout(() => {
        if (user.profile?.tempCredentials) {
          setProvisionedCreds(user.profile.tempCredentials);
        } else {
          // Fallback if no credentials stored
          setProvisionedCreds({
            parent: { email: user.profile?.parentEmail || 'parent@sbvm.edu.in', tempPassword: 'GeneratedPass123' },
            student: { email: `student.${user.profile?.firstName?.toLowerCase() || 'student'}@sbvm.edu.in`, tempPassword: 'GeneratedPass123' }
          });
        }
        alert('Congratulations! Admission fee processed successfully. Portals activated.');
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Accept offer error:', error.message);
      alert('Error accepting offer. Please contact administrator.');
      setLoading(false);
    }
  };

  if (user.role !== 'Guest') {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-4 max-w-xl mx-auto">
        <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
        <h3 className="text-xl font-bold font-sans">Account is active</h3>
        <p className="text-sm text-slate-400">Your permanent portal account is fully active. Use the side navigation to browse academic portals.</p>
      </div>
    );
  }

  // Approved state: Show Offer Letter and payment simulation
  if (user.profile?.status === 'Approved') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 text-left">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Sparkles className="w-6 h-6 text-gold-400" />
            <h3 className="text-xl font-bold font-sans text-slate-100">Official Admission Offer Letter</h3>
          </div>

          <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>Dear Parent of <strong>{user.profile.firstName} {user.profile.lastName}</strong>,</p>
            <p>We are pleased to inform you that your child's application has been approved for admission to **Saraswati Bal Vidya Mandir (SBVM) School** for <strong>{user.profile.appliedClass}</strong>.</p>
            
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <p className="font-semibold text-slate-200">Fee Summary:</p>
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Scholarship Concession:</span>
                  <span className="text-gold-400 font-bold">{user.profile.feeConcessionPercentage}% Tuition Waiver</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Admission / Term Fee:</span>
                  <span className="text-slate-200 font-bold">₹15,000</span>
                </div>
              </div>
            </div>

            {user.profile.adminNotes && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60">
                <span className="text-xs text-slate-400 font-semibold block mb-1">Registrar Remarks:</span>
                <p className="text-xs text-slate-300 italic">"{user.profile.adminNotes}"</p>
              </div>
            )}

            <p>To finalize the admission process and retrieve your permanent Student and Parent portal access credentials, please complete the registration fee payment simulation below.</p>
          </div>

          {!provisionedCreds ? (
            <button
              onClick={handleAcceptOffer}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4" /> {loading ? 'Processing Payment...' : 'Pay Admission Fee (Simulate)'}
            </button>
          ) : (
            <div className="bg-emerald-950/20 border border-emerald-900/40 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" /> Accounts Activated Successfully!
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Please write down or screenshot your temporary login credentials below. You can log out of this Guest account and use these credentials to log in.</p>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Parent Login Email</span>
                  <span className="block font-bold text-slate-200">{provisionedCreds.parent?.email}</span>
                  <span className="block text-[10px] text-slate-400">Password: <strong className="text-gold-400">{provisionedCreds.parent?.tempPassword}</strong></span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Student Login Email</span>
                  <span className="block font-bold text-slate-200">{provisionedCreds.student?.email}</span>
                  <span className="block text-[10px] text-slate-400">Password: <strong className="text-gold-400">{provisionedCreds.student?.tempPassword}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Rejected state: Show rejection message
  if (user.profile?.status === 'Rejected') {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 max-w-xl mx-auto text-center space-y-4">
        <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-xl font-bold font-sans text-rose-400">Application Rejected</h3>
        <p className="text-sm text-slate-400 font-medium">Your application has been reviewed and rejected.</p>
        
        {user.profile.adminNotes && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Registrar Remarks:</span>
            <p className="text-xs text-slate-300 italic">"{user.profile.adminNotes}"</p>
          </div>
        )}
        
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          We regret to inform you that we cannot offer admission at this time. You may contact the admission desk for further information.
        </p>
      </div>
    );
  }

  // Submitted / Under Review state: Show dynamic status tracking timeline
  if (user.profile?.status && user.profile.status !== 'Draft') {
    const statusSteps = ['Draft', 'Submitted', 'Under Review', 'Approved'];
    const currentStatus = user.profile.status;
    const currentStepIndex = statusSteps.indexOf(currentStatus) !== -1 ? statusSteps.indexOf(currentStatus) : 1;
    
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-6">
          <ClipboardList className="w-12 h-12 text-gold-400 mx-auto animate-pulse" />
          <div>
            <h3 className="text-xl font-bold font-sans">Application Received</h3>
            <p className="text-xs text-slate-400 mt-1">Application Reference ID: {user.profile._id}</p>
          </div>

          {/* Timeline Tracker */}
          <div className="flex items-center justify-between relative px-2 py-4">
            <div className="absolute left-6 right-6 top-1/2 h-[2px] bg-slate-850 -translate-y-1/2 z-0">
              <div 
                className="h-full bg-gradient-to-r from-gold-500 to-amber-500 transition-all duration-500" 
                style={{ width: `${(currentStepIndex / 3) * 100}%` }}
              />
            </div>
            
            {statusSteps.map((s, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isActive = s === currentStatus;
              return (
                <div key={s} className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-gold-400 to-amber-500 text-slate-950 ring-4 ring-gold-950'
                      : isCompleted 
                        ? 'bg-amber-500/20 text-gold-400 border border-amber-500/50' 
                        : 'bg-slate-900 border-2 border-slate-800 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-[10px] mt-2 font-semibold ${isActive ? 'text-gold-400' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                    {s}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Current Phase:</span>
              <span className="px-2 py-0.5 bg-brand-950/40 text-brand-400 rounded border border-brand-900/30 font-bold uppercase tracking-wider text-[10px]">
                {currentStatus}
              </span>
            </div>
            {user.profile.adminNotes && (
              <div className="border-t border-slate-800/80 pt-2 mt-2">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Registrar Remarks</span>
                <p className="text-xs text-slate-300 italic mt-0.5">"{user.profile.adminNotes}"</p>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Our registrar team is verifying the uploaded transcripts. If scheduling an entrance exam or interview is necessary, you will be notified here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Steps Header */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
        <span className={`${step === 1 ? 'text-gold-400 font-bold' : 'text-slate-500'}`}>1. Student Info</span>
        <span className="text-slate-700">➔</span>
        <span className={`${step === 2 ? 'text-gold-400 font-bold' : 'text-slate-500'}`}>2. Guardian Info</span>
        <span className="text-slate-700">➔</span>
        <span className={`${step === 3 ? 'text-gold-400 font-bold' : 'text-slate-500'}`}>3. Academic Info</span>
        <span className="text-slate-700">➔</span>
        <span className={`${step === 4 ? 'text-gold-400 font-bold' : 'text-slate-500'}`}>4. Documents Upload</span>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-left relative">
        <form onSubmit={handleSubmitApplication} className="space-y-6">
          
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-200 border-b border-slate-800 pb-2">Student Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Gender</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Guardian Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-200 border-b border-slate-800 pb-2">Parent / Guardian Details</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Guardian Name</label>
                <input 
                  type="text" 
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Guardian Email</label>
                  <input 
                    type="email" 
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Guardian Contact Phone</label>
                  <input 
                    type="tel" 
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Academic Record (Optional fields for Entry-level/Nursery/KG) */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-200">Previous Academic Achievements</h3>
                <span className="text-[10px] text-gold-500 font-semibold px-2 py-0.5 rounded bg-gold-950/20 border border-gold-900/30">Optional for Entry Levels</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Previous School Name (If any)</label>
                  <input 
                    type="text" 
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    placeholder="e.g. Playway Primary School"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Previous Class Completed (If any)</label>
                  <input 
                    type="text" 
                    name="previousClass"
                    value={formData.previousClass}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    placeholder="e.g. Class 10 or Nursery"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Marks Obtained (%, If any)</label>
                  <input 
                    type="number" 
                    name="marksPercentage"
                    value={formData.marksPercentage}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    placeholder="e.g. 85"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Class Applied For</label>
                  <select 
                    name="appliedClass"
                    value={formData.appliedClass}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11 Science">Class 11 Science</option>
                    <option value="Class 11 Commerce">Class 11 Commerce</option>
                    <option value="Class 11 Arts">Class 11 Arts</option>
                    <option value="Class 12 Science">Class 12 Science</option>
                    <option value="Class 12 Commerce">Class 12 Commerce</option>
                    <option value="Class 12 Arts">Class 12 Arts</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents Upload */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-200 border-b border-slate-800 pb-2">Document Submissions</h3>
              <p className="text-[10px] text-slate-500 leading-normal">
                Please provide Cloudinary links or file paths for verification.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Student Passport Photo (URL / Link)</label>
                  <input 
                    type="text" 
                    name="studentPhotoUrl"
                    value={formData.documents.studentPhotoUrl}
                    onChange={handleDocumentChange}
                    placeholder="https://res.cloudinary.com/.../student-photo.jpg"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Aadhaar Card Copy (URL / Link)</label>
                  <input 
                    type="text" 
                    name="aadhaarUrl"
                    value={formData.documents.aadhaarUrl}
                    onChange={handleDocumentChange}
                    placeholder="https://res.cloudinary.com/.../aadhaar.jpg"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Previous Class Marksheet / Birth Cert (URL / Link)</label>
                  <input 
                    type="text" 
                    name="marksheetUrl"
                    value={formData.documents.marksheetUrl}
                    onChange={handleDocumentChange}
                    placeholder="https://res.cloudinary.com/.../marksheet.jpg"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Buttons Navigation footer */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-800/85">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300 transition-colors"
              >
                <Save className="w-3.5 h-3.5 text-gold-400" /> Save Draft
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white transition-colors"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </form>

        {saveMessage && (
          <div className="absolute top-4 right-4 bg-emerald-950/40 border border-emerald-900/60 rounded-xl px-3 py-1.5 text-[10px] text-emerald-400 font-semibold animate-pulse">
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyAdmission;
