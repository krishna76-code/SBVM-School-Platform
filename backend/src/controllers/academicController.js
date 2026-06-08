import Notice from '../models/Notice.js';
import Result from '../models/Result.js';
import StudentProfile from '../models/StudentProfile.js';
import ParentProfile from '../models/ParentProfile.js';
import ApplicantProfile from '../models/ApplicantProfile.js';

// ==================== NOTICE BOARD MODULE ====================

// @desc    Publish a new Notice / Announcement
// @route   POST /api/v1/portal/notices
// @access  Private (Admin, Teacher)
export const publishNotice = async (req, res) => {
  const { title, content, category, targetAudience, targetClass, attachmentUrl, expiryDate } = req.body;

  try {
    const notice = await Notice.create({
      title,
      content,
      category,
      targetAudience: targetAudience || ['All'],
      targetClass,
      attachmentUrl,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      publishedBy: req.user._id
    });
    res.status(201).json({ message: 'Notice published successfully', notice });
  } catch (error) {
    console.error('publishNotice Error:', error.message);
    res.status(500).json({ message: 'Server error publishing notice' });
  }
};

// @desc    Get all active Notices for current user
// @route   GET /api/v1/portal/notices
// @access  Private
export const getNotices = async (req, res) => {
  try {
    const role = req.user.role;
    let query = {
      $or: [
        { targetAudience: 'All' },
        { targetAudience: role }
      ],
      $and: [
        { 
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gt: new Date() } }
          ]
        }
      ]
    };

    // If role is Student or Parent, further filter by Class if targetClass is set
    if (role === 'Student') {
      const student = await StudentProfile.findById(req.user.profileRef);
      if (student) {
        query.$or.push({ targetClass: student.currentClass });
      }
    } else if (role === 'Parent') {
      const parent = await ParentProfile.findById(req.user.profileRef).populate('children');
      if (parent && parent.children.length > 0) {
        const classes = parent.children.map(child => child.currentClass);
        query.$or.push({ targetClass: { $in: classes } });
      }
    }

    const notices = await Notice.find(query).sort({ createdAt: -1 }).populate('publishedBy', 'email');
    res.json(notices);
  } catch (error) {
    console.error('getNotices Error:', error.message);
    res.status(500).json({ message: 'Server error fetching notices' });
  }
};


// ==================== ATTENDANCE MODULE ====================

// @desc    Record class attendance
// @route   POST /api/v1/portal/attendance/log
// @access  Private (Teacher, Admin)
export const logAttendance = async (req, res) => {
  const { className, date, records } = req.body; // records: Array of { studentId, status: 'Present'/'Absent' }

  try {
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0); // Normalize time to midnight

    for (const record of records) {
      await StudentProfile.findByIdAndUpdate(
        record.studentId,
        {
          $pull: { attendanceRecords: { date: attendanceDate } } // Clear previous logs for date
        }
      );

      await StudentProfile.findByIdAndUpdate(
        record.studentId,
        {
          $push: { 
            attendanceRecords: { date: attendanceDate, status: record.status } 
          }
        }
      );
    }

    res.json({ message: 'Attendance records updated successfully' });
  } catch (error) {
    console.error('logAttendance Error:', error.message);
    res.status(500).json({ message: 'Server error recording attendance' });
  }
};

// @desc    Get student attendance history
// @route   GET /api/v1/portal/attendance/:studentId
// @access  Private (Student, Parent, Teacher, Admin)
export const getStudentAttendance = async (req, res) => {
  try {
    const student = await StudentProfile.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Role verification
    if (req.user.role === 'Student' && req.user.profileRef.toString() !== student._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this student record' });
    }
    
    if (req.user.role === 'Parent') {
      const parent = await ParentProfile.findById(req.user.profileRef);
      if (!parent || !parent.children.includes(student._id)) {
        return res.status(403).json({ message: 'Access denied to this student record' });
      }
    }

    res.json(student.attendanceRecords);
  } catch (error) {
    console.error('getStudentAttendance Error:', error.message);
    res.status(500).json({ message: 'Server error fetching attendance logs' });
  }
};


// ==================== RESULT MANAGEMENT MODULE ====================

