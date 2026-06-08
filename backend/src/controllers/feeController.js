import Fee from '../models/Fee.js';
import StudentProfile from '../models/StudentProfile.js';
import ParentProfile from '../models/ParentProfile.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';

// @desc    Generate a Fee record for a student (Admin only)
// @route   POST /api/v1/portal/fees
// @access  Private (Admin)
export const generateFee = asyncHandler(async (req, res) => {
  const { studentId, term, amount, concession } = req.body;

  const student = await StudentProfile.findById(studentId);
  if (!student) {
    throw new AppError('Student profile not found', 404);
  }

  // Clear existing fee for that term and student to allow overwrite/regeneration
  await Fee.findOneAndDelete({ student: studentId, term });

  const fee = await Fee.create({
    student: studentId,
    term,
    amount,
    concession: concession || 0
  });

  res.status(201).json({ status: 'success', message: 'Fee record generated successfully', data: fee });
});

// @desc    Get all Fee records for a student (Secured)
// @route   GET /api/v1/portal/fees/:studentId
// @access  Private (Student, Parent, Admin)
export const getStudentFees = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Security Check: Enforce Role Permissions
  if (req.user.role === 'Student') {
    if (req.user.profileRef.toString() !== studentId) {
      throw new AppError('Access Denied: Cannot view other student records', 403);
    }
  } else if (req.user.role === 'Parent') {
    const parent = await ParentProfile.findById(req.user.profileRef);
    if (!parent || !parent.children.includes(studentId)) {
      throw new AppError('Access Denied: Selected student is not linked to your parent account', 403);
    }
  } else if (req.user.role !== 'Admin') {
    throw new AppError('Access Denied: Unauthorized role', 403);
  }

  const fees = await Fee.find({ student: studentId }).sort({ createdAt: -1 });
  res.json({ status: 'success', data: fees });
});

// @desc    Pay Fee Online (Simulation)
// @route   POST /api/v1/portal/fees/pay/:feeId
// @access  Private (Student, Parent)
export const payFeeSimulation = asyncHandler(async (req, res) => {
  const { feeId } = req.params;
  const { paymentMethod } = req.body;

  const fee = await Fee.findById(feeId);
  if (!fee) {
    throw new AppError('Fee record not found', 404);
  }

  // Security check for payment
  if (req.user.role === 'Student') {
    if (req.user.profileRef.toString() !== fee.student.toString()) {
      throw new AppError('Access Denied', 403);
    }
  } else if (req.user.role === 'Parent') {
    const parent = await ParentProfile.findById(req.user.profileRef);
    if (!parent || !parent.children.includes(fee.student)) {
      throw new AppError('Access Denied', 403);
    }
  }

  if (fee.status === 'Paid') {
    throw new AppError('This fee invoice has already been settled.', 400);
  }

  fee.status = 'Paid';
  fee.paymentMethod = paymentMethod || 'UPI (Simulated)';
  fee.paymentDate = new Date();
  fee.transactionId = 'TXN' + Math.floor(10000000 + Math.random() * 90000000).toString();

  await fee.save();

  res.json({ status: 'success', message: 'Simulated fee payment successful!', data: fee });
});
