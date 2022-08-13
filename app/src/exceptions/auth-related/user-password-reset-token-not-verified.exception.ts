import { HttpException, HttpStatus } from '@nestjs/common';

export class UserPasswordResetTokenNotVerifiedException extends HttpException {
  constructor() {
    super('User reset password token not verified.', HttpStatus.UNAUTHORIZED);
  }
}
