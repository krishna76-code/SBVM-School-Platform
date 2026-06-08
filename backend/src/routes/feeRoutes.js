import express from 'express';
import { generateFee, getStudentFees, payFeeSimulation } from '../controllers/feeController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('Admin'), generateFee);
router.get('/:studentId', protect, authorize('Student', 'Parent', 'Admin'), getStudentFees);
router.post('/pay/:feeId', protect, authorize('Student', 'Parent'), payFeeSimulation);

export default router;
