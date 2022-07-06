import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemRetrievingCommercialException extends HttpException {
  constructor() {
    super(
      'Problem retrieving commercial video data.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
