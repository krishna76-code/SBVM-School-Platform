import React from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';

const GalleryTab = ({
  galleryItems,
  gallerySearch,
  setGallerySearch,
  galleryCategory,
  setGalleryCategory,
  handleGallerySearch,
  handleDeleteGalleryItem,
  setShowGalleryModal,
  setNewGallery,
  setSelectedImageFile,
  setImagePreviewUrl
}) => {
  return (
    <div className="space-y-4 font-sans text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/20 p-4 rounded-2xl border border-slate-850">
        <form onSubmit={handleGallerySearch} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search title, tags, or caption..."
            value={gallerySearch}
            onChange={(e) => setGallerySearch(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none w-full sm:w-64"
          />
          <select
            value={galleryCategory}
            onChange={(e) => setGalleryCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Sports">Sports</option>
            <option value="Academics">Academics</option>
            <option value="Cultural">Cultural</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Events">Events</option>
            <option value="General">General</option>
          </select>
          <button type="submit" className="p-2 bg-brand-650 hover:bg-brand-600 rounded-xl text-white">
            <Search className="w-4 h-4" />
          </button>
        </form>
        <button
          onClick={() => {
            setNewGallery({ title: '', category: 'General', tags: '', caption: '' });
            setSelectedImageFile(null);
            setImagePreviewUrl('');
            setShowGalleryModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-bold text-white transition-all w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Add Event Image
        </button>
      </div>

      {/* Gallery Admin Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(!galleryItems || galleryItems.length === 0) ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-xs glass-panel rounded-2xl border border-slate-800">
            No gallery images found.
          </div>
        ) : (
          galleryItems.map((item) => (
            <div key={item._id} className="glass-panel border border-slate-850 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-800 transition-all">
              <div>
                <div className="h-40 overflow-hidden relative bg-slate-950 flex items-center justify-center">
                  <img src={item.imageUrl} alt={item.title} className="max-w-full max-h-full object-cover" />
                  <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-brand-300 bg-brand-950/80 px-2 py-0.5 rounded-full border border-brand-900/50">
                    {item.category}
                  </span>
                </div>
                <div className="p-4 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-200 line-clamp-1">{item.title}</h4>
                  {item.caption && <p className="text-[10px] text-slate-450 line-clamp-3 italic">"{item.caption}"</p>}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((t, i) => (
                        <span key={i} className="text-[8px] text-slate-500 bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-3 border-t border-slate-900 bg-slate-950/30 flex justify-end">
                <button
                  onClick={() => handleDeleteGalleryItem(item._id)}
                  className="p-1.5 rounded bg-rose-950/30 border border-rose-900/40 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GalleryTab;
