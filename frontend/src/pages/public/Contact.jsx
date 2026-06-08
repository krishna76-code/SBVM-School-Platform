import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Sparkles } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    className: 'Class 11 Science',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      alert('Thank you! Your inquiry has been received. Our admission desk will contact you soon.');
      setFormData({ name: '', email: '', phone: '', className: 'Class 11 Science', message: '' });
      setSubmitting(false);
    }, 1200);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-slate-950 pb-20 text-left">
      
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px] pulse-glow"></div>
        
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-950/20 px-3 py-1 rounded-full border border-gold-900/20">
            Reach Out To Us
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-100">
            Contact Saraswati Bal <br />
            <span className="gradient-text">Vidya Mandir Sikar</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
            Get in touch with our principal's office, boarding wardens, or registry desk. Fill out the quick query form.
          </p>
        </div>
      </section>

      {/* Main contact coordinates and inquiry form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Coordinates */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="font-bold text-slate-200 text-sm font-sans pb-2 border-b border-slate-850">Contact Information</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-300 block">Campus Address:</span>
                  <span className="text-slate-400 block leading-normal mt-0.5">Jaipur Road, Bypass Circle,<br />Sikar, Rajasthan, India - 332001</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-300 block">Admission Helpline:</span>
                  <span className="text-slate-400 block mt-0.5">+91 9111111111</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-300 block">Email Address:</span>
                  <span className="text-slate-400 block mt-0.5">admissions@sbvm.edu.in / info@sbvm.edu.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-300 block">Office Working Hours:</span>
                  <span className="text-slate-400 block mt-0.5">Monday to Saturday • 08:00 AM - 02:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map simulation */}
          <div className="glass-panel h-48 rounded-2xl border border-slate-800 overflow-hidden relative flex items-center justify-center bg-slate-900/40">
            <div className="absolute inset-0 bg-brand-950/10"></div>
            <div className="relative text-center space-y-2 px-4">
              <MapPin className="w-8 h-8 text-gold-400 mx-auto animate-bounce" />
              <span className="block font-bold text-xs text-slate-200">SBVM Sikar Campus Locator</span>
              <span className="block text-[10px] text-slate-500 font-semibold">Jaipur Road Bypass Corridor</span>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-block mt-2 text-[10px] text-brand-400 font-bold hover:underline"
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Query Form */}
        <div className="md:col-span-7 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <h3 className="font-bold text-slate-200 text-sm font-sans">Quick Inquiry Form</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Amit Sharma"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 99887 76655"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. name@email.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Grade of Interest</label>
                <select
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="Class 11 Science">Class 11 Science</option>
                  <option value="Class 11 Commerce">Class 11 Commerce</option>
                  <option value="Class 11 Arts">Class 11 Arts</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Nursery to Grade 8">Nursery to Grade 8</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Inquiry Details</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Ask about fee deadlines, hostel vacancies, bus routes..."
                rows="4"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-sm text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" /> {submitting ? 'Sending inquiry...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>

      </section>

    </div>
  );
};

export default Contact;
