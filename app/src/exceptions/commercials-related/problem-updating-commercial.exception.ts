import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemUpdatingCommercialException extends HttpException {

    constructor() {
        super('Problem updating commercial.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}