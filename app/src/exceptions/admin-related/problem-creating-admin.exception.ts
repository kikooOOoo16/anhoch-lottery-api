import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemCreatingAdminException extends HttpException {
  constructor() {
    super('Problem creating admin.', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
