import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BellRing, Send, Plus, RefreshCw } from 'lucide-react';
import API from '../services/api';

const Notices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [targetAudience, setTargetAudience] = useState('All');
  const [targetClass, setTargetClass] = useState('');

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/portal/notices');
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      await API.post('/portal/notices', {
        title,
        content,
        category,
        targetAudience: targetAudience === 'All' ? ['All'] : [targetAudience],
        targetClass: targetClass || undefined
      });

      alert('Notice published successfully!');
      setTitle('');
      setContent('');
      setCategory('General');
      setTargetAudience('All');
      setTargetClass('');
      setShowAddForm(false);
      fetchNotices();
    } catch (error) {
      console.error('Publish Notice Error:', error.message);
      alert('Error publishing notice.');
    }
  };

  const isPublisher = user.role === 'Admin' || user.role === 'Teacher';

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-100 flex items-center gap-2">
            <BellRing className="w-6 h-6 text-gold-400" /> Notice Board
          </h2>
          <p className="text-slate-400 text-xs mt-1">Official central school announcements and circular feeds.</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={fetchNotices}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all text-slate-400 hover:text-slate-200"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
          
          {isPublisher && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-xs text-white transition-all shadow-md shadow-brand-500/10"
            >
              <Plus className="w-4 h-4" /> Create Circular
            </button>
          )}
        </div>
      </div>

      {/* Creation form */}
      {showAddForm && isPublisher && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm font-sans pb-2 border-b border-slate-800">Publish New Notice</h3>
          
          <form onSubmit={handlePublish} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Notice Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Sports Day schedule"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Exam">Exam Notice</option>
                  <option value="Event">Event Notice</option>
                  <option value="Admission">Admission Notice</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="All">All Audiences</option>
                  <option value="Student">Students Only</option>
                  <option value="Parent">Parents Only</option>
                  <option value="Teacher">Teachers Only</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Class (Optional filter)</label>
                <input
                  type="text"
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  placeholder="e.g. Class 11 Science (Leave blank for all classes)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Announcement Body</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Details of the circular..."
                rows="4"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-white transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Publish Circular
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notice Feed */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="relative w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : notices.length === 0 ? (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-slate-500 text-xs">
          No notices found on noticeboard.
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice._id} className="glass-panel p-6 rounded-2xl border border-slate-850 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                    notice.category === 'Exam' ? 'bg-red-950 text-red-400 border-red-900/40' :
                    notice.category === 'Event' ? 'bg-purple-950 text-purple-400 border-purple-900/40' :
                    notice.category === 'Academic' ? 'bg-blue-950 text-blue-400 border-blue-900/40' :
                    'bg-slate-900 text-slate-400 border-slate-800' // General
                  }`}>
                    {notice.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-200 font-sans mt-2">{notice.title}</h3>
                </div>
                <span className="text-[10px] text-slate-500">{new Date(notice.createdAt).toLocaleDateString()}</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{notice.content}</p>

              <div className="flex gap-2 border-t border-slate-900 pt-3 text-[10px] text-slate-500">
                <span>By: <strong>{notice.publishedBy?.email || 'Principal Office'}</strong></span>
                {notice.targetClass && (
                  <>
                    <span>•</span>
                    <span>Target Class: <strong className="text-gold-400">{notice.targetClass}</strong></span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Notices;
