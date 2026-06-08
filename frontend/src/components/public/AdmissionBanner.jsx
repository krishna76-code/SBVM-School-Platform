import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const AdmissionBanner = () => {
  return (
    <section className="py-10 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 bg-gradient-to-r from-brand-900 to-indigo-950 border border-brand-850 shadow-2xl">
          {/* Radial Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold-500/10 blur-[80px]"></div>

          <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center text-left">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/40 border border-gold-900/30 text-gold-400 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                Registrations Now Open
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-100 leading-snug">
                Join Sikar's Premier CBSE & Integrated Coaching Ecosystem
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
                Start your online admission application, track document verification status in real-time, and calculate potential scholarship brackets instantly.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-wrap gap-3 md:justify-end">
              <Link
                to="/register"
                className="px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-gold-500/15"
              >
                Apply Online
              </Link>
              <Link
                to="/ai-counselor"
                className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-600 text-slate-200 text-xs font-bold tracking-wider uppercase transition-all"
              >
                Check Scholarships
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AdmissionBanner;
