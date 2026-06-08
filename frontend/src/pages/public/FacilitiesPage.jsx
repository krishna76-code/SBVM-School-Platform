import React from 'react';
import { Microscope, Laptop, School, Dumbbell, BookOpen, ShieldAlert } from 'lucide-react';

const FacilitiesPage = () => {
  const sections = [
    {
      title: 'Advanced Science Laboratories',
      desc: 'Our Physics, Chemistry, and Biology laboratories are spacious, well-ventilated, and strictly adhere to CBSE safety protocols. Equipped with advanced microscopes, chemical units, and physical models to ensure immersive hands-on understanding of scientific concepts.',
      icon: Microscope,
      highlights: ['Individual equipment kits', 'Trained lab assistants', 'Interactive experimental modules']
    },
    {
      title: 'High-Performance Coding & Computing Center',
      desc: 'Equipped with individual computers for students, high-speed fiber internet, and software packages. We host classes for computer science, data structures, and web development fundamentals.',
      icon: Laptop,
      highlights: ['1:1 computer to student ratio', 'High-speed fiber connectivity', 'Preloaded coding editors and software']
    },
    {
      title: 'Smart AC Classrooms',
      desc: 'Every classroom is fully air-conditioned and fitted with premium interactive digital panels. Teachers utilize 3D visualization tools to explain complex geography or biology concepts, making class hours highly engaging.',
      icon: School,
      highlights: ['Premium interactive screens', 'Air conditioning', 'Ergonomic seating arrangements']
    },
    {
      title: 'Multi-Sports Complex',
      desc: 'Encouraging physical training and team sports. We feature cricket practice pitches, synthetic basketball courts, badminton arenas, and swimming training under qualified coaches.',
      icon: Dumbbell,
      highlights: ['Net practice pitches', 'Standard synthetic courts', 'Dedicated physical trainers']
    },
    {
      title: 'E-Library Resource Hub',
      desc: 'Our library hosts over 5,000 reference books, competitive preparation manuals (JEE, NEET, Olympiads), novels, and newspapers. It also features a digital section for academic catalog searches.',
      icon: BookOpen,
      highlights: ['Extensive books registry', 'Silent study zones', 'Digital reference lookup terminals']
    },
    {
      title: 'Safety, Security & GPS Transport',
      desc: 'Safety is paramount. The campus is monitored 24/7 by CCTV security. Our school bus network covers Sikar district and features real-time GPS tracking and SMS arrival alerts for parents.',
      icon: ShieldAlert,
      highlights: ['24/7 CCTV surveillance', 'GPS tracked buses', 'Active SMS arrival notifications']
    }
  ];

  return (
    <div className="bg-slate-950 pb-20 text-left">
      
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px] pulse-glow"></div>
        
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-950/20 px-3 py-1 rounded-full border border-gold-900/20">
            Campus Infrastructure
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-100">
            A Smart Campus Built for <br />
            <span className="gradient-text">Scholastic Brilliance</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
            Explore the state-of-the-art facilities, specialized labs, transport systems, and security grids at SBVM Sikar.
          </p>
        </div>
      </section>

      {/* Facilities detail grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="text-lg font-bold font-sans text-slate-200">{sec.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {sec.desc}
                </p>
              </div>

              <div className="border-t border-slate-900 pt-4 mt-2">
                <ul className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs text-slate-500 font-semibold">
                  {sec.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0"></span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
};

export default FacilitiesPage;
