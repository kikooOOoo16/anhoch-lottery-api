import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemUpdatingCommercialsWatchDurationException extends HttpException {
  constructor() {
    super(
      `Problem updating commercial's watch duration`,
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
