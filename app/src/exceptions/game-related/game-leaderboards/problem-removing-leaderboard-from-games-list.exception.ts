import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemRemovingLeaderboardFromGamesListException extends HttpException {
  constructor() {
    super(
      `Problem removing leaderboard from game's leaderboards list.`,
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
