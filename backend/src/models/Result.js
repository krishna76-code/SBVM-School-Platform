import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StudentProfile', 
    required: true 
  },
  class: { 
    type: String, 
    required: true 
  },
  academicYear: { 
    type: String, 
    required: true 
  },
  term: { 
    type: String, 
    enum: ['Quarterly', 'Half-Yearly', 'Annual'], 
    required: true 
  },
  subjects: [{
    subjectName: { 
      type: String, 
      required: true 
    },
    theoryMarks: { 
      type: Number, 
      required: true 
    },
    practicalMarks: { 
      type: Number, 
      default: 0 
    },
    maxMarks: { 
      type: Number, 
      default: 100 
    },
    grade: { 
      type: String 
    }
  }],
  totalPercentage: { 
    type: Number, 
    required: true 
  },
  overallGrade: { 
    type: String 
  },
  remarks: { 
    type: String 
  },
  publishedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const Result = mongoose.model('Result', ResultSchema);
export default Result;
