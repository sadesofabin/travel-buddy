const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'src/uploads/';

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files to the uploads directory
  },
  filename: function (req, file, cb) {
    // Name the file by adding a timestamp for uniqueness
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter to allow only images and PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false); // Reject the file
  }
};

// Configure multer for multiple file uploads
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Use `upload.array('files', maxCount)` to handle multiple files. 
// Here 'files' is the name of the field in the form, and maxCount is the maximum number of files allowed.
module.exports = upload;
