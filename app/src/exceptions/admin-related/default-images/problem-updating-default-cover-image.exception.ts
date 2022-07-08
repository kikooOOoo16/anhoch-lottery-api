import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemUpdatingDefaultCoverImageException extends HttpException {
  constructor() {
    super('Problem updating default cover image.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
