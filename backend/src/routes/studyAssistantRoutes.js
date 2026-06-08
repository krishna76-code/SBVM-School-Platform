/**
 * studyAssistantRoutes.js
 * Routes for the AI Study Assistant (PDF upload, RAG Q&A, artifact generation)
 * All routes require authentication. Students and Teachers can access.
 */

import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import {
  uploadStudyPDF,
  listStudyDocuments,
  getStudyDocument,
  deleteStudyDocument,
  generateSummary,
  generateMCQs,
  generateFlashcards,
  askDocumentQuestion
} from '../controllers/studyAssistantController.js';

const router = express.Router();

// ─── Multer config: in-memory storage (no disk writes) ────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB hard limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are accepted.'), false);
    }
  }
});

// ─── All routes require authentication ───────────────────────────────────────
router.use(protect);
router.use(authorize('Student', 'Teacher', 'Admin'));

// ─── Document Management ──────────────────────────────────────────────────────
router.post('/upload', upload.single('pdf'), uploadStudyPDF);
router.get('/documents', listStudyDocuments);
router.get('/documents/:id', getStudyDocument);
router.delete('/documents/:id', deleteStudyDocument);

// ─── AI Artifact Generation ───────────────────────────────────────────────────
router.post('/documents/:id/summary', generateSummary);
router.post('/documents/:id/mcqs', generateMCQs);
router.post('/documents/:id/flashcards', generateFlashcards);

// ─── RAG Q&A ─────────────────────────────────────────────────────────────────
router.post('/documents/:id/ask', askDocumentQuestion);

export default router;
