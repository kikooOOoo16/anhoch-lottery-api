import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemStartingGameSessionException extends HttpException {
  constructor() {
    super('Problem starting game session.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
