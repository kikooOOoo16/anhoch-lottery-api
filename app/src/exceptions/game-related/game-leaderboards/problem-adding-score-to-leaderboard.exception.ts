import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemAddingScoreToLeaderboardException extends HttpException {
  constructor() {
    super('Problem adding score to leaderboard.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
