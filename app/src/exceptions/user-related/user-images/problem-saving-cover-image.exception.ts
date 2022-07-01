import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemSavingCoverImageException extends HttpException {

    constructor() {
        super('Problem saving cover image.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}