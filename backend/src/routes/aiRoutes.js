import express from 'express';
import { getAdmissionResponse, getStudyHelp, calculateScholarship } from '../controllers/aiController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/admission-counselor', getAdmissionResponse);
router.post('/study-assistant', protect, authorize('Student'), getStudyHelp);
router.post('/scholarship-estimator', calculateScholarship);

export default router;
