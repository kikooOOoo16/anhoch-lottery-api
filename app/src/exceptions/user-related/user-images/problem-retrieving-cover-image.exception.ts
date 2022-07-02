import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemRetrievingCoverImageException extends HttpException {

    constructor() {
        super('Problem retrieving cover image.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}