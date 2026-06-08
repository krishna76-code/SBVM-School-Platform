import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  class: { 
    type: String, 
    required: true // e.g. "Class 11 Science"
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  maxMarks: { 
    type: Number, 
    default: 100 
  },
  attachmentUrl: { 
    type: String 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', AssignmentSchema);
export default Assignment;
