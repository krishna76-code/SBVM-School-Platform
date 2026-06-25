import Gallery from '../models/Gallery.js';
import cloudinary from '../config/cloudinary.js';
import { generateText } from '../services/gemini.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'sbvm_gallery',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]:', error);
          reject(new AppError('Image upload to Cloudinary failed: ' + error.message, 500));
        } else {
          resolve(result);
        }
      }
    );
    stream.end(fileBuffer);
  });
};

// @desc    Get all gallery items
// @route   GET /api/v1/gallery
// @access  Public
export const getGalleryItems = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category && category !== 'All') {
    filter.category = category;
  }

  const items = await Gallery.find(filter)
    .populate('uploadedBy', 'email')
    .sort({ createdAt: -1 });

  res.json({
    status: 'success',
    results: items.length,
    data: items
  });
});

// @desc    Create a new gallery item
// @route   POST /api/v1/gallery
// @access  Private (Admin)
export const createGalleryItem = asyncHandler(async (req, res) => {
  const { title, caption, category, tags } = req.body;

  if (!req.file) {
    throw new AppError('Please upload an image file.', 400);
  }

  if (!title) {
    throw new AppError('Title is required.', 400);
  }

  // Parse tags if sent as JSON or comma-separated string
  let parsedTags = [];
  if (tags) {
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (err) {
        parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }
  }

  // Upload to Cloudinary
  const uploadResult = await uploadToCloudinary(req.file.buffer);

  // Create Gallery item in DB
  const galleryItem = await Gallery.create({
    title,
    caption: caption || '',
    imageUrl: uploadResult.secure_url,
    cloudinaryPublicId: uploadResult.public_id,
    category: category || 'General',
    tags: parsedTags,
    uploadedBy: req.user._id
  });

  res.status(201).json({
    status: 'success',
    message: 'Gallery item uploaded successfully',
    data: galleryItem
  });
});

// @desc    Delete a gallery item
// @route   DELETE /api/v1/gallery/:id
// @access  Private (Admin)
export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const galleryItem = await Gallery.findById(id);
  if (!galleryItem) {
    throw new AppError('Gallery item not found', 404);
  }

  // Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(galleryItem.cloudinaryPublicId);
  } catch (error) {
    console.warn(`[Cloudinary Deletion Warning]: Could not delete publicId ${galleryItem.cloudinaryPublicId}`, error.message);
  }

  // Delete from DB
  await Gallery.findByIdAndDelete(id);

  res.json({
    status: 'success',
    message: 'Gallery item deleted successfully'
  });
});

// @desc    Generate AI caption based on metadata
// @route   POST /api/v1/gallery/generate-caption
// @access  Private (Admin)
export const generateGalleryCaption = asyncHandler(async (req, res) => {
  const { title, category, tags } = req.body;

  if (!tags || (Array.isArray(tags) && tags.length === 0)) {
    throw new AppError('Please provide metadata tags for AI generation.', 400);
  }

  const tagsString = Array.isArray(tags) ? tags.join(', ') : tags;

  const systemInstruction = 
    "You are an elegant AI copywriter representing Saraswati Bal Vidya Mandir (SBVM) School. " +
    "Your job is to generate a premium, warm, engaging, and professional caption for the school's gallery. " +
    "Keep it very concise (exactly 2 to 3 sentences maximum). Avoid generic buzzwords. " +
    "Focus on student growth, academic excellence, culture, community spirit, or school legacy.";

  const prompt = `Write a caption based on these details:
- Photo Title: ${title || 'School Campus Life'}
- Category: ${category || 'General'}
- Tagged details: ${tagsString}

Generate a short, polished gallery description. Do not include quotes or surrounding conversational text, output only the caption.`;

  try {
    const caption = await generateText({
      systemInstruction,
      prompt
    });

    res.json({
      status: 'success',
      caption: caption ? caption.trim() : ''
    });
  } catch (error) {
    console.error('[Gemini Caption Error]:', error);
    throw new AppError('AI Caption generation failed: ' + error.message, 500);
  }
});
