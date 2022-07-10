import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemCreatingNewUserException extends HttpException {
  constructor() {
    super('Problem creating new user.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
