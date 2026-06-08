import ApplicantProfile from '../models/ApplicantProfile.js';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import ParentProfile from '../models/ParentProfile.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';

// @desc    Get current guest's application profile
// @route   GET /api/v1/admissions/my-application
// @access  Private (Guest)
export const getMyApplication = asyncHandler(async (req, res) => {
  const applicant = await ApplicantProfile.findById(req.user.profileRef);
  if (!applicant) {
    throw new AppError('Admission application record not found', 404);
  }
  res.json({ status: 'success', applicant });
});

// @desc    Submit admission application
// @route   POST /api/v1/admissions/apply
// @access  Private (Guest)
export const submitApplication = asyncHandler(async (req, res) => {
  const { 
    firstName, lastName, dob, gender, parentName, parentPhone, previousSchool, 
    previousClass, appliedClass, marksPercentage, documents 
  } = req.body;

  const applicant = await ApplicantProfile.findById(req.user.profileRef);
  if (!applicant) {
    throw new AppError('Applicant profile not found', 404);
  }

  applicant.firstName = firstName;
  applicant.lastName = lastName;
  applicant.dob = new Date(dob);
  applicant.gender = gender;
  applicant.parentName = parentName;
  applicant.parentPhone = parentPhone;
  applicant.previousSchool = previousSchool;
  applicant.previousClass = previousClass;
  applicant.appliedClass = appliedClass;
  applicant.marksPercentage = marksPercentage;
  
  if (documents) {
    applicant.documents = {
      studentPhotoUrl: documents.studentPhotoUrl || '',
      aadhaarUrl: documents.aadhaarUrl || '',
      marksheetUrl: documents.marksheetUrl || ''
    };
  }

  applicant.status = 'Submitted';
  await applicant.save();

  res.json({ status: 'success', message: 'Application submitted successfully', applicant });
});

// @desc    Save draft application progress
// @route   PUT /api/v1/admissions/save-draft
// @access  Private (Guest)
export const saveDraftApplication = asyncHandler(async (req, res) => {
  const applicant = await ApplicantProfile.findById(req.user.profileRef);
  if (!applicant) {
    throw new AppError('Applicant profile not found', 404);
  }

  // Merge provided fields
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      if (key === 'documents') {
        applicant.documents = {
          studentPhotoUrl: req.body.documents?.studentPhotoUrl || applicant.documents?.studentPhotoUrl || '',
          aadhaarUrl: req.body.documents?.aadhaarUrl || applicant.documents?.aadhaarUrl || '',
          marksheetUrl: req.body.documents?.marksheetUrl || applicant.documents?.marksheetUrl || ''
        };
      } else if (key === 'dob' && req.body.dob) {
        applicant.dob = new Date(req.body.dob);
      } else {
        applicant[key] = req.body[key];
      }
    }
  });

  applicant.status = 'Draft';
  await applicant.save();

  res.json({ status: 'success', message: 'Draft saved successfully', applicant });
});

// @desc    Get all applications (Admin only)
// @route   GET /api/v1/admissions/applications
// @access  Private (Admin)
export const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await ApplicantProfile.find().sort({ createdAt: -1 });
  res.json({ status: 'success', data: applications });
});

// @desc    Update application status (Admin only)
// @route   PATCH /api/v1/admissions/applications/:id/status
// @access  Private (Admin)
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes, feeConcessionPercentage } = req.body;
  const { id } = req.params;

  const applicant = await ApplicantProfile.findById(id);
  if (!applicant) {
    throw new AppError('Application dossier not found', 404);
  }

  applicant.status = status || applicant.status;
  if (adminNotes !== undefined) applicant.adminNotes = adminNotes;
  if (feeConcessionPercentage !== undefined) applicant.feeConcessionPercentage = feeConcessionPercentage;

  await applicant.save();

  // AUTO-PROVISIONING WORKFLOW: If status becomes "Approved", spawn permanent accounts
  if (applicant.status === 'Approved') {
    const parentUserExists = await User.findOne({ email: applicant.parentEmail });
    if (!parentUserExists) {
      // 1. Create Parent User Account
      const parentPassword = Math.random().toString(36).substring(2, 10);
      const parentUser = new User({
        email: applicant.parentEmail,
        phone: applicant.parentPhone,
        passwordHash: parentPassword, // Pre-save hooks hashes this
        role: 'Parent',
        roleRefModel: 'ParentProfile'
      });

      // 2. Create Parent Profile
      const parentProfile = await ParentProfile.create({
        user: parentUser._id,
        fatherName: applicant.parentName,
        motherName: 'Mother',
        emergencyContact: applicant.parentPhone,
        children: []
      });

      parentUser.profileRef = parentProfile._id;
      await parentUser.save();

      // 3. Create Student User Account
      const studentEmail = `student.${applicant.firstName.toLowerCase()}.${applicant.lastName.toLowerCase()}@sbvm.edu.in`;
      const studentPassword = Math.random().toString(36).substring(2, 10);
      const studentUser = new User({
        email: studentEmail,
        phone: applicant.parentPhone,
        passwordHash: studentPassword,
        role: 'Student',
        roleRefModel: 'StudentProfile'
      });

      // Roster details
      const admissionNum = 'SBVM' + Date.now().toString().slice(-6);
      const rollNum = Math.floor(1000 + Math.random() * 9000).toString();

      // 4. Create Student Profile
      const studentProfile = await StudentProfile.create({
        user: studentUser._id,
        admissionNumber: admissionNum,
        rollNumber: rollNum,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        dob: applicant.dob,
        gender: applicant.gender === 'Male' || applicant.gender === 'Female' ? applicant.gender : 'Other',
        currentClass: applicant.appliedClass,
        parent: parentProfile._id
      });

      studentUser.profileRef = studentProfile._id;
      await studentUser.save();

      // 5. Connect parent-child links
      parentProfile.children.push(studentProfile._id);
      await parentProfile.save();

      // 6. Save tempCredentials to ApplicantProfile
      applicant.tempCredentials = {
        parent: { email: applicant.parentEmail, tempPassword: parentPassword },
        student: { email: studentEmail, tempPassword: studentPassword }
      };
      await applicant.save();

      console.log(`Auto-Provisioning Success for Approved Candidate:`);
      console.log(`Parent: ${applicant.parentEmail} | Pass: ${parentPassword}`);
      console.log(`Student: ${studentEmail} | Pass: ${studentPassword}`);

      return res.json({ 
        status: 'success',
        message: 'Application approved. Student and Parent accounts have been provisioned.', 
        applicant,
        credentials: {
          parent: { email: applicant.parentEmail, tempPassword: parentPassword },
          student: { email: studentEmail, tempPassword: studentPassword }
        }
      });
    }
  }

  res.json({ status: 'success', message: 'Application status updated successfully', applicant });
});
