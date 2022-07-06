import { HttpException, HttpStatus } from '@nestjs/common';

export class NoGameFoundException extends HttpException {
  constructor() {
    super('No game found.', HttpStatus.NOT_FOUND);
  }
}
