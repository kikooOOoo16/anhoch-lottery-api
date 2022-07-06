import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemRetrievingUserProfileImageException extends HttpException {
  constructor() {
    super(
      'Problem retrieving user profile image.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
