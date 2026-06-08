import mongoose from 'mongoose';

const AdminProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true
  },
  department: {
    type: String,
    default: 'Administration'
  },
  designation: {
    type: String,
    default: 'System Administrator'
  }
}, { timestamps: true });

const AdminProfile = mongoose.model('AdminProfile', AdminProfileSchema);
export default AdminProfile;
