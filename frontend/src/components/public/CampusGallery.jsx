import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Eye, Tag, Calendar, Sparkles } from 'lucide-react';
import API from '../../services/api';

const CampusGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = ['All', 'Sports', 'Academics', 'Cultural', 'Infrastructure', 'Events', 'General'];

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const { data } = await API.get('/gallery');
        setItems(data.data || []);
      } catch (err) {
        console.error('Error fetching gallery items:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Filter items based on selected category
  const filteredItems = category === 'All' 
    ? items 
    : items.filter(item => item.category === category);

  // Lightbox handlers
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const showPrev = (e) => {
    e.stopPropagation();
    if (lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    } else {
      setLightboxIndex(filteredItems.length - 1);
    }
  };

  const showNext = (e) => {
    e.stopPropagation();
    if (lightboxIndex < filteredItems.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    } else {
      setLightboxIndex(0);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') showPrev(e);
      if (e.key === 'ArrowRight') showNext(e);
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        
        {/* Title Block */}
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center justify-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" /> Campus Life & Events
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-100">
            A Glimpse Into <span className="gradient-text">SBVM Excellence</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Explore our state-of-the-art facilities, historical milestones, student accomplishments, and cultural festivals.
          </p>
        </div>

        {/* Categories Tabs Filter */}
        <div className="flex flex-wrap justify-center gap-2 bg-slate-900/30 p-1.5 rounded-2xl border border-slate-800/60 max-w-3xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setLightboxIndex(null); // Reset lightbox to prevent index errors
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                category === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-brand-600/30 border-t-brand-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 text-slate-600 text-xs glass-panel rounded-2xl max-w-md mx-auto">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
            No campus photos found for this category.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 transition-all duration-500">
            {filteredItems.map((item, idx) => (
              <div
                key={item._id}
                onClick={() => openLightbox(idx)}
                className="break-inside-avoid group relative overflow-hidden rounded-2xl glass-panel border border-slate-800/80 hover:border-brand-500/50 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-brand-500/5 flex flex-col"
              >
                <div className="overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Hover overlay with details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-350 flex flex-col justify-end p-4 text-left">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-brand-300 bg-brand-950/80 px-2 py-0.5 rounded-full w-fit mb-2 border border-brand-900/50">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{item.title}</h4>
                    {item.caption && (
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 font-medium leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                    <span className="text-[9px] text-slate-500 mt-2 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> View Large Photo
                    </span>
                  </div>
                </div>
                {/* Standard visible title block underneath for clean spacing (or masonry display) */}
                <div className="p-4 text-left space-y-1 bg-slate-950/20 border-t border-slate-900">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200 truncate pr-2">{item.title}</h4>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  {item.caption && (
                    <p className="text-[10px] text-slate-450 line-clamp-2 font-medium">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox full-screen modal */}
      {activeItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/80 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev Navigation */}
          <button
            onClick={showPrev}
            className="absolute left-4 p-3 rounded-full bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-850 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Navigation */}
          <button
            onClick={showNext}
            className="absolute right-4 p-3 rounded-full bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-850 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content Container */}
          <div 
            className="w-full max-w-5xl bg-slate-950/60 border border-slate-900 rounded-3xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Box */}
            <div className="flex-1 bg-slate-950/40 flex items-center justify-center min-h-[30vh] md:min-h-0 relative overflow-hidden">
              <img 
                src={activeItem.imageUrl} 
                alt={activeItem.title} 
                className="max-w-full max-h-[40vh] md:max-h-[80vh] object-contain p-2"
              />
            </div>

            {/* Information Details Panel */}
            <div className="w-full md:w-80 bg-slate-900/60 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-900 overflow-y-auto max-h-[40vh] md:max-h-[85vh] text-left space-y-6">
              <div className="space-y-4">
                {/* Category Badge & Date */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-400 bg-brand-950/40 border border-brand-900/50 px-2.5 py-1 rounded-full">
                    {activeItem.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(activeItem.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-extrabold text-slate-100 leading-snug font-sans">
                  {activeItem.title}
                </h3>

                {/* AI Caption */}
                {activeItem.caption && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-gold-400 flex items-center gap-1 font-sans">
                      <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" /> AI Caption Description
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-950/40 p-4 rounded-2xl border border-slate-850/60 italic">
                      "{activeItem.caption}"
                    </p>
                  </div>
                )}
              </div>

              {/* Tags and Footer */}
              <div className="space-y-4 pt-4 border-t border-slate-850/60">
                {activeItem.tags && activeItem.tags.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Metadata Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeItem.tags.map((t, i) => (
                        <span key={i} className="text-[9px] font-medium text-slate-400 bg-slate-950 border border-slate-850 px-2 py-0.5 rounded-lg">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-[9px] text-slate-600 font-semibold uppercase">
                  Published by system admin
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CampusGallery;