// @desc    Publish exam term results for a student
// @route   POST /api/v1/portal/results/upload
// @access  Private (Teacher, Admin)
export const publishResult = async (req, res) => {
  const { studentId, term, academicYear, subjects, remarks } = req.body;

  try {
    const student = await StudentProfile.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Calculate overall percentage and grade
    let totalObtained = 0;
    let totalMax = 0;
    const subjectsWithGrades = subjects.map(sub => {
      const percentage = (sub.theoryMarks + (sub.practicalMarks || 0)) / sub.maxMarks * 100;
      let grade = 'F';
      if (percentage >= 90) grade = 'A1';
      else if (percentage >= 80) grade = 'A2';
      else if (percentage >= 70) grade = 'B1';
      else if (percentage >= 60) grade = 'B2';
      else if (percentage >= 50) grade = 'C1';
      else if (percentage >= 40) grade = 'C2';
      else if (percentage >= 33) grade = 'D';

      totalObtained += (sub.theoryMarks + (sub.practicalMarks || 0));
      totalMax += sub.maxMarks;

      return { ...sub, grade };
    });

    const totalPercentage = (totalObtained / totalMax) * 100;
    let overallGrade = 'Fail';
    if (totalPercentage >= 33) overallGrade = 'Pass';

    // Clear old result matching term/year for student to allow overwrites
    await Result.findOneAndDelete({ student: studentId, term, academicYear });

    const result = await Result.create({
      student: studentId,
      class: student.currentClass,
      academicYear,
      term,
      subjects: subjectsWithGrades,
      totalPercentage: Math.round(totalPercentage * 100) / 100,
      overallGrade,
      remarks
    });

    res.status(201).json({ message: 'Result published successfully', result });
  } catch (error) {
    console.error('publishResult Error:', error.message);
    res.status(500).json({ message: 'Server error publishing marks' });
  }
};

// @desc    Get term results of a student
// @route   GET /api/v1/portal/results/:studentId
// @access  Private (Student, Parent, Teacher, Admin)
export const getStudentResults = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await StudentProfile.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Role verification
    if (req.user.role === 'Student' && req.user.profileRef.toString() !== student._id.toString()) {
      return res.status(403).json({ message: 'Access denied to these results' });
    }
    
    if (req.user.role === 'Parent') {
      const parent = await ParentProfile.findById(req.user.profileRef);
      if (!parent || !parent.children.includes(student._id)) {
        return res.status(403).json({ message: 'Access denied to these results' });
      }
    }

    const results = await Result.find({ student: studentId }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    console.error('getStudentResults Error:', error.message);
    res.status(500).json({ message: 'Server error fetching student results' });
  }
};

// @desc    Get list of students in a class
// @route   GET /api/v1/portal/students/class/:className
// @access  Private (Teacher, Admin)
export const getStudentsByClass = async (req, res) => {
  try {
    const students = await StudentProfile.find({ currentClass: req.params.className }).sort({ firstName: 1 });
    res.json(students);
  } catch (error) {
    console.error('getStudentsByClass Error:', error.message);
    res.status(500).json({ message: 'Server error fetching class students' });
  }
};

// ==================== ADMIN DASHBOARD MODULES ====================

// @desc    Get Admin Overview Stats & Recent Activity
// @route   GET /api/v1/portal/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res) => {
  try {
    const totalApplications = await ApplicantProfile.countDocuments();
    const totalStudents = await StudentProfile.countDocuments();
    const pendingApplications = await ApplicantProfile.countDocuments({ status: 'Submitted' });

    // Latest entries for activity tracking
    const recentApplications = await ApplicantProfile.find().sort({ createdAt: -1 }).limit(5);
    const recentNotices = await Notice.find().sort({ createdAt: -1 }).limit(5);
    const recentResults = await Result.find().sort({ createdAt: -1 }).limit(5).populate('student', 'firstName lastName');

    const activities = [];
    recentApplications.forEach(app => {
      activities.push({
        type: 'Admission',
        description: `New application submitted by ${app.firstName} ${app.lastName} for ${app.appliedClass}`,
        date: app.createdAt
      });
    });
    recentNotices.forEach(notice => {
      activities.push({
        type: 'Notice',
        description: `Notice "${notice.title}" published for ${notice.targetAudience.join(', ')}`,
        date: notice.createdAt
      });
    });
    recentResults.forEach(resItem => {
      activities.push({
        type: 'Result',
        description: `Result published for student ${resItem.student?.firstName || 'N/A'} ${resItem.student?.lastName || 'N/A'} - Term ${resItem.term}`,
        date: resItem.createdAt
      });
    });

    // Sort descending by date and limit to 5
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentActivity = activities.slice(0, 5);

    res.json({
      totalApplications,
      totalStudents,
      pendingApplications,
      recentActivity
    });
  } catch (error) {
    console.error('getAdminStats Error:', error.message);
    res.status(500).json({ message: 'Server error fetching admin stats' });
  }
};

