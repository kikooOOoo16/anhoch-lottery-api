import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemRetrievingLeaderboardForGameException extends HttpException {
  constructor() {
    super(
      'Problem retrieving leaderboard for game.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
