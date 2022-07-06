import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemAddingLeaderboardToGameException extends HttpException {
  constructor() {
    super(
      'Problem adding leaderboard data to game.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
