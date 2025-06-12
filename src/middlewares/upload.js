// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploadMiddleware = (folderName = 'others') => {
  // Ensure the folder exists
  const destinationPath = path.join('uploads', folderName);
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only images are allowed (.jpg, .jpeg, .png)'));
  };

  return multer({ storage, fileFilter });
};

module.exports = createUploadMiddleware;
