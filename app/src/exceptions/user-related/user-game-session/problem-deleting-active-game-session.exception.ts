import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemDeletingActiveGameSessionException extends HttpException {
  constructor() {
    super('Problem deleting active game session.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
