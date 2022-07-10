import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemRetrievingActiveGameForTodayException extends HttpException {
  constructor() {
    super('Problem retrieving active game for today.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
