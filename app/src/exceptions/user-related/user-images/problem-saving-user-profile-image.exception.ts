import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemSavingUserProfileImageException extends HttpException {
  constructor() {
    super('Problem saving user profile image.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
