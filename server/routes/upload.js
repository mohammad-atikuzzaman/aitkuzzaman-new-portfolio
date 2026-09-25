import express from 'express';
import { upload, uploadToCloudinary } from '../config/cloudinary.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    // Check if Cloudinary is configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      const result = await uploadToCloudinary(req.file.buffer, 'portfolio');
      return res.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    // Fallback: If Cloudinary not yet configured, return base64 Data URL for instant preview & testing
    const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    return res.json({
      success: true,
      url: base64Data,
      note: 'Uploaded as data URI (Configure Cloudinary env variables for production cloud storage)',
    });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
