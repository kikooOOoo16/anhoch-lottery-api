import { HttpException, HttpStatus } from '@nestjs/common';

export class CommercialAlreadyHasThatStatusException extends HttpException {
  constructor(isActiveStatus: boolean) {
    super(`Commercial already has a status of ${isActiveStatus}`, HttpStatus.BAD_REQUEST);
  }
}
