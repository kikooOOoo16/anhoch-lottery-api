import { BadRequestException } from '@nestjs/common';

export const commercialVideoStorageOptions = {
  fieldName: 'commercial-video',
  path: '/commercial-videos',
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.includes('video')) {
      return callback(new BadRequestException('File must be a video'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: Math.pow(5024, 2),
  },
};

export const profileImageStorageOptions = {
  fieldName: 'profile-image',
  path: '/profile-images',
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.includes('image')) {
      return callback(new BadRequestException('File must be an image'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: Math.pow(1024, 2),
  },
};

export const coverImageStorageOptions = {
  fieldName: 'cover-image',
  path: '/cover-images',
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.includes('image')) {
      return callback(new BadRequestException('File must be an image'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: Math.pow(1024, 2),
  },
};
