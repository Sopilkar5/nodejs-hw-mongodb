import multer from 'multer';
import createError from 'http-errors';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(createError(400, 'Only images are allowed'));
    }
    cb(null, true);
  },
});

export default upload;
