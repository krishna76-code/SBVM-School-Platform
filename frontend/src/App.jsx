import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import AdmissionCounselor from './pages/AdmissionCounselor';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/public/About';
import Academics from './pages/public/Academics';
import FacilitiesPage from './pages/public/FacilitiesPage';
import PublicResults from './pages/public/PublicResults';
import Hostel from './pages/public/Hostel';
import PublicAdmissions from './pages/public/PublicAdmissions';
import Contact from './pages/public/Contact';
import ScholarshipEstimator from './pages/public/ScholarshipEstimator';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import ApplyAdmission from './pages/ApplyAdmission';
import ReportCards from './pages/ReportCards';
import Attendance from './pages/Attendance';
import StudyAssistant from './pages/StudyAssistant';
import Notices from './pages/Notices';
import Assignments from './pages/Assignments';
import Profile from './pages/Profile';
import Fees from './pages/Fees';

// Teacher / Admin Pages
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherMarks from './pages/TeacherMarks';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="academics" element={<Academics />} />
            <Route path="facilities" element={<FacilitiesPage />} />
            <Route path="results" element={<PublicResults />} />
            <Route path="hostel" element={<Hostel />} />
            <Route path="admissions" element={<PublicAdmissions />} />
            <Route path="contact" element={<Contact />} />
            <Route path="scholarship-estimator" element={<ScholarshipEstimator />} />
            <Route path="ai-counselor" element={<AdmissionCounselor />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="apply" element={<ApplyAdmission />} />
            <Route path="results" element={<ReportCards />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="study-assistant" element={<StudyAssistant />} />
            <Route path="notices" element={<Notices />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="profile" element={<Profile />} />
            <Route path="fees" element={<Fees />} />
            
            {/* Teacher Workflows */}
            <Route path="teacher/attendance" element={<TeacherAttendance />} />
            <Route path="teacher/marks" element={<TeacherMarks />} />

            {/* Admin Workflows */}
            <Route path="admin" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