// @desc    Get Paginated Student Directory
// @route   GET /api/v1/portal/admin/students
// @access  Private (Admin, Teacher)
export const getAdminStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const className = req.query.class || '';

    const query = {};
    if (className) {
      query.currentClass = className;
    }
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await StudentProfile.countDocuments(query);
    const students = await StudentProfile.find(query)
      .populate('parent', 'fatherName emergencyContact')
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      students,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('getAdminStudents Error:', error.message);
    res.status(500).json({ message: 'Server error fetching students list' });
  }
};

// @desc    Get Paginated Parent Directory
// @route   GET /api/v1/portal/admin/parents
// @access  Private (Admin, Teacher)
export const getAdminParents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = {};
    if (search) {
      query.$or = [
        { fatherName: { $regex: search, $options: 'i' } },
        { motherName: { $regex: search, $options: 'i' } },
        { emergencyContact: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await ParentProfile.countDocuments(query);
    const parents = await ParentProfile.find(query)
      .populate('children', 'firstName lastName currentClass')
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      parents,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('getAdminParents Error:', error.message);
    res.status(500).json({ message: 'Server error fetching parents directory' });
  }
};

// @desc    Get Paginated Results Archive
// @route   GET /api/v1/portal/admin/results
// @access  Private (Admin, Teacher)
export const getAdminResults = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const className = req.query.class || '';
    const term = req.query.term || '';

    let studentQuery = {};
    if (search) {
      studentQuery.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    let studentIds = [];
    if (search) {
      const matchingStudents = await StudentProfile.find(studentQuery).select('_id');
      studentIds = matchingStudents.map(s => s._id);
    }

    const query = {};
    if (search) {
      query.student = { $in: studentIds };
    }
    if (className) {
      query.class = className;
    }
    if (term) {
      query.term = term;
    }

    const skip = (page - 1) * limit;
    const total = await Result.countDocuments(query);
    const results = await Result.find(query)
      .populate('student', 'firstName lastName rollNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      results,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('getAdminResults Error:', error.message);
    res.status(500).json({ message: 'Server error fetching results list' });
  }
};

// @desc    Delete a Result record
// @route   DELETE /api/v1/portal/admin/results/:id
// @access  Private (Admin, Teacher)
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result record not found' });
    }
    res.json({ message: 'Result record deleted successfully' });
  } catch (error) {
    console.error('deleteResult Error:', error.message);
    res.status(500).json({ message: 'Server error deleting result' });
  }
};

// @desc    Get Paginated Notices
// @route   GET /api/v1/portal/admin/notices
// @access  Private (Admin, Teacher)
export const getAdminNotices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';

    const query = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Notice.countDocuments(query);
    const notices = await Notice.find(query)
      .populate('publishedBy', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      notices,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('getAdminNotices Error:', error.message);
    res.status(500).json({ message: 'Server error fetching notices list' });
  }
};

// @desc    Delete a Notice record
// @route   DELETE /api/v1/portal/admin/notices/:id
// @access  Private (Admin, Teacher)
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice record not found' });
    }
    res.json({ message: 'Notice record deleted successfully' });
  } catch (error) {
    console.error('deleteNotice Error:', error.message);
    res.status(500).json({ message: 'Server error deleting notice' });
  }
};
