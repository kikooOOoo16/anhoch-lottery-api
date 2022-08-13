import { HttpException, HttpStatus } from '@nestjs/common';

export class UserEmailNotVerifiedException extends HttpException {
  constructor() {
    super('User email not verified.', HttpStatus.BAD_REQUEST);
  }
}
