import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemCreatingCommercialException extends HttpException {
  constructor() {
    super('Problem creating commercial.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
