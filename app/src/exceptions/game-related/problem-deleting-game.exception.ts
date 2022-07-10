import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemDeletingGameException extends HttpException {
  constructor() {
    super('Problem deleting game.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
