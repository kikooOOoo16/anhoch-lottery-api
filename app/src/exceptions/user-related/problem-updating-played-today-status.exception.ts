import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemUpdatingPlayedTodayStatusException extends HttpException {
  constructor() {
    super('Problem updating played today status.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
