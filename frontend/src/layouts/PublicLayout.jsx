import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, BookOpen, GraduationCap, LayoutDashboard, LogOut } from 'lucide-react';

const PublicLayout = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-gold-400" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-300 via-amber-200 to-brand-400 font-sans tracking-wide">
                  SBVM Sikar
                </span>
              </Link>
            </div>
            
            <nav className="hidden lg:flex items-center gap-5 text-[13px] font-semibold">
              <Link to="/" className="text-slate-300 hover:text-gold-400 transition-colors">Home</Link>
              <Link to="/about" className="text-slate-300 hover:text-gold-400 transition-colors">About Us</Link>
              <Link to="/academics" className="text-slate-300 hover:text-gold-400 transition-colors">Academics</Link>
              <Link to="/facilities" className="text-slate-300 hover:text-gold-400 transition-colors">Facilities</Link>
              <Link to="/results" className="text-slate-300 hover:text-gold-400 transition-colors">Results</Link>
              <Link to="/hostel" className="text-slate-300 hover:text-gold-400 transition-colors">Hostel</Link>
              <Link to="/admissions" className="text-slate-300 hover:text-gold-400 transition-colors">Admissions</Link>
              <Link to="/scholarship-estimator" className="text-slate-300 hover:text-gold-400 transition-colors">Scholarships</Link>
              <Link to="/contact" className="text-slate-300 hover:text-gold-400 transition-colors">Contact</Link>
              <Link to="/ai-counselor" className="text-slate-300 hover:text-gold-400 transition-colors flex items-center gap-1 font-bold text-gold-400">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                AI Counselor
              </Link>
              {user && (
                <Link to="/dashboard" className="text-slate-300 hover:text-gold-400 transition-colors flex items-center gap-1">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </Link>
              )}
            </nav>

             <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-900/50 hover:bg-red-950/20 hover:border-red-900 transition-all text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4 text-red-400" /> Logout
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-sm font-semibold transition-all shadow-md hover:shadow-brand-500/10"
                >
                  Sign In
                </Link>
              )}
            </div>

            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-300 hover:text-white focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="lg:hidden px-4 pt-2 pb-4 space-y-1 bg-slate-900/95 border-b border-slate-800 backdrop-blur-lg max-h-[80vh] overflow-y-auto">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              About Us
            </Link>
            <Link 
              to="/academics" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Academics
            </Link>
            <Link 
              to="/facilities" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Facilities
            </Link>
            <Link 
              to="/results" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Results
            </Link>
            <Link 
              to="/hostel" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Hostel
            </Link>
            <Link 
              to="/admissions" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Admissions
            </Link>
            <Link 
              to="/scholarship-estimator" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Scholarships
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Contact
            </Link>
            <Link 
              to="/ai-counselor" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-bold text-gold-400 hover:bg-slate-800"
            >
              AI Counselor
            </Link>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-950/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="block text-center w-full px-3 py-2 rounded-md text-base font-medium bg-brand-600 text-white"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Page Body */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Saraswati Bal Vidya Mandir (SBVM), Sikar. All rights reserved.</p>
          <p className="mt-2 text-slate-600">CBSE Affiliated Senior Secondary School • Integrated Coaching Hub</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
