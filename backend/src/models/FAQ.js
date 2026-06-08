import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

// Enable text search on the question field
faqSchema.index({ question: 'text' });

const FAQ = mongoose.model('FAQ', faqSchema);
export default FAQ;
