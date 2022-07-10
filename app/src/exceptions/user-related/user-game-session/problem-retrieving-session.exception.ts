import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemRetrievingSessionException extends HttpException {
  constructor() {
    super('Problem retrieving session data.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
