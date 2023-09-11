import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

const funnyAdjectives = [
  'hilarious', 'whimsical', 'zany', 'quirky', 'bizarre', 'outrageous', 'ridiculous',
  'absurd', 'ludicrous', 'wacky', 'goofy', 'offbeat', 'eccentric', 'funky', 'droll',
  'amusing', 'comical', 'playful', 'witty', 'clever', 'silly', 'madcap', 'nutty', 'daffy',
  'daft', 'bonkers', 'kooky', 'cockamamie', 'fantastical', 'far-out', 'kookaburra',
  'hocus-pocus', 'nonsensical', 'gobbledygook', 'whoopee', 'giggly', 'ballyhoo',
  'balderdash', 'flibbertigibbet', 'gibberish', 'jibber-jabber', 'brouhaha', 'hoopla',
  'fiddle-faddle', 'gobbledygook', 'mumbo jumbo', 'claptrap', 'piffle', 'poppycock'
];

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
      const randomName = Array(16)
        .fill(null)
        .map(() => Math.round(Math.random() * 8).toString(8))
        .join('');
      const onlyName = file.originalname.split('.')[0];
      const funnyAdjective = funnyAdjectives[Math.floor(Math.random() * funnyAdjectives.length)];
      const imgName = funnyAdjective + "-" + onlyName + "-" + randomName + extname(file.originalname);
      cb(null, imgName);
    },
    onError: (err, next) => {
      console.log(err);
      next(err);
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB Max file(s) size
  },
};

