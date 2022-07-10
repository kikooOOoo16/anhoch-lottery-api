import { HttpException, HttpStatus } from '@nestjs/common';

export class NoUserFoundException extends HttpException {
  constructor() {
    super('No user fround.', HttpStatus.NOT_FOUND);
  }
}
