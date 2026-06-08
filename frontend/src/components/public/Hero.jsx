import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36 bg-slate-950">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-[120px] pulse-glow"></div>
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[150px] pulse-glow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and description */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-gold-950/20 text-gold-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Admissions Open for Session 2026-27
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight font-sans leading-none text-slate-100">
              Shaping Leaders of <br className="hidden sm:inline" />
              <span className="gradient-text">Tomorrow's World.</span>
            </h1>
            
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
              At **Saraswati Bal Vidya Mandir (SBVM)** Sikar, we deliver a powerful combination of CBSE academic rigor, target-oriented preparation for competitive examinations (JEE, NEET, Olympiads), and core ethical grounding.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/ai-counselor"
                className="flex items-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase transition-all hover:scale-[1.02] shadow-lg shadow-gold-500/10"
              >
                AI Counselor & Scholarships <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="px-6 py-4 rounded-full border border-slate-700 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-600 text-slate-200 text-xs font-bold tracking-wider uppercase transition-all"
              >
                Register Online
              </Link>
            </div>

            {/* Quick trust metrics banner */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-900/80 pt-8 max-w-md">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-[10px] sm:text-xs text-slate-400 font-semibold leading-tight">CBSE<br />Affiliated</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-400 shrink-0" />
                <span className="text-[10px] sm:text-xs text-slate-400 font-semibold leading-tight">JEE/NEET<br />Prep Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-gold-400 shrink-0" />
                <span className="text-[10px] sm:text-xs text-slate-400 font-semibold leading-tight">Vedic Values<br />Education</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual illustration panel */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-500 to-gold-400 opacity-20 blur-xl"></div>
            
            <div className="relative glass-panel border border-slate-800/80 p-8 rounded-3xl space-y-6 text-left glow-brand">
              <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                <h4 className="font-bold text-slate-200 text-sm font-sans">SBVM Merit Index</h4>
                <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">Top Results</span>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-850 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold text-slate-200">JEE Advanced Selection</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Session 2025</span>
                  </div>
                  <span className="text-xl font-extrabold text-gold-400">12+ Qualifiers</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-850 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold text-slate-200">NEET Selection</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Session 2025</span>
                  </div>
                  <span className="text-xl font-extrabold text-brand-400">25+ Qualifiers</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-850 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold text-slate-200">CBSE Board Toppers</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Class 12 Marks</span>
                  </div>
                  <span className="text-xl font-extrabold text-emerald-400">99.4% Peak</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link 
                  to="/results" 
                  className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1 hover:underline"
                >
                  Explore Toppers Directory <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
