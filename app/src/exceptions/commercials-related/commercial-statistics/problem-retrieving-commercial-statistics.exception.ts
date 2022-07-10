import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemRetrievingCommercialStatisticsException extends HttpException {
  constructor() {
    super('Problem retrieving commercial statistics.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
