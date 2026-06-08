import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Bot } from 'lucide-react';

const ContactCTA = () => {
  return (
    <section className="py-20 bg-slate-900/30 border-t border-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-8 items-center text-left">
          
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-100">
              Have Questions? We're Here to Help.
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Whether you want to learn about fee payment timelines, CBSE class availability, hostel logistics, or school bus routes, our administrative desk and AI counselor are active 24/7.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 pt-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-gold-400" />
                </div>
                <span>+91 9111111111</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-gold-400" />
                </div>
                <span>admissions@sbvm.edu.in</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-gold-400" />
                </div>
                <span>Jaipur Road, Sikar, Rajasthan</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end gap-3 flex-wrap">
            <Link
              to="/ai-counselor"
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-gold-500/10"
            >
              <Bot className="w-4 h-4 shrink-0" /> Chat With Counselor
            </Link>
            <Link
              to="/contact"
              className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-600 text-slate-200 text-xs font-bold tracking-wider uppercase transition-all"
            >
              Reach Us
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactCTA;
