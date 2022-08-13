import { HttpException, HttpStatus } from '@nestjs/common';

export class UserTokenNotFoundException extends HttpException {
  constructor() {
    super('User token not found.', HttpStatus.NOT_FOUND);
  }
}
