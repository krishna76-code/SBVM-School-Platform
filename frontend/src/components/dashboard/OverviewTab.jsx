import React from 'react';
import { RefreshCw } from 'lucide-react';

const OverviewTab = ({ overviewStats }) => {
  return (
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
          {(!overviewStats.recentActivity || overviewStats.recentActivity.length === 0) ? (
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
  );
};

export default OverviewTab;
