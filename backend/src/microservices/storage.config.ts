import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const storageConfig = {
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      req.fileValidationError = 'Unsupported Media Type';
      return cb(new HttpException('Unsupported Media Type', HttpStatus.UNSUPPORTED_MEDIA_TYPE), false);
    }
    cb(null, true);

  },
  storage: diskStorage({
    destination: './uploads/Avatars',
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      const onlyName = file.originalname.split('.')[0];
      const imgName = onlyName + randomName + extname(file.originalname);
      cb(null, imgName);
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB Max file(s) size
  },
};
