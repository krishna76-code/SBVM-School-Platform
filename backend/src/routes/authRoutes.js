import express from 'express';
import { registerApplicant, loginUser, refreshToken, logoutUser, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { registerSchema, loginSchema } from '../utils/authValidation.js';

const router = express.Router();

router.post('/register-applicant', validate(registerSchema), registerApplicant);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

export default router;
