import express from 'express';
import { 
  getMyApplication, submitApplication, saveDraftApplication, 
  getAllApplications, updateApplicationStatus 
} from '../controllers/admissionController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { admissionFormSchema, updateStatusSchema } from '../utils/admissionValidation.js';

const router = express.Router();

router.get('/my-application', protect, authorize('Guest'), getMyApplication);
router.post('/apply', protect, authorize('Guest'), validate(admissionFormSchema), submitApplication);
router.put('/save-draft', protect, authorize('Guest'), saveDraftApplication);

router.get('/applications', protect, authorize('Admin'), getAllApplications);
router.patch('/applications/:id/status', protect, authorize('Admin'), validate(updateStatusSchema), updateApplicationStatus);

export default router;
