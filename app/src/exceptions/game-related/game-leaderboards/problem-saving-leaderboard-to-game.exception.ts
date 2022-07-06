import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemSavingLeaderboardToGameException extends HttpException {
  constructor() {
    super(
      'Problem saving leaderboard to game.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
