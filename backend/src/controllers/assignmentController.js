import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import StudentProfile from '../models/StudentProfile.js';
import ParentProfile from '../models/ParentProfile.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';

// @desc    Create a new Homework Assignment
// @route   POST /api/v1/assignments
// @access  Private (Teacher, Admin)
export const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, subject, className, dueDate, maxMarks, attachmentUrl } = req.body;

  const assignment = await Assignment.create({
    title,
    description,
    subject,
    class: className,
    dueDate: new Date(dueDate),
    maxMarks: maxMarks || 100,
    attachmentUrl,
    createdBy: req.user._id
  });

  res.status(201).json({ status: 'success', data: assignment });
});

// @desc    Get Assignments for Student (or Parents of the student)
// @route   GET /api/v1/assignments/my-class
// @access  Private (Student, Parent)
export const getStudentAssignments = asyncHandler(async (req, res) => {
  let studentId = '';
  let className = '';

  if (req.user.role === 'Student') {
    const student = await StudentProfile.findById(req.user.profileRef);
    if (!student) throw new AppError('Student profile not found', 404);
    studentId = student._id;
    className = student.currentClass;
  } else if (req.user.role === 'Parent') {
    const parent = await ParentProfile.findById(req.user.profileRef).populate('children');
    if (!parent || parent.children.length === 0) {
      throw new AppError('No children profiles found', 404);
    }
    const targetStudentId = req.query.studentId;
    let selectedChild = null;
    if (targetStudentId) {
      selectedChild = parent.children.find(child => child._id.toString() === targetStudentId.toString());
    }
    if (!selectedChild) {
      selectedChild = parent.children[0];
    }
    studentId = selectedChild._id;
    className = selectedChild.currentClass;
  } else if (req.user.role === 'Teacher' || req.user.role === 'Admin') {
    className = req.query.class || 'Class 11 Science';
  } else {
    throw new AppError('Not authorized to access student assignments', 403);
  }

  // Find all assignments for this class
  const assignments = await Assignment.find({ class: className }).sort({ dueDate: 1 });

  // Find submissions by this student if applicable
  const submissions = studentId ? await AssignmentSubmission.find({ student: studentId }) : [];

  // Merge submissions into assignments
  const data = assignments.map(assignment => {
    const submission = submissions.find(s => s.assignment.toString() === assignment._id.toString());
    return {
      _id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      class: assignment.class,
      dueDate: assignment.dueDate,
      maxMarks: assignment.maxMarks,
      attachmentUrl: assignment.attachmentUrl,
      submission: submission || null
    };
  });

  res.json({ status: 'success', data });
});

// @desc    Submit Assignment Submission
// @route   POST /api/v1/assignments/submit/:assignmentId
// @access  Private (Student)
export const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { submissionText, submissionUrl } = req.body;

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new AppError('Assignment not found', 404);

  const student = await StudentProfile.findById(req.user.profileRef);
  if (!student) throw new AppError('Student profile not found', 404);

  // Check if already submitted
  let submission = await AssignmentSubmission.findOne({ assignment: assignmentId, student: student._id });
  
  if (submission) {
    // Update existing submission
    submission.submissionText = submissionText;
    submission.submissionUrl = submissionUrl;
    submission.submittedAt = Date.now();
    submission.status = new Date() > assignment.dueDate ? 'Late' : 'Submitted';
    await submission.save();
  } else {
    // Create new submission
    submission = await AssignmentSubmission.create({
      assignment: assignmentId,
      student: student._id,
      submissionText,
      submissionUrl,
      status: new Date() > assignment.dueDate ? 'Late' : 'Submitted'
    });
  }

  res.status(200).json({ status: 'success', message: 'Homework submitted successfully', data: submission });
});

// @desc    Get Submissions for a specific Assignment
// @route   GET /api/v1/assignments/submissions/:assignmentId
// @access  Private (Teacher, Admin)
export const getAssignmentSubmissions = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;

  const submissions = await AssignmentSubmission.find({ assignment: assignmentId })
    .populate('student', 'firstName lastName rollNumber')
    .sort({ submittedAt: -1 });

  res.json({ status: 'success', data: submissions });
});

// @desc    Grade a Submission
// @route   POST /api/v1/assignments/grade/:submissionId
// @access  Private (Teacher, Admin)
export const gradeSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { score, feedback } = req.body;

  const submission = await AssignmentSubmission.findById(submissionId).populate('assignment');
  if (!submission) throw new AppError('Submission not found', 404);

  if (score < 0 || score > submission.assignment.maxMarks) {
    throw new AppError(`Score must be between 0 and maximum marks (${submission.assignment.maxMarks})`, 400);
  }

  submission.score = score;
  submission.feedback = feedback;
  submission.status = 'Graded';
  submission.gradedBy = req.user._id;

  await submission.save();

  res.json({ status: 'success', message: 'Submission graded successfully', data: submission });
});
