import React from 'react';
import { Award, Users, Trophy, GraduationCap } from 'lucide-react';

const AchievementsSection = () => {
  const stats = [
    { label: 'Years Academic Legacy', count: '15+', icon: Trophy, color: 'text-gold-400', bg: 'bg-gold-500/10' },
    { label: 'JEE & NEET Selections', count: '350+', icon: Award, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Active Successful Alumni', count: '10,000+', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'CBSE Board Toppers', count: '85+', icon: GraduationCap, color: 'text-gold-400', bg: 'bg-gold-500/10' }
  ];

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        
        {/* Title */}
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Institutional Track Record</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-100">SBVM Milestones of Excellence</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Driven by results, guided by discipline. Explore our key academic stats.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4 hover:border-slate-700/80 transition-all group hover:translate-y-[-2px]"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center border border-slate-800 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="space-y-1">
                  <span className="block text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
                    {stat.count}
                  </span>
                  <span className="block text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider leading-snug">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default AchievementsSection;
