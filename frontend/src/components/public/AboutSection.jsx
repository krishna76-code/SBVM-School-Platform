import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-20 bg-slate-900/30 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Vision & Principles description */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950/40 border border-brand-900/30 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <span>Institution Roots</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-sans tracking-tight">
              A Legacy of Academic and <br />
              <span className="gradient-text">Holistic Character Growth.</span>
            </h2>
            
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Saraswati Bal Vidya Mandir (SBVM) Sikar was founded with a singular commitment: to make premium quality CBSE curriculum education accessible while preparing students for the nation's toughest competitive examinations (JEE Advanced, NEET, and NTSE). 
            </p>
            
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Our educational framework balances technical curriculum requirements with a character-first environment. We believe in nurturing disciplined, responsible citizens who carry strong Indian values alongside modern technological competencies.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="flex items-center gap-1 text-xs font-bold text-gold-400 hover:text-gold-300 transition-all hover:underline hover:translate-x-0.5 inline-flex"
              >
                Learn More About Our Legacy <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Values grid cards */}
          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-6">
            
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-gold-400" />
              </div>
              <h4 className="font-bold text-slate-200 text-xs sm:text-sm font-sans">Academic Brilliance</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Continuous assessment framework, interactive smart classes, and highly personalized faculty attention.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
              </div>
              <h4 className="font-bold text-slate-200 text-xs sm:text-sm font-sans">Integrated Pedagogy</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Structured classrooms integrated directly with specialized JEE/NEET coaches and target syllabi.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 sm:col-span-2 space-y-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-bold text-slate-200 text-xs sm:text-sm font-sans">Vedic and Moral Character</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Focus on discipline, moral responsibilities, and values education ensuring grounded personal growth.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;
