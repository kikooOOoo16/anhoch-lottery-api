import { HttpException, HttpStatus } from '@nestjs/common';

export class CoverImageNotFoundException extends HttpException {
  constructor() {
    super('Cover image not found.', HttpStatus.NOT_FOUND);
  }
}
