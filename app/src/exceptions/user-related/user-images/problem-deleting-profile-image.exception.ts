import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemDeletingProfileImageException extends HttpException {
  constructor() {
    super('Problem deleting profile image.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
