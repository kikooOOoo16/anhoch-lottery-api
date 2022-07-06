import { HttpException, HttpStatus } from '@nestjs/common';

export class ProvidedDateHasPassedException extends HttpException {
  constructor(date: Date) {
    super(`The date ${date} has already passed.`, HttpStatus.BAD_REQUEST);
  }
}
