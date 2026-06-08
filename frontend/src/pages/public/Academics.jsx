import React from 'react';
import { BookOpen, Sparkles, GraduationCap, Award, Compass } from 'lucide-react';

const Academics = () => {
  const divisions = [
    { title: 'Primary Tier (Nursery to Class 5)', desc: 'Focus on play-way and conceptual foundation models, arithmetic capabilities, and vocabulary enhancements.', icon: Compass },
    { title: 'Middle Tier (Class 6 to Class 8)', desc: 'Analytical development, laboratory introduction sessions, and baseline foundations in languages and science math structures.', icon: BookOpen },
    { title: 'Secondary Board Tier (Class 9 & 10)', desc: 'Rigorous CBSE board prep focusing on syllabus complete understanding, assessments, and competitive baseline NTSE preps.', icon: GraduationCap }
  ];

  const seniorStreams = [
    { name: 'Science Stream (PCM / PCB)', focus: 'Integrated Preparation', details: 'Designed for engineering & medical aspirants. Focuses on Physics, Chemistry, Mathematics/Biology with built-in daily coaching classes for JEE Advanced and NEET.' },
    { name: 'Commerce Stream', focus: 'Finance & Management', details: 'Focuses on Core Accountancy, Business Studies, Economics, and Applied Mathematics preparing students for CA Foundation, corporate careers, or management.' },
    { name: 'Humanities & Arts Stream', focus: 'Social Studies & Civil Services', details: 'Focuses on History, Geography, Political Science, and English, designed for civil services foundation prep and professional arts careers.' }
  ];

  return (
    <div className="bg-slate-950 pb-20 text-left">
      
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px] pulse-glow"></div>
        
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-950/20 px-3 py-1 rounded-full border border-gold-900/20">
            Academic Pedagogy
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-100">
            Syllabus, Streams & <br />
            <span className="gradient-text">Integrated Coaching Systems</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
            Affiliated to CBSE, SBVM Sikar structures class curriculums meticulously to balance school boards with competitive examinations.
          </p>
        </div>
      </section>

      {/* Grade Tier divisions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h3 className="text-2xl font-bold font-sans text-slate-100 border-b border-slate-900 pb-3">Educational Stages</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {divisions.map((div, idx) => {
            const Icon = div.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-850 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <h4 className="font-bold text-slate-200 text-sm font-sans">{div.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{div.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Senior Secondary streams */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold font-sans text-slate-100">Senior Secondary Streams (Class 11 & 12)</h3>
          <p className="text-slate-500 text-xs font-semibold">Multiple pathways to map higher career projections.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {seniorStreams.map((stream, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider bg-gold-950/20 px-2 py-0.5 rounded border border-gold-900/10 inline-block">
                  {stream.focus}
                </span>
                <h4 className="font-bold text-slate-200 text-base font-sans">{stream.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium pt-2">{stream.details}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Routine Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h3 className="text-2xl font-bold font-sans text-slate-100 border-b border-slate-900 pb-3">Daily Academic Timeline</h3>
        
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 max-w-2xl divide-y divide-slate-900">
          <div className="flex justify-between items-center py-3 text-xs">
            <span className="font-bold text-slate-300">08:00 AM - 08:30 AM</span>
            <span className="text-slate-400">Vedic Assembly, Meditation & Circular Updates</span>
          </div>
          <div className="flex justify-between items-center py-3 text-xs">
            <span className="font-bold text-slate-300">08:30 AM - 01:30 PM</span>
            <span className="text-slate-400">CBSE Core Syllabus Lectures (6 Periods with break)</span>
          </div>
          <div className="flex justify-between items-center py-3 text-xs">
            <span className="font-bold text-slate-300">01:30 PM - 02:30 PM</span>
            <span className="text-slate-400">Lunch Break & Relaxation</span>
          </div>
          <div className="flex justify-between items-center py-3 text-xs">
            <span className="font-bold text-slate-300">02:30 PM - 04:30 PM</span>
            <span className="text-slate-400">JEE / NEET Integrated Coaching & Practice Sheets (DDPs)</span>
          </div>
          <div className="flex justify-between items-center py-3 text-xs">
            <span className="font-bold text-slate-300">04:30 PM - 06:00 PM</span>
            <span className="text-slate-400">Sports Practice / Hobby Classes & Club Meetings</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Academics;
