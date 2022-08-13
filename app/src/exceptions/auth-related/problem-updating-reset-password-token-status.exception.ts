import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemUpdatingResetPasswordTokenStatusException extends HttpException {
  constructor() {
    super('Problem updating reset password token status.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
