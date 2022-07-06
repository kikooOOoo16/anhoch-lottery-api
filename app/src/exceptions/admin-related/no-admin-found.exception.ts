import { HttpException, HttpStatus } from '@nestjs/common';

export class NoAdminFoundException extends HttpException {
  constructor() {
    super('No admin found.', HttpStatus.NOT_FOUND);
  }
}
