import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemDeletingTokenException extends HttpException {
  constructor() {
    super('Problem deleting verify account token.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
