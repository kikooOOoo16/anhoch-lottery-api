import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemCreatingLeaderboardException extends HttpException {
  constructor() {
    super('Problem creating leaderboard.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
