import { HttpException, HttpStatus } from '@nestjs/common';

export class GameAlreadyHasThatActivePoolStatusExceptions extends HttpException {
  constructor(status: boolean) {
    super(
      `Game already has an active pool status of ${status}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
