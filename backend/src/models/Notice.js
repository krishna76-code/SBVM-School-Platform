import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Academic', 'Event', 'Exam', 'Admission', 'General'], 
    default: 'General' 
  },
  targetAudience: [{ 
    type: String, 
    enum: ['All', 'Admin', 'Teacher', 'Student', 'Parent'] 
  }],
  targetClass: { 
    type: String 
  },
  attachmentUrl: { 
    type: String 
  },
  publishedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  expiryDate: { 
    type: Date 
  }
}, { timestamps: true });

const Notice = mongoose.model('Notice', NoticeSchema);
export default Notice;
