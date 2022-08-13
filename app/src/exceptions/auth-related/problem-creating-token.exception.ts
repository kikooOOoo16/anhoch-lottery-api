import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemCreatingTokenException extends HttpException {
  constructor() {
    super('Problem creating token.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
