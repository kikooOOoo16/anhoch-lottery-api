import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongMasterPasswordException extends HttpException {
  constructor() {
    super('Wrong master password provided.', HttpStatus.BAD_REQUEST);
  }
}
