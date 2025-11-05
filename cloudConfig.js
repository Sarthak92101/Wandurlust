const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

//  Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET 
});

//  Multer Storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Wanderlust_DEV', // your folder name in Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp']
  }
});

const upload = multer({ storage });

module.exports = { cloudinary, storage, upload };
