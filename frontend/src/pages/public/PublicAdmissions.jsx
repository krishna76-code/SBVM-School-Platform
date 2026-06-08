import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Sparkles, BookOpen, AlertCircle, FileText } from 'lucide-react';

const PublicAdmissions = () => {
  const steps = [
    { title: '1. Online Registration', desc: 'Create a Guest account on the SBVM portal to start filling out the application dossier.' },
    { title: '2. Consult Counselor', desc: 'Chat with our AI counselor or request a physical campus tour from administrative staff.' },
    { title: '3. Scholarship Assessment', desc: 'Enter academic merits and family income records to calculate concession brackets.' },
    { title: '4. Documents Submission', desc: 'Upload scanned copies of birth certificate, previous marks sheets, and proof files.' },
    { title: '5. Entrance & Interview', desc: 'Attend the Scheduled Parent-Student interaction round on campus (required for Grade 9-12).' },
    { title: '6. Account Provisioning', desc: 'Pay initial admission fees to receive permanent portal access codes via SMS/Email.' }
  ];

  return (
    <div className="bg-slate-950 pb-20 text-left">
      
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px] pulse-glow"></div>
        
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-950/20 px-3 py-1 rounded-full border border-gold-900/20">
            Admissions Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-100">
            Enrollment Procedures & <br />
            <span className="gradient-text">Academic Fee Structure</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
            Learn about enrollment rules, age parameters, mandatory document transcripts, and dynamic merit scholarships.
          </p>
        </div>
      </section>

      {/* Steps checklist */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h3 className="text-2xl font-bold font-sans text-slate-100 border-b border-slate-900 pb-3">Admissions Roadmap</h3>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-850 space-y-3">
              <h4 className="font-bold text-slate-200 text-sm font-sans">{step.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Documents checklist & Tuition fees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-8 items-start">
        
        {/* Documents checklist */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-850 space-y-4">
          <h3 className="text-lg font-bold font-sans text-slate-200 pb-3 border-b border-slate-850 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold-400" /> Mandatory Registration Documents
          </h3>

          <ul className="text-xs text-slate-400 space-y-3">
            <li className="flex gap-2">
              <span className="text-gold-400">✓</span> Student Birth Certificate scan
            </li>
            <li className="flex gap-2">
              <span className="text-gold-400">✓</span> Transfer Certificate (TC) from previous school (Original)
            </li>
            <li className="flex gap-2">
              <span className="text-gold-400">✓</span> Previous Class Marksheet transcript
            </li>
            <li className="flex gap-2">
              <span className="text-gold-400">✓</span> Passport size photographs (Student & Parents)
            </li>
            <li className="flex gap-2">
              <span className="text-gold-400">✓</span> Income proof certificate (For need-based scholarship review)
            </li>
            <li className="flex gap-2">
              <span className="text-gold-400">✓</span> Sports/co-curricular achievement credentials (If applying under Sports quota)
            </li>
          </ul>
        </div>

        {/* Tuition fees list */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-850 space-y-4">
          <h3 className="text-lg font-bold font-sans text-slate-200 pb-3 border-b border-slate-850 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-gold-400" /> Tuition Fees Structure
          </h3>

          <div className="space-y-2 text-xs leading-normal divide-y divide-slate-900">
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-slate-300">Nursery to KG</span>
              <span className="text-slate-400">₹25,000 / annum</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-slate-300">Grade 1 to 5</span>
              <span className="text-slate-400">₹40,000 / annum</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-slate-300">Grade 6 to 8</span>
              <span className="text-slate-400">₹55,000 / annum</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-slate-300">Grade 9 to 10</span>
              <span className="text-slate-400">₹70,000 / annum</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-slate-300">Grade 11 to 12 Science (PCM/PCB)</span>
              <span className="text-slate-400">₹95,000 / annum</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-slate-300">Grade 11 to 12 Commerce / Arts</span>
              <span className="text-slate-400">₹80,000 / annum</span>
            </div>
          </div>
        </div>

      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-10">
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-850 max-w-2xl mx-auto space-y-4">
          <h4 className="text-lg font-bold text-slate-200 font-sans">Ready to Begin the Application?</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">Create your applicant account today. Register in minutes and start filling out details from the comfort of your home.</p>
          <div className="pt-2 flex justify-center gap-4">
            <Link to="/register" className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all">Register Now</Link>
            <Link to="/scholarship-estimator" className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-200 text-xs font-bold tracking-wider uppercase transition-all">Evaluate Scholarship</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PublicAdmissions;
