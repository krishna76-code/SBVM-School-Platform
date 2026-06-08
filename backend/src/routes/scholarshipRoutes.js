import express from 'express';
import { getRules, updateRule, evaluateEligibility } from '../controllers/scholarshipController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getRules);
router.post('/evaluate', evaluateEligibility);
router.put('/:id', protect, authorize('Admin'), updateRule);

export default router;
