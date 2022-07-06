import { HttpException, HttpStatus } from '@nestjs/common';

export class FileMustBeAnImageException extends HttpException {
  constructor() {
    super('File must be an image.', HttpStatus.BAD_REQUEST);
  }
}
