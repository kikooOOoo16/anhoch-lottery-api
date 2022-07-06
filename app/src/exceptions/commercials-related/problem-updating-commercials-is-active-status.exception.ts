import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemUpdatingCommercialsIsActiveStatusException extends HttpException {
  constructor() {
    super(
      `Problem updating commercial's is active status.`,
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
