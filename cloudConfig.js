const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const ENV = {
  CLOUD_NAME: process.env.CLOUD_NAME && process.env.CLOUD_NAME.trim(),
  CLOUD_API_KEY: process.env.CLOUD_API_KEY && process.env.CLOUD_API_KEY.trim(),
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET && process.env.CLOUD_API_SECRET.trim(),
  CLOUDINARY_URL: process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.trim()
};

// Configure Cloudinary using either CLOUDINARY_URL or discrete creds
if (ENV.CLOUDINARY_URL) {
  // The SDK accepts a connection string directly
  cloudinary.config(ENV.CLOUDINARY_URL);
} else {
  if (!ENV.CLOUD_NAME || !ENV.CLOUD_API_KEY || !ENV.CLOUD_API_SECRET) {
    throw new Error(
      "Cloudinary configuration error: Missing CLOUD_NAME, CLOUD_API_KEY, or CLOUD_API_SECRET. Check your environment variables."
    );
  }
  cloudinary.config({
    cloud_name: ENV.CLOUD_NAME,
    api_key: ENV.CLOUD_API_KEY,
    api_secret: ENV.CLOUD_API_SECRET
  });
}

// Multer Storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Wanderlust_DEV',
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp']
  }
});

const upload = multer({ storage });

module.exports = { cloudinary, storage, upload };
