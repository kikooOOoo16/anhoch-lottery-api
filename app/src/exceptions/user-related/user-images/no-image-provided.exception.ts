import { HttpException, HttpStatus } from '@nestjs/common';

export class NoImageProvidedException extends HttpException {
  constructor() {
    super('No image provided.', HttpStatus.BAD_REQUEST);
  }
}
