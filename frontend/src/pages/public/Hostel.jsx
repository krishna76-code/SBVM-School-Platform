import React from 'react';
import { Home, ShieldCheck, HeartPulse, Clock, Coffee, DollarSign } from 'lucide-react';

const Hostel = () => {
  const amenities = [
    { title: 'Separate Accommodation Blocks', desc: 'Secure and separate wings for boys and girls with 24/7 security watch wardens.', icon: Home },
    { title: 'Safe & Hygienic Dining', desc: 'A modern kitchen dining hall serving fresh vegetarian meals three times daily plus evening milk and snacks.', icon: Coffee },
    { title: 'Health & Medical Support', desc: 'Regular visits by pediatricians and tie-ups with Sikar multi-specialty hospitals for emergency support.', icon: HeartPulse },
    { title: 'Supervised Studies', desc: 'Compulsory daily night self-study sessions monitored by resident teachers to clear student doubts.', icon: Clock }
  ];

  return (
    <div className="bg-slate-950 pb-20 text-left">
      
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px] pulse-glow"></div>
        
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-950/20 px-3 py-1 rounded-full border border-gold-900/20">
            Residential Campus
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-100">
            Hostel Life, Boarding & <br />
            <span className="gradient-text">Comfortable Amenities</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
            Explore the safe, disciplined, and nurturing residential boarding environment at Saraswati Bal Vidya Mandir Sikar.
          </p>
        </div>
      </section>

      {/* Accommodation Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
        {amenities.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="text-lg font-bold font-sans text-slate-200">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Weekly Menu & Fees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-8 items-start">
        
        {/* Mess food list */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-850 space-y-4">
          <h3 className="text-lg font-bold font-sans text-slate-200 pb-3 border-b border-slate-850 flex items-center gap-2">
            <Coffee className="w-5 h-5 text-gold-400" /> Sample Weekly Mess Menu
          </h3>

          <div className="space-y-3 text-xs leading-normal divide-y divide-slate-900">
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-slate-300">Breakfast (07:30 AM)</span>
              <span className="text-slate-400 text-right">Milk, Poha / Idli-Sambhar, Sprouts</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-slate-300">Lunch (01:40 PM)</span>
              <span className="text-slate-400 text-right">Chapati, Seasonal Veg, Dal, Rice, Salad, Dahi</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-slate-300">Evening Tea (05:00 PM)</span>
              <span className="text-slate-400 text-right">Tea / Hot Milk, Biscuits, Seasonal Fruits</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-slate-300">Dinner (08:00 PM)</span>
              <span className="text-slate-400 text-right">Chapati, Veg Curry, Kheer/Halwa, Khichdi</span>
            </div>
          </div>
        </div>

        {/* Boarding fees */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-850 space-y-4">
          <h3 className="text-lg font-bold font-sans text-slate-200 pb-3 border-b border-slate-850 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gold-400" /> Annual Boarding Fees
          </h3>

          <div className="space-y-3 text-xs leading-normal divide-y divide-slate-900">
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-slate-300">Grade 6 to 8 Boarding</span>
              <span className="text-slate-200 font-bold">₹75,000 / annum</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-slate-300">Grade 9 to 10 Boarding</span>
              <span className="text-slate-200 font-bold">₹85,000 / annum</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-slate-300">Grade 11 to 12 Boarding</span>
              <span className="text-slate-200 font-bold">₹95,000 / annum</span>
            </div>
          </div>
          
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 text-[10px] text-slate-500">
            *Boarding fees cover electricity backup, dynamic laundry support, and dining services. Tuition fees are billed separately.
          </div>
        </div>

      </section>

    </div>
  );
};

export default Hostel;
