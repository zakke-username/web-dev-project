import multer from 'multer';
import sharp from 'sharp';

export const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      const error = new Error('Only images and videos allowed');
      error.status = 400;
      cb(error, false);
    }
  },
});

export const createImage = async (req, res, next) => {
  try {
    if (!req.file || req.file.mimetype.startsWith('video/')) {
      next();
      return;
    }
    await sharp(req.file.path)
      .resize({
        width: 1024,
        height: 1024,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 75 })
      .toFile(req.file.path + '.webp');
    next();
  } catch (error) {
    next(error);
  }
};

export const createThumbnail = async (req, res, next) => {
  try {
    if (!req.file || req.file.mimetype.startsWith('video/')) {
      next();
      return;
    }
    await sharp(req.file.path)
      .resize({
        width: 256,
        height: 256,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 75 })
      .toFile(req.file.path + '_thumbnail.webp');
    next();
  } catch (error) {
    next(error);
  }
};
