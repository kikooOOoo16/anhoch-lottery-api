import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateValueException extends HttpException {
  constructor(duplicateKeyValue: string[]) {
    super(`Value already in use for provided ${[...duplicateKeyValue] as const}.`, HttpStatus.BAD_REQUEST);
  }
}
