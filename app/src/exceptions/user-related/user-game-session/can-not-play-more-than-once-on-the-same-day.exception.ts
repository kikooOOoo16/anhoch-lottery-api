import { HttpException, HttpStatus } from '@nestjs/common';

export class CanNotPlayMoreThanOnceOnTheSameDayException extends HttpException {
  constructor() {
    super('Can not play more than once on the same day.', HttpStatus.BAD_REQUEST);
  }
}
