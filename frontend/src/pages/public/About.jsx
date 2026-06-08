import React from 'react';
import { Target, Eye, Sparkles, Award, Compass, ShieldAlert } from 'lucide-react';

const About = () => {
  const leadership = [
    { name: 'Shri Ramswaroop Soni', role: 'Managing Director', msg: 'SBVM Sikar was established with the commitment to provide top-tier academic training in Sikar. Our results in JEE/NEET reflect the sheer hard work of our dedicated faculty and disciplined students.' },
    { name: 'Dr. Mahendra Kumar Sharma', role: 'Principal Desk', msg: 'Academic rigour without moral values is incomplete. We prepare students not just to crack national exams, but to emerge as responsible leaders built on deep ethical foundations.' }
  ];

  return (
    <div className="bg-slate-950 pb-20">
      
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px] pulse-glow"></div>
        
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-950/20 px-3 py-1 rounded-full border border-gold-900/20">
            About Our Institution
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-100">
            The Legacy of <br />
            <span className="gradient-text">Saraswati Bal Vidya Mandir</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
            Established in Sikar, Rajasthan, SBVM represents the peak of quality school board preparation merged with top-grade competitive exam preparation.
          </p>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
        
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 text-left glow-brand">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-brand-400" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-200">Our Mission Statement</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            To build an intellectual hub that instills rigor in learning, prepares students to successfully compete at national level assessments, and fosters core moral values. We ensure every pupil secures their highest capability.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 text-left glow-gold">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
            <Eye className="w-6 h-6 text-gold-400" />
          </div>
          <h3 className="text-xl font-bold font-sans text-slate-200">Our Vision Model</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            To emerge as the most trusted educational group in Sikar district, recognized globally for producing academic scholars, ethical innovators, and disciplined professionals who lead communities with pride.
          </p>
        </div>

      </section>

      {/* Leadership Messages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-left space-y-8">
        <h3 className="text-2xl font-bold font-sans text-slate-100 border-b border-slate-900 pb-3">Institutional Leadership</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {leadership.map((lead, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-850 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold text-gold-400 uppercase tracking-wide">{lead.role}</span>
                <h4 className="text-base font-bold text-slate-200 font-sans">{lead.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed italic pt-2">
                  "{lead.msg}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        <h3 className="text-2xl font-bold font-sans text-slate-100 border-b border-slate-900 pb-3">Our Core Principles</h3>
        
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-850 space-y-3">
            <Compass className="w-6 h-6 text-brand-400" />
            <h5 className="font-bold text-slate-200 text-sm">Discipline-First Approach</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">Enforcing regular study routines, active classes attendance, and ethical code compliance daily.</p>
          </div>
          <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-850 space-y-3">
            <Award className="w-6 h-6 text-gold-400" />
            <h5 className="font-bold text-slate-200 text-sm">Qualified Faculty Desk</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">Lectures managed by experienced competitive coaches who specialize in CBSE and target formats.</p>
          </div>
          <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-850 space-y-3">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <h5 className="font-bold text-slate-200 text-sm">Continuous Evaluations</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">Weekly testing frameworks and detailed parent-teacher sync cards track performance gaps.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
