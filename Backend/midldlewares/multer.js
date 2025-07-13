// middleware/multer.js
const multer = require('multer');

const storage = multer.memoryStorage(); // No file writing
const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  { name: 'cnicCopy', maxCount: 1 },
  { name: 'academicDocs', maxCount: 1 },
  { name: 'experienceLetters', maxCount: 1 },
  { name: 'contractLetter', maxCount: 1 },
]);

module.exports = { uploadFields };
