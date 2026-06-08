import mongoose from 'mongoose';

const ParentProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  fatherName: { 
    type: String, 
    required: true 
  },
  motherName: { 
    type: String, 
    required: true 
  },
  occupation: { 
    type: String 
  },
  emergencyContact: { 
    type: String, 
    required: true 
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  children: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StudentProfile' 
  }]
}, { timestamps: true });

const ParentProfile = mongoose.model('ParentProfile', ParentProfileSchema);
export default ParentProfile;
