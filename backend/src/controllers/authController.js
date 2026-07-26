import User from '../models/User.js';
import ApplicantProfile from '../models/ApplicantProfile.js';
import { generateAccessToken, generateRefreshToken, sendRefreshTokenCookie } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { env } from '../config/env.js';

// @desc    Register a new Guest Applicant
// @route   POST /api/v1/auth/register-applicant
// @access  Public
export const registerApplicant = asyncHandler(async (req, res) => {
  const { email, phone, password, firstName, lastName, dob, gender, parentName, appliedClass } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User with this email already exists', 400);
  }

  // 1. Create Applicant Profile
  const applicantProfile = await ApplicantProfile.create({
    firstName,
    lastName,
    dob: new Date(dob),
    gender,
    parentName,
    parentEmail: email,
    parentPhone: phone,
    appliedClass,
    status: 'Draft'
  });

  // 2. Create User Credentials linked to Applicant Profile
  const user = await User.create({
    email,
    phone,
    passwordHash: password, // Pre-save hook hashes this password automatically
    role: 'Guest',
    profileRef: applicantProfile._id,
    roleRefModel: 'ApplicantProfile'
  });

  // 3. Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  sendRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    status: 'success',
    _id: user._id,
    email: user.email,
    role: user.role,
    accessToken,
    profile: applicantProfile
  });
});

// @desc    User Login
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate({
    path: 'profileRef',
    populate: { path: 'children' }
  });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 403);
  }

  user.lastLogin = Date.now();
  await user.save();

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  sendRefreshTokenCookie(res, refreshToken);

  res.json({
    status: 'success',
    _id: user._id,
    email: user.email,
    role: user.role,
    accessToken,
    profile: user.profileRef
  });
});

// @desc    Refresh Access Token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new AppError('Session expired, no refresh token found', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId).populate({
      path: 'profileRef',
      populate: { path: 'children' }
    });
    
    if (!user || !user.isActive) {
      throw new AppError('User not authorized or account is inactive', 401);
    }

    const accessToken = generateAccessToken(user._id);
    res.json({
      status: 'success',
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profileRef
      }
    });
  } catch (error) {
    throw new AppError('Refresh token is invalid or expired', 401);
  }
});

// @desc    User Logout
// @route   POST /api/v1/auth/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ status: 'success', message: 'Successfully logged out' });
});

// @desc    Get Current User Profile
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'profileRef',
    populate: { path: 'children' }
  });
  if (!user) {
    throw new AppError('User session expired or not found', 404);
  }
  res.json({ 
    status: 'success', 
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profileRef
    } 
  });
});
