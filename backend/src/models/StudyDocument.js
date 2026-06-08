import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true }
}, { _id: true });

const mcqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String }
}, { _id: true });

const studyDocumentSchema = new mongoose.Schema({
  // Owner
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // File metadata
  fileName: { type: String, required: true },
  fileSize: { type: Number },                 // bytes
  pageCount: { type: Number },
  mimeType: { type: String, default: 'application/pdf' },

  // Full extracted plain text (stored for re-processing)
  rawText: { type: String },

  // Vector store reference
  // Each document's chunks are stored in Pinecone under this namespace
  pineconeNamespace: { type: String, required: true, unique: true },
  chunkCount: { type: Number, default: 0 },

  // AI-Generated artifacts
  summary: { type: String, default: null },
  flashcards: [flashcardSchema],
  mcqs: [mcqSchema],

  // Processing status
  status: {
    type: String,
    enum: ['processing', 'ready', 'error'],
    default: 'processing'
  },
  errorMessage: { type: String, default: null }
}, { timestamps: true });

const StudyDocument = mongoose.model('StudyDocument', studyDocumentSchema);
export default StudyDocument;
