import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemRetrievingAllGamesException extends HttpException {
  constructor() {
    super('Problem retrieving all games.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
