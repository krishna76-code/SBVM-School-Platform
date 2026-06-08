import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  User, Users, Award, ClipboardCheck, BellRing, BookMarked, 
  HelpCircle, Sparkles, Building, Calendar, ArrowUpRight 
} from 'lucide-react';
import API from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        if (user.role === 'Admin') {
          const { data } = await API.get('/admissions/applications');
          setStats({ totalApplications: data.length, pendingReview: data.filter(a => a.status === 'Submitted').length });
        } else if (user.role === 'Student') {
          const { data } = await API.get(`/portal/results/${user.profile?._id}`);
          const attendanceData = await API.get(`/portal/attendance/${user.profile?._id}`);
          
          const presentDays = attendanceData.data.filter(r => r.status === 'Present').length;
          const totalDays = attendanceData.data.length || 1;
          const attendancePercentage = Math.round((presentDays / totalDays) * 100);

          setStats({ 
            recentResult: data[0] || null, 
            attendancePercentage 
          });
        } else if (user.role === 'Parent') {
          // Parent statistics for active child
          const activeChildId = localStorage.getItem('activeChildId');
          const childId = activeChildId || user.profile?.children?.[0]?._id || user.profile?.children?.[0];
          if (childId) {
            const { data } = await API.get(`/portal/results/${childId}`);
            const attendanceData = await API.get(`/portal/attendance/${childId}`);
            const presentDays = attendanceData.data.filter(r => r.status === 'Present').length;
            const totalDays = attendanceData.data.length || 1;
            const attendancePercentage = Math.round((presentDays / totalDays) * 100);

            // Fetch active child fee status
            let hasUnpaid = false;
            let totalPending = 0;
            try {
              const feeData = await API.get(`/portal/fees/${childId}`);
              const feesList = feeData.data.data || feeData.data || [];
              hasUnpaid = feesList.some(f => f.status === 'Unpaid');
              totalPending = feesList.filter(f => f.status === 'Unpaid').reduce((sum, f) => sum + f.finalAmount, 0);
            } catch (err) {
              console.error('Error fetching fees for dashboard:', err.message);
            }

            setStats({ 
              recentResult: data[0] || null, 
              attendancePercentage,
              hasUnpaid,
              totalPending
            });
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  if (!user) return null;

  const getWelcomeName = () => {
    if (user.role === 'Guest') {
      return user.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : 'Guest Applicant';
    }
    if (user.role === 'Parent') {
      return `${user.profile?.fatherName || 'Parent'}`;
    }
    return user.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : 'User';
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Welcome banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-950/20 px-2.5 py-0.5 rounded border border-gold-500/20">
              {user.role} Portal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-100">
            Welcome Back, {getWelcomeName()}
          </h2>
          <p className="text-slate-400 text-xs">
            Saraswati Bal Vidya Mandir Management Console • Sikar, Rajasthan
          </p>
        </div>
        
        {user.role === 'Guest' && (
          <Link
            to="/dashboard/apply"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-gold-500/10"
          >
            Go to Admission Form <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Role specific components */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Guest Applicant dashboard widgets */}
        {user.role === 'Guest' && (
          <>
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <ClipboardCheck className="w-6 h-6 text-gold-400" />
              <h4 className="font-bold text-slate-200 text-sm font-sans">Application Status</h4>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Current State:</span>
                <span className={`block text-xs font-bold mt-1 uppercase ${
                  user.profile?.status === 'Submitted' ? 'text-blue-400' :
                  user.profile?.status === 'Accepted' ? 'text-emerald-400' :
                  user.profile?.status === 'InterviewScheduled' ? 'text-gold-400' :
                  user.profile?.status === 'Offered' ? 'text-purple-400' :
                  'text-amber-500' // Draft / Pending
                }`}>
                  {user.profile?.status || 'Draft'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                {user.profile?.status === 'Draft' && 'Please complete all steps in the Admission Form to submit for review.'}
                {user.profile?.status === 'Submitted' && 'Your application has been received and is currently under document verification.'}
                {user.profile?.status === 'InterviewScheduled' && `An interview has been scheduled. Check notes: ${user.profile?.adminNotes || 'Pending interview details.'}`}
                {user.profile?.status === 'Offered' && 'Congratulations! You have received an offer. Complete the fee simulation to activate accounts.'}
                {user.profile?.status === 'Accepted' && 'Welcome! Your student/parent accounts are active. Log out and log back in with your permanent accounts.'}
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <Award className="w-6 h-6 text-brand-400" />
              <h4 className="font-bold text-slate-200 text-sm font-sans">Fee concessions</h4>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Assigned concession:</span>
                <span className="block text-lg font-extrabold text-gold-400 mt-1">{user.profile?.feeConcessionPercentage || 0}% Waiver</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Concession percentages are computed by the registrar based on verification of merits, income, and sports files.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <h4 className="font-bold text-slate-200 text-sm font-sans">Next Actions</h4>
              <ul className="text-[11px] text-slate-400 space-y-2">
                <li className="flex gap-2">
                  <span className="text-gold-400">⚡</span> Fill and upload document scans in the admissions menu.
                </li>
                <li className="flex gap-2">
                  <span className="text-gold-400">⚡</span> Chat with the AI Counselor for any query resolutions.
                </li>
              </ul>
            </div>
          </>
        )}

        {/* Student portal widgets */}
        {user.role === 'Student' && stats && (
          <>
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <ClipboardCheck className="w-6 h-6 text-gold-400" />
              <h4 className="font-bold text-slate-200 text-sm font-sans">Monthly Attendance</h4>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Overall ratio:</span>
                <span className="block text-lg font-extrabold text-slate-200 mt-1">{stats.attendancePercentage || 0}% Present</span>
              </div>
              <Link to="/dashboard/attendance" className="text-xs text-brand-400 font-semibold hover:underline block">View Details →</Link>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <Award className="w-6 h-6 text-brand-400" />
              <h4 className="font-bold text-slate-200 text-sm font-sans">Recent Grades</h4>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Latest Term:</span>
                {stats.recentResult ? (
                  <span className="block text-lg font-extrabold text-gold-400 mt-1">{stats.recentResult.totalPercentage}% ({stats.recentResult.overallGrade})</span>
                ) : (
                  <span className="block text-xs font-semibold text-slate-400 mt-1">No term results logged yet</span>
                )}
              </div>
              <Link to="/dashboard/results" className="text-xs text-brand-400 font-semibold hover:underline block">View Report Cards →</Link>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <BookMarked className="w-6 h-6 text-emerald-400" />
              <h4 className="font-bold text-slate-200 text-sm font-sans">AI Tutor Companion</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Struggling with homework concepts? Query the AI Study Assistant for physics, maths, or biology curriculum answers.
              </p>
              <Link to="/dashboard/study-assistant" className="text-xs text-brand-400 font-semibold hover:underline block">Ask AI Tutor →</Link>
            </div>
          </>
        )}

        {user.role === 'Parent' && stats && (
          <>
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <ClipboardCheck className="w-6 h-6 text-gold-400" />
              <h4 className="font-bold text-slate-200 text-sm font-sans">Child attendance</h4>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Class presence ratio:</span>
                <span className="block text-lg font-extrabold text-slate-200 mt-1">{stats?.attendancePercentage || 0}% Average</span>
              </div>
              <Link to="/dashboard/attendance" className="text-xs text-brand-400 font-semibold hover:underline block">Track Logs →</Link>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <Award className="w-6 h-6 text-brand-400" />
              <h4 className="font-bold text-slate-200 text-sm font-sans">Grades Tracker</h4>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Latest results:</span>
                {stats?.recentResult ? (
                  <span className="block text-lg font-extrabold text-gold-400 mt-1">{stats.recentResult.totalPercentage}% ({stats.recentResult.overallGrade})</span>
                ) : (
                  <span className="block text-xs font-semibold text-slate-400 mt-1">No term results logged yet</span>
                )}
              </div>
              <Link to="/dashboard/results" className="text-xs text-brand-400 font-semibold hover:underline block">View Report Cards →</Link>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <Building className="w-6 h-6 text-emerald-400" />
              <h4 className="font-bold text-slate-200 text-sm font-sans">Dues & Ledger</h4>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Status:</span>
                {stats.hasUnpaid ? (
                  <span className="block text-xs font-bold text-rose-400 mt-1">
                    Outstanding: ₹{stats.totalPending.toLocaleString()}
                  </span>
                ) : (
                  <span className="block text-xs font-bold text-emerald-400 mt-1">All Term Fees Cleared</span>
                )}
              </div>
              <Link to="/dashboard/fees" className="text-xs text-brand-400 font-semibold hover:underline block">Manage Invoices →</Link>
            </div>
          </>
        )}

        {/* Teacher & Admin dashboard widgets */}
        {(user.role === 'Teacher' || user.role === 'Admin') && (
          <>
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <Users className="w-6 h-6 text-gold-400" />
              <h4 className="font-bold text-slate-200 text-sm font-sans">School Registry</h4>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Class Assigned:</span>
                <span className="block text-lg font-extrabold text-slate-200 mt-1">Class 11 Science</span>
              </div>
              <Link to="/dashboard/teacher/attendance" className="text-xs text-brand-400 font-semibold hover:underline block">Take Attendance →</Link>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <ClipboardCheck className="w-6 h-6 text-brand-400" />
              <h4 className="font-bold text-slate-200 text-sm font-sans">Gradebook publishing</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Input and calculate term marks for assignments, half-yearly and yearly tests.
              </p>
              <Link to="/dashboard/teacher/marks" className="text-xs text-brand-400 font-semibold hover:underline block">Upload Grades →</Link>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <BellRing className="w-6 h-6 text-emerald-400" />
              <h4 className="font-bold text-slate-200 text-sm font-sans">Notice circulars</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Send updates and targeted announcements to specific parent/student boards.
              </p>
              <Link to="/dashboard/notices" className="text-xs text-brand-400 font-semibold hover:underline block">Manage Notices →</Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
