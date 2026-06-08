import mongoose from 'mongoose';

const ApplicantProfileSchema = new mongoose.Schema({
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
    required: true 
  },
  parentName: { 
    type: String, 
    required: true 
  },
  parentEmail: { 
    type: String, 
    required: true 
  },
  parentPhone: { 
    type: String, 
    required: true 
  },
  previousSchool: { 
    type: String 
  },
  previousClass: { 
    type: String 
  },
  appliedClass: { 
    type: String, 
    required: true 
  },
  marksPercentage: { 
    type: Number 
  },
  scholarshipCategory: { 
    type: String 
  },
  feeConcessionPercentage: { 
    type: Number, 
    default: 0 
  },
  documents: {
    studentPhotoUrl: { type: String, default: '' },
    aadhaarUrl: { type: String, default: '' },
    marksheetUrl: { type: String, default: '' }
  },
  status: { 
    type: String, 
    enum: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'], 
    default: 'Draft' 
  },
  adminNotes: { 
    type: String 
  },
  tempCredentials: {
    parent: {
      email: { type: String },
      tempPassword: { type: String }
    },
    student: {
      email: { type: String },
      tempPassword: { type: String }
    }
  }
}, { timestamps: true });

const ApplicantProfile = mongoose.model('ApplicantProfile', ApplicantProfileSchema);
export default ApplicantProfile;
