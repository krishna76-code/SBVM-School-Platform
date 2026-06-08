import mongoose from 'mongoose';

const AssignmentSubmissionSchema = new mongoose.Schema({
  assignment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Assignment', 
    required: true 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StudentProfile', 
    required: true 
  },
  submissionText: { 
    type: String 
  },
  submissionUrl: { 
    type: String // Cloudinary link or resource link
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['Submitted', 'Graded', 'Late'], 
    default: 'Submitted' 
  },
  score: { 
    type: Number 
  },
  feedback: { 
    type: String 
  },
  gradedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });

const AssignmentSubmission = mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);
export default AssignmentSubmission;
