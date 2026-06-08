import mongoose from 'mongoose';

const aiCacheSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  context: {
    type: String,
    default: 'general', // Can be 'general' for Admission Counselor or a StudyDocument ObjectId string
    index: true
  },
  answer: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    default: 'Gemini'
  }
}, { timestamps: true });

// Create a compound index on context and question for efficient lookup
aiCacheSchema.index({ context: 1, question: 1 }, { unique: true });

const AiCache = mongoose.model('AiCache', aiCacheSchema);
export default AiCache;
