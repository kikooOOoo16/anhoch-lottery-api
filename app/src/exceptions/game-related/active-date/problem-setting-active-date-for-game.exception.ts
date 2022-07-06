import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemSettingActiveDateForGameException extends HttpException {
  constructor() {
    super(
      'Problem setting active date for game.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
