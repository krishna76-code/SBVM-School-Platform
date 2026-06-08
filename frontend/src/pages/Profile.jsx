import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Mail, Phone, Calendar, MapPin, Award, BookOpen, GraduationCap } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Generate User Initials for Avatar
  const getInitials = () => {
    if (user.role === 'Guest') {
      return (user.profile?.firstName?.[0] || 'G') + (user.profile?.lastName?.[0] || 'A');
    }
    if (user.role === 'Parent') {
      return (user.profile?.fatherName?.[0] || 'P') + (user.profile?.motherName?.[0] || 'G');
    }
    if (user.role === 'Admin') {
      return 'AD';
    }
    return (user.profile?.firstName?.[0] || 'U') + (user.profile?.lastName?.[0] || 'U');
  };

  const getProfileName = () => {
    if (user.role === 'Guest') {
      return `${user.profile?.firstName || 'Guest'} ${user.profile?.lastName || 'Applicant'}`;
    }
    if (user.role === 'Parent') {
      return `${user.profile?.fatherName || 'Parent'} & ${user.profile?.motherName || 'Guardian'}`;
    }
    if (user.role === 'Admin') {
      return 'System Administrator';
    }
    return `${user.profile?.firstName || 'User'} ${user.profile?.lastName || ''}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      
      {/* Header Profile Cover */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-600/10 rounded-full blur-2xl z-0" />
        
        <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center border-2 border-brand-500/20 text-xl font-extrabold text-white shrink-0 shadow-lg shadow-brand-500/20">
          {getInitials()}
        </div>

        <div className="relative z-10 space-y-1.5 text-center sm:text-left overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 bg-gold-950/20 px-2.5 py-0.5 rounded border border-gold-500/20">
            {user.role} Account
          </span>
          <h2 className="text-xl font-extrabold font-sans text-slate-100">{getProfileName()}</h2>
          <p className="text-xs text-slate-400 font-medium">Saraswati Bal Vidya Mandir (SBVM) School</p>
        </div>
      </div>

      {/* Main Profile Info Sheet */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="font-bold text-slate-200 text-sm font-sans pb-3 border-b border-slate-800 flex items-center gap-2">
          <User className="w-4.5 h-4.5 text-gold-400" /> Account & Profile Demographics
        </h3>

        {/* Generic Credential Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 uppercase"><Mail className="w-3.5 h-3.5" /> Email Address</span>
            <span className="font-semibold text-slate-300 block truncate">{user.email}</span>
          </div>

          <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 uppercase"><Phone className="w-3.5 h-3.5" /> Phone Number</span>
            <span className="font-semibold text-slate-300 block">{user.phone || user.profile?.parentPhone || 'N/A'}</span>
          </div>
        </div>

        {/* Role Specific Fields */}
        <div className="border-t border-slate-850/80 pt-6 space-y-4 text-xs">
          
          {/* STUDENT PROFILE SHEET */}
          {user.role === 'Student' && user.profile && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1">Class standard:</span>
                <span className="font-bold text-slate-200 block text-sm">{user.profile.currentClass} (Sec {user.profile.section || 'A'})</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1">Admission / Roll No:</span>
                <span className="font-bold text-slate-200 block text-sm">{user.profile.admissionNumber} / Roll {user.profile.rollNumber || 'N/A'}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date of Birth:</span>
                <span className="font-bold text-slate-200 block text-sm">{new Date(user.profile.dob).toLocaleDateString()}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1">Gender:</span>
                <span className="font-bold text-slate-200 block text-sm">{user.profile.gender}</span>
              </div>
            </div>
          )}

          {/* PARENT PROFILE SHEET */}
          {user.role === 'Parent' && user.profile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1">Father's Name:</span>
                  <span className="font-bold text-slate-200 block text-sm">{user.profile.fatherName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1">Mother's Name:</span>
                  <span className="font-bold text-slate-200 block text-sm">{user.profile.motherName}</span>
                </div>
              </div>

              {user.profile.address && (
                <div className="pt-2">
                  <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Physical Address:</span>
                  <span className="font-bold text-slate-200 block text-sm leading-normal">
                    {user.profile.address.street || ''}, {user.profile.address.city || ''}, {user.profile.address.state || ''} - {user.profile.address.zipCode || ''}
                  </span>
                </div>
              )}

              {user.profile.children && user.profile.children.length > 0 && (
                <div className="pt-2 border-t border-slate-850 pt-4">
                  <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-2 flex items-center gap-1"><GraduationCap className="w-4 h-4 text-gold-400" /> Linked Children Profiles:</span>
                  <div className="space-y-2">
                    {user.profile.children.map((child, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-200 text-xs">{child.firstName || 'Student'} {child.lastName || ''}</p>
                          <span className="text-[10px] text-slate-500">{child.currentClass || 'N/A'}</span>
                        </div>
                        <span className="text-[10px] text-brand-400 font-semibold uppercase">Enrolled</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TEACHER PROFILE SHEET */}
          {user.role === 'Teacher' && user.profile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1">Teacher Employee ID:</span>
                  <span className="font-bold text-slate-200 block text-sm">{user.profile.employeeId || 'TCH991'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1">Subjects Expertise:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {user.profile.subjectsTaught && user.profile.subjectsTaught.length > 0 ? (
                      user.profile.subjectsTaught.map((sub, sidx) => (
                        <span key={sidx} className="px-2 py-0.5 bg-brand-950/40 text-brand-450 border border-brand-900/30 rounded font-semibold text-[10px]">{sub}</span>
                      ))
                    ) : (
                      <span className="font-bold text-slate-200 block">General Subjects</span>
                    )}
                  </div>
                </div>
              </div>

              {user.profile.classesAssigned && user.profile.classesAssigned.length > 0 && (
                <div className="pt-2 border-t border-slate-850 pt-4">
                  <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-2 flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Assigned Standards Divisions:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {user.profile.classesAssigned.map((c, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gold-950/20 text-gold-400 border border-gold-900/30 rounded font-semibold text-[10px]">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ADMIN PROFILE SHEET */}
          {user.role === 'Admin' && user.profile && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1">Employee ID:</span>
                <span className="font-bold text-slate-200 block text-sm">{user.profile.employeeId || 'ADM001'}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1">Office / Department:</span>
                <span className="font-bold text-slate-200 block text-sm">{user.profile.department || 'Executive Office'}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-gold-450" /> System Designation:</span>
                <span className="font-bold text-slate-200 block text-sm">{user.profile.designation || 'Director of Operations'}</span>
              </div>
            </div>
          )}

          {/* GUEST PROFILE SHEET */}
          {user.role === 'Guest' && user.profile && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1">Applied Standard:</span>
                <span className="font-bold text-slate-200 block text-sm">{user.profile.appliedClass}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase text-[10px] font-semibold mb-1">Admission Status:</span>
                <span className="font-bold text-gold-450 block text-sm uppercase">{user.profile.status}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
