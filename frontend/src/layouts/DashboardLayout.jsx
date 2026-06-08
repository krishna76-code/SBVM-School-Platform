import React from 'react';
import { Navigate, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, LayoutDashboard, UserCheck, BookOpen, 
  FileSpreadsheet, ClipboardList, Bell, ShieldCheck, LogOut, User, Wallet 
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Generate Menu Items based on RBAC role
  const getMenuItems = () => {
    const role = user.role;
    const items = [];

    // All roles get central dashboard index
    items.push({ name: 'Overview', path: '/dashboard', icon: LayoutDashboard });

    if (role === 'Guest') {
      items.push({ name: 'Admission Form', path: '/dashboard/apply', icon: FileSpreadsheet });
      items.push({ name: 'AI Counselor', path: '/ai-counselor', icon: BookOpen });
    }

    if (role === 'Student') {
      items.push({ name: 'AI Study Assistant', path: '/dashboard/study-assistant', icon: BookOpen });
      items.push({ name: 'Assignments', path: '/dashboard/assignments', icon: BookOpen });
      items.push({ name: 'Report Cards', path: '/dashboard/results', icon: ClipboardList });
      items.push({ name: 'Attendance', path: '/dashboard/attendance', icon: UserCheck });
      items.push({ name: 'Fees Ledger', path: '/dashboard/fees', icon: Wallet });
      items.push({ name: 'Notice Board', path: '/dashboard/notices', icon: Bell });
    }

    if (role === 'Parent') {
      items.push({ name: 'Child Performance', path: '/dashboard/results', icon: ClipboardList });
      items.push({ name: 'Attendance Tracker', path: '/dashboard/attendance', icon: UserCheck });
      items.push({ name: 'Assignments', path: '/dashboard/assignments', icon: BookOpen });
      items.push({ name: 'Fees Ledger', path: '/dashboard/fees', icon: Wallet });
      items.push({ name: 'Notice Board', path: '/dashboard/notices', icon: Bell });
    }

    if (role === 'Teacher') {
      items.push({ name: 'Log Attendance', path: '/dashboard/teacher/attendance', icon: UserCheck });
      items.push({ name: 'Enter Marks', path: '/dashboard/teacher/marks', icon: ClipboardList });
      items.push({ name: 'Assignments', path: '/dashboard/assignments', icon: BookOpen });
      items.push({ name: 'Manage Notices', path: '/dashboard/notices', icon: Bell });
    }

    if (role === 'Admin') {
      items.push({ name: 'Admin Console', path: '/dashboard/admin', icon: ShieldCheck });
      items.push({ name: 'Manage Notices', path: '/dashboard/notices', icon: Bell });
      items.push({ name: 'Result Publisher', path: '/dashboard/teacher/marks', icon: ClipboardList });
      items.push({ name: 'Log Attendance', path: '/dashboard/teacher/attendance', icon: UserCheck });
      items.push({ name: 'Assignments', path: '/dashboard/assignments', icon: BookOpen });
    }

    // All roles get My Profile
    items.push({ name: 'My Profile', path: '/dashboard/profile', icon: User });

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar navigation */}
      <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2">
            <GraduationCap className="h-6 w-6 text-gold-400" />
            <span className="font-bold text-lg text-slate-100 font-sans tracking-wide">SBVM Portal</span>
          </div>

          <div className="px-4 py-6">
            <div className="flex items-center gap-3 px-3 py-2 bg-brand-950/20 border border-brand-900/30 rounded-xl mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                <User className="w-5 h-5 text-brand-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-200 truncate">
                  {user.role === 'Parent' ? (user.profile?.fatherName || 'Parent') : (user.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ''}` : 'SBVM User')}
                </p>
                <span className="text-xs text-gold-400 font-medium tracking-wide uppercase">{user.role}</span>
              </div>
            </div>

            {user.role === 'Parent' && user.profile?.children?.length > 0 && (
              <div className="px-3 py-2 bg-slate-900/40 border border-slate-800 rounded-xl mb-4 space-y-1.5">
                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">Select Active Child</label>
                <select
                  value={localStorage.getItem('activeChildId') || user.profile.children[0]?._id || user.profile.children[0]}
                  onChange={(e) => {
                    localStorage.setItem('activeChildId', e.target.value);
                    window.dispatchEvent(new Event('child-switched'));
                    window.location.reload();
                  }}
                  className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer font-semibold"
                >
                  {user.profile.children.map((child, idx) => (
                    <option key={idx} value={child._id || child}>
                      {child.firstName || 'Student'} {child.lastName || ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/10' 
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950/20 hover:text-red-300 rounded-xl text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main dashboard content container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 md:hidden glass-panel shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-gold-400" />
            <span className="font-bold text-slate-100 tracking-wide text-sm">SBVM Portal</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2 py-1 bg-brand-950 text-brand-400 rounded-md font-semibold border border-brand-900/40 uppercase">{user.role}</span>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950">
          {/* Mobile bottom nav helper */}
          <div className="md:hidden flex flex-col gap-3 pb-4 border-b border-slate-900 mb-6">
            {user.role === 'Parent' && user.profile?.children?.length > 0 && (
              <div className="flex items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Child:</span>
                <select
                  value={localStorage.getItem('activeChildId') || user.profile.children[0]?._id || user.profile.children[0]}
                  onChange={(e) => {
                    localStorage.setItem('activeChildId', e.target.value);
                    window.dispatchEvent(new Event('child-switched'));
                    window.location.reload();
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none cursor-pointer font-semibold"
                >
                  {user.profile.children.map((child, idx) => (
                    <option key={idx} value={child._id || child}>
                      {child.firstName || 'Student'} {child.lastName || ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex overflow-x-auto gap-2 scrollbar-none">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive 
                        ? 'bg-brand-600 text-white' 
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
