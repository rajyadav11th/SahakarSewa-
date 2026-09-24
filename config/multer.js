const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Storage config — ab disk ki jagah Cloudinary pe jayegi
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'coopseva-workers',       // Cloudinary account mein isi naam ka folder banega
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'fill' }]
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

module.exports = upload;