import { HttpException, HttpStatus } from '@nestjs/common';

export class GoogleAuthNotEnabledForAccountException extends HttpException {
  constructor() {
    super('Google authentication not enabled for account.', HttpStatus.FORBIDDEN);
  }
}
