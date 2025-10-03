const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter: fileFilter
});

/**
 * POST /api/upload/image
 * Upload an image file
 */
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const { clientId, tenantId } = req.body;
    
    // Generate public URL (in production, this would be your CDN URL)
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      link: imageUrl,
      url: imageUrl,
      path: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/upload/images
 * List uploaded images for a client/tenant
 */
router.get('/images', (req, res) => {
  try {
    const { clientId, tenantId } = req.query;
    
    // In a real application, you'd query a database
    // For now, we'll return a mock list
    const mockImages = [
      {
        id: '1',
        url: 'https://via.placeholder.com/300x200?text=Sample+1',
        name: 'Sample Image 1',
        uploadedAt: new Date().toISOString()
      },
      {
        id: '2',
        url: 'https://via.placeholder.com/300x200?text=Sample+2',
        name: 'Sample Image 2',
        uploadedAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      images: mockImages
    });

  } catch (error) {
    console.error('List Images Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list images',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * DELETE /api/upload/image/:filename
 * Delete an uploaded image
 */
router.delete('/image/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

  } catch (error) {
    console.error('Delete Image Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Serve uploaded files statically
router.use('/uploads', express.static(uploadDir));

module.exports = router;




