import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemSettingUserResetTokenException extends HttpException {
  constructor() {
    super(`Problem setting user's reset token.`, HttpStatus.SERVICE_UNAVAILABLE);
  }
}
