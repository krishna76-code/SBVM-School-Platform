import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['Admin', 'Teacher', 'Student', 'Parent', 'Guest'], 
    default: 'Guest' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  profileRef: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'roleRefModel' 
  },
  roleRefModel: { 
    type: String, 
    required: true, 
    enum: ['AdminProfile', 'TeacherProfile', 'StudentProfile', 'ParentProfile', 'ApplicantProfile'] 
  },
  lastLogin: { 
    type: Date 
  }
}, { timestamps: true });

UserSchema.index({ role: 1, isActive: 1 });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.model('User', UserSchema);
export default User;
