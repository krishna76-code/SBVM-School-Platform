import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, BookOpen, Dumbbell, Microscope, School, ArrowRight } from 'lucide-react';

const FacilitiesSection = () => {
  const items = [
    { name: 'Advanced Science Labs', desc: 'Fully-equipped Physics, Chemistry, and Biology laboratories built for CBSE practical experiments.', icon: Microscope },
    { name: 'High-Tech Computer Lab', desc: 'Modern computing infrastructure supporting computer education and programming courses.', icon: Laptop },
    { name: 'Smart Classrooms', desc: 'Air-conditioned rooms integrated with interactive digital display screens and whiteboards.', icon: School },
    { name: 'Sports Complex', desc: 'Cricket nets, synthetic basketball courts, and indoor sports amenities supporting physical training.', icon: Dumbbell },
    { name: 'E-Library Resource Center', desc: 'A rich repository of books, journals, and digital modules encouraging reading habits.', icon: BookOpen }
  ];

  return (
    <section className="py-20 bg-slate-900/20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        
        {/* Title */}
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Institutional Amenities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-100">Modern Campus Infrastructure</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Creating an inspiring learning environment with premium facilities.</p>
        </div>

        {/* Grid List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 hover:translate-y-[-2px] transition-all space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-200 text-sm font-sans">{item.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <Link
            to="/facilities"
            className="flex items-center gap-1 text-xs font-bold text-gold-400 hover:text-gold-300 transition-all hover:underline hover:translate-x-0.5 inline-flex"
          >
            Explore Detailed Amenities Gallery <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FacilitiesSection;
