import express from 'express';
import { 
  publishNotice, getNotices, logAttendance, getStudentAttendance, 
  publishResult, getStudentResults, getStudentsByClass,
  getAdminStats, getAdminStudents, getAdminParents, getAdminResults, 
  deleteResult, getAdminNotices, deleteNotice
} from '../controllers/academicController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/notices', protect, authorize('Admin', 'Teacher'), publishNotice);
router.get('/notices', protect, getNotices);

router.post('/attendance/log', protect, authorize('Teacher', 'Admin'), logAttendance);
router.get('/attendance/:studentId', protect, getStudentAttendance);

router.post('/results/upload', protect, authorize('Teacher', 'Admin'), publishResult);
router.get('/results/:studentId', protect, getStudentResults);

router.get('/students/class/:className', protect, authorize('Teacher', 'Admin'), getStudentsByClass);

// Admin Console API Endpoints
router.get('/admin/stats', protect, authorize('Admin'), getAdminStats);
router.get('/admin/students', protect, authorize('Admin', 'Teacher'), getAdminStudents);
router.get('/admin/parents', protect, authorize('Admin', 'Teacher'), getAdminParents);
router.get('/admin/results', protect, authorize('Admin', 'Teacher'), getAdminResults);
router.delete('/admin/results/:id', protect, authorize('Admin', 'Teacher'), deleteResult);
router.get('/admin/notices', protect, authorize('Admin', 'Teacher'), getAdminNotices);
router.delete('/admin/notices/:id', protect, authorize('Admin', 'Teacher'), deleteNotice);

export default router;
