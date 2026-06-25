import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  caption: {
    type: String
  },
  imageUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Sports', 'Academics', 'Cultural', 'Infrastructure', 'Events', 'General'],
    default: 'General'
  },
  tags: [{
    type: String
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', GallerySchema);
export default Gallery;
