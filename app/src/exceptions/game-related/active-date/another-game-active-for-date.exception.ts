import { HttpException, HttpStatus } from '@nestjs/common';

export class AnotherGameActiveForDateException extends HttpException {
  constructor(gameName: string, date: Date) {
    super(`The game ${gameName} is already set as active for the date ${date}.`, HttpStatus.BAD_REQUEST);
  }
}
