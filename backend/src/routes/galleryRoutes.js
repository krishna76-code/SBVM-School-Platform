import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
  generateGalleryCaption
} from '../controllers/galleryController.js';

const router = express.Router();

// Configure multer memory storage for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB hard limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP) are accepted.'), false);
    }
  }
});

// Public Endpoint (No Auth required)
router.get('/', getGalleryItems);

// Secured Administrative Endpoints (Admin only)
router.post('/', protect, authorize('Admin'), upload.single('image'), createGalleryItem);
router.delete('/:id', protect, authorize('Admin'), deleteGalleryItem);
router.post('/generate-caption', protect, authorize('Admin'), generateGalleryCaption);

export default router;
