import express from 'express';
import { 
  createAssignment, getStudentAssignments, submitAssignment, 
  getAssignmentSubmissions, gradeSubmission 
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('Teacher', 'Admin'), createAssignment);
router.get('/my-class', protect, authorize('Student', 'Parent', 'Teacher', 'Admin'), getStudentAssignments);
router.post('/submit/:assignmentId', protect, authorize('Student'), submitAssignment);

router.get('/submissions/:assignmentId', protect, authorize('Teacher', 'Admin'), getAssignmentSubmissions);
router.post('/grade/:submissionId', protect, authorize('Teacher', 'Admin'), gradeSubmission);

export default router;
