import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidGoogleTokenException extends HttpException {
  constructor() {
    super('Invalid Google token.', HttpStatus.BAD_REQUEST);
  }
}
