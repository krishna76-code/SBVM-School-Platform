import { z } from 'zod';

export const admissionFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  dob: z.string().min(1, { message: 'Date of birth is required' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  parentName: z.string().min(1, { message: 'Parent name is required' }),
  parentPhone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  previousSchool: z.string().optional().nullable(),
  previousClass: z.string().optional().nullable(),
  appliedClass: z.string().min(1, { message: 'Applied class standard is required' }),
  marksPercentage: z.number().optional().nullable(),
  documents: z.object({
    studentPhotoUrl: z.string().min(1, { message: 'Student photo URL is required' }),
    aadhaarUrl: z.string().min(1, { message: 'Aadhaar document URL is required' }),
    marksheetUrl: z.string().min(1, { message: 'Marksheet document URL is required' })
  })
});

export const updateStatusSchema = z.object({
  status: z.enum(['Submitted', 'Under Review', 'Approved', 'Rejected']),
  adminNotes: z.string().optional(),
  feeConcessionPercentage: z.number().min(0).max(75).optional()
});
