import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemResettingUserPasswordException extends HttpException {
  constructor() {
    super('Problem resetting user password.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
