import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemUpdatingDefaultProfileImageException extends HttpException {
  constructor() {
    super('Problem updating default profile image.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
