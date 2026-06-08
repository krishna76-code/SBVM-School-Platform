import mongoose from 'mongoose';

const TeacherProfileSchema = new mongoose.Schema({
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
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  subjectsTaught: [{
    type: String
  }],
  classesAssigned: [{
    type: String
  }]
}, { timestamps: true });

const TeacherProfile = mongoose.model('TeacherProfile', TeacherProfileSchema);
export default TeacherProfile;
