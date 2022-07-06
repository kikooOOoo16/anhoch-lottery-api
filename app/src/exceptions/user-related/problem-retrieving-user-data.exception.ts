import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemRetrievingUserDataException extends HttpException {
  constructor() {
    super('Problem retrieving user data.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
