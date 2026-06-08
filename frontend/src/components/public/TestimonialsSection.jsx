import React from 'react';
import { Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const list = [
    {
      quote: "The integrated JEE foundation classes at SBVM Sikar have helped my son secure admission to IIT Delhi. The teaching staff is extremely dedicated and professional.",
      author: "Suresh Kumar Sharma",
      role: "Parent of IIT-JEE Alumnus"
    },
    {
      quote: "Moving to SBVM Sikar was the best decision for my daughter. The school manages a great balance between academics, co-curricular sports, and values education.",
      author: "Dr. Ananya Choudhary",
      role: "Parent of Class 12 Topper"
    },
    {
      quote: "Our boarding facility has comfortable setups, clean mess meals, and dedicated night study sessions managed by warden teachers which helped me secure 98% in Boards.",
      author: "Aditya Soni",
      role: "Hostel Alumnus (Now at AIIMS Jodhpur)"
    }
  ];

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        
        {/* Title */}
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Community Feedback</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-100">Hear from Parents & Students</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Real reviews reflecting our academic culture and residential boarding success.</p>
        </div>

        {/* List of cards */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {list.map((item, idx) => (
            <div 
              key={idx} 
              className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-gold-400/20 shrink-0" />
                <p className="text-[11px] text-slate-300 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>
              <div className="border-t border-slate-900 pt-4 mt-4 text-[10px]">
                <span className="block font-bold text-slate-200">{item.author}</span>
                <span className="block text-slate-500 font-medium">{item.role}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
