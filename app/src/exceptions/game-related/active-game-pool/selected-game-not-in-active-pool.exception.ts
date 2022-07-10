import { HttpException, HttpStatus } from '@nestjs/common';

export class SelectedGameNotInActivePoolException extends HttpException {
  constructor() {
    super('The selected game is not in the active game pool.', HttpStatus.BAD_REQUEST);
  }
}
