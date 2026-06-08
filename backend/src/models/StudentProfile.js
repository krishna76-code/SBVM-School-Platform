import mongoose from 'mongoose';

const StudentProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  admissionNumber: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  rollNumber: { 
    type: String 
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  dob: { 
    type: Date, 
    required: true 
  },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other'], 
    required: true 
  },
  currentClass: { 
    type: String, 
    required: true 
  },
  section: { 
    type: String, 
    default: 'A' 
  },
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ParentProfile', 
    required: true 
  },
  attendanceRecords: [{
    date: { 
      type: Date, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['Present', 'Absent', 'Late', 'Excused'], 
      required: true 
    }
  }]
}, { timestamps: true });

const StudentProfile = mongoose.model('StudentProfile', StudentProfileSchema);
export default StudentProfile;
