import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import { env } from './src/config/env.js';
import logger from './src/utils/logger.js';

import authRoutes from './src/routes/authRoutes.js';
import admissionRoutes from './src/routes/admissionRoutes.js';
import academicRoutes from './src/routes/academicRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import assignmentRoutes from './src/routes/assignmentRoutes.js';
import feeRoutes from './src/routes/feeRoutes.js';
import scholarshipRoutes from './src/routes/scholarshipRoutes.js';
import studyAssistantRoutes from './src/routes/studyAssistantRoutes.js';
import galleryRoutes from './src/routes/galleryRoutes.js';
import errorMiddleware from './src/middlewares/errorMiddleware.js';

import User from './src/models/User.js';
import AdminProfile from './src/models/AdminProfile.js';
import ScholarshipRule from './src/models/ScholarshipRule.js';
import { seedProspectus } from './src/services/chroma.service.js';

// Connect to Database
await connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// API Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each IP to 30 queries per hour
  message: { message: 'AI query limit reached for this hour. Please try again later.' }
});

app.use('/api/', generalLimiter);
app.use('/api/v1/ai/', aiLimiter);
app.use('/api/v1/study/', aiLimiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admissions', admissionRoutes);
app.use('/api/v1/portal', academicRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/study', studyAssistantRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/portal/fees', feeRoutes);
app.use('/api/v1/scholarships', scholarshipRoutes);
app.use('/api/v1/gallery', galleryRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Global Error Handler
app.use(errorMiddleware);

// Port configuration
const PORT = env.PORT;

// Seed Initial Admin User if none exists
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'Admin' });
    if (!adminExists) {
      logger.info('No Admin found. Seeding initial System Administrator...');
      
      const userId = new mongoose.Types.ObjectId();
      const adminProfile = await AdminProfile.create({
        user: userId,
        employeeId: 'ADM001',
        department: 'Executive Office',
        designation: 'Director of Operations'
      });

      await User.create({
        _id: userId,
        email: env.SEED_ADMIN_EMAIL,
        phone: '9111111111',
        passwordHash: env.SEED_ADMIN_PASSWORD, // Pre-save hook hashes password
        role: 'Admin',
        profileRef: adminProfile._id,
        roleRefModel: 'AdminProfile'
      });

      logger.info('ADMIN SEEDED SUCCESSFULLY', { email: env.SEED_ADMIN_EMAIL });
    }
  } catch (error) {
    logger.error('Error seeding admin', { error: error.message });
  }
};

const seedScholarships = async () => {
  try {
    const rulesCount = await ScholarshipRule.countDocuments();
    if (rulesCount === 0) {
      logger.info('No Scholarship Rules found. Seeding initial rule templates...');
      
      await ScholarshipRule.create([
        {
          classRange: 'Junior (Nursery-8)',
          boardTiers: [
            { minScore: 90, concession: 20 },
            { minScore: 85, concession: 15 }
          ],
          entranceTiers: [
            { minScore: 85, concession: 15 }
          ],
          sportsNationalConcession: 25,
          sportsStateConcession: 15,
          incomeBelow25kConcession: 15,
          incomeBelow50kConcession: 10,
          maxTotalConcession: 75,
          eligiblePrograms: [
            'Nursery', 'LKG', 'UKG',
            'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
            'Class 6', 'Class 7', 'Class 8'
          ]
        },
        {
          classRange: 'Secondary (9-10)',
          boardTiers: [
            { minScore: 92, concession: 30 },
            { minScore: 88, concession: 20 }
          ],
          entranceTiers: [
            { minScore: 88, concession: 25 }
          ],
          sportsNationalConcession: 25,
          sportsStateConcession: 15,
          incomeBelow25kConcession: 15,
          incomeBelow50kConcession: 10,
          maxTotalConcession: 75,
          eligiblePrograms: ['Class 9', 'Class 10']
        },
        {
          classRange: 'Senior Secondary (11-12)',
          boardTiers: [
            { minScore: 95, concession: 50 },
            { minScore: 90, concession: 30 },
            { minScore: 85, concession: 20 }
          ],
          entranceTiers: [
            { minScore: 90, concession: 40 },
            { minScore: 80, concession: 25 }
          ],
          sportsNationalConcession: 25,
          sportsStateConcession: 15,
          incomeBelow25kConcession: 15,
          incomeBelow50kConcession: 10,
          maxTotalConcession: 75,
          eligiblePrograms: [
            'Class 11 Science', 'Class 11 Commerce', 'Class 11 Arts',
            'Class 12 Science', 'Class 12 Commerce', 'Class 12 Arts'
          ]
        }
      ]);
      logger.info('Scholarship rules seeded successfully.');
    }
  } catch (err) {
    logger.error('Error seeding scholarship rules', { error: err.message });
  }
};

app.listen(PORT, async () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  await seedAdmin();
  await seedScholarships();
  await seedProspectus();
});

