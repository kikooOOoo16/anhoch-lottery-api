import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenExpiredException extends HttpException {
  constructor() {
    super('Token expired.', HttpStatus.BAD_REQUEST);
  }
}
