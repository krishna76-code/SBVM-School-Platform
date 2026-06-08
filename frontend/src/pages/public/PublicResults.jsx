import React from 'react';
import { Award, GraduationCap, Trophy, ShieldCheck } from 'lucide-react';

const PublicResults = () => {
  const boardToppers = [
    { name: 'Priya Choudhary', score: '99.4%', stream: 'Science (Class 12)', rank: 'Dist. Rank 1' },
    { name: 'Amit Kumar Verma', score: '98.8%', stream: 'Science (Class 12)', rank: 'Dist. Rank 3' },
    { name: 'Nikita Soni', score: '98.2%', stream: 'Commerce (Class 12)', rank: 'Topper' },
    { name: 'Rohan Sharma', score: '98.0%', stream: 'Class 10 Board', rank: 'Topper' }
  ];

  const competitiveSelections = [
    { exam: 'JEE Advanced 2025', count: '14 Selections', details: 'Top selections: AIR 412 (Rohan Soni), AIR 1240 (Amit Verma)' },
    { exam: 'JEE Main 2025', count: '45+ Selections', details: 'Over 12 students scored above 99.0 percentile' },
    { exam: 'NEET UG 2025', count: '28 MBBS Selections', details: 'Top scores: 695/720 (Priya Choudhary), 682/720 (Vikram Singh)' },
    { exam: 'NTSE & Olympiads', count: '8 Scholars', details: 'NTSE stage-2 selections and Olympiad ranks' }
  ];

  return (
    <div className="bg-slate-950 pb-20 text-left">
      
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px] pulse-glow"></div>
        
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-950/20 px-3 py-1 rounded-full border border-gold-900/20">
            Performance Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-100">
            Our Hall of Fame & <br />
            <span className="gradient-text">Board Examination Ranks</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
            Explore the historical academic achievements and competitive examination qualifiers from Saraswati Bal Vidya Mandir.
          </p>
        </div>
      </section>

      {/* Board results toppers card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h3 className="text-2xl font-bold font-sans text-slate-100 border-b border-slate-900 pb-3">CBSE Board Toppers (Session 2025)</h3>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {boardToppers.map((topper, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 p-3 bg-gold-500/10 rounded-bl-xl border-l border-b border-gold-500/20">
                <GraduationCap className="w-5 h-5 text-gold-400" />
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{topper.rank}</span>
              <h4 className="font-bold text-slate-200 text-sm font-sans">{topper.name}</h4>
              <div className="pt-2 flex justify-between items-end border-t border-slate-900">
                <span className="text-[10px] text-slate-400 font-medium">{topper.stream}</span>
                <span className="text-lg font-extrabold text-gold-400">{topper.score}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Competitive Selections details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <h3 className="text-2xl font-bold font-sans text-slate-100 border-b border-slate-900 pb-3">Competitive Exam Selections</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {competitiveSelections.map((selection, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 text-left">
              <div className="flex items-center gap-3 border-b border-slate-900 pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-brand-400" />
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm font-sans">{selection.exam}</h4>
                </div>
                <span className="text-xs font-bold text-emerald-400">{selection.count}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {selection.details}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default PublicResults;
