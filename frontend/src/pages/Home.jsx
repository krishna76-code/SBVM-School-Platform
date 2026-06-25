import React, { useEffect, useState } from 'react';
import API from '../services/api';

// Public Homepage Sections
import Hero from '../components/public/Hero';
import AboutSection from '../components/public/AboutSection';
import AchievementsSection from '../components/public/AchievementsSection';
import FacilitiesSection from '../components/public/FacilitiesSection';
import CampusGallery from '../components/public/CampusGallery';
import TestimonialsSection from '../components/public/TestimonialsSection';
import AdmissionBanner from '../components/public/AdmissionBanner';
import ContactCTA from '../components/public/ContactCTA';

const Home = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchPublicNotices = async () => {
      try {
        const { data } = await API.get('/portal/notices');
        // Filter public general notices
        setNotices(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching public notices:', error.message);
      }
    };
    fetchPublicNotices();
  }, []);

  return (
    <div className="overflow-hidden bg-slate-950">
      
      {/* Notice Ticker Board */}
      {notices.length > 0 && (
        <div className="bg-brand-950 border-b border-brand-900 text-xs py-2 px-4 overflow-hidden relative">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <span className="bg-gold-500 text-slate-950 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider text-[10px] shrink-0">
              Notice:
            </span>
            <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {notices.map(notice => (
                <span key={notice._id} className="text-brand-200 font-medium">
                  📢 {notice.title} - {notice.content.slice(0, 80)}...
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <Hero />

      {/* About School Section */}
      <AboutSection />

      {/* Achievements Band */}
      <AchievementsSection />

      {/* Campus Facilities Section */}
      <FacilitiesSection />

      {/* Campus Gallery Section */}
      <CampusGallery />

      {/* Community Testimonials Section */}
      <TestimonialsSection />

      {/* Admission Urgency Banner */}
      <AdmissionBanner />

      {/* Contact & Query CTA */}
      <ContactCTA />

    </div>
  );
};

export default Home;
