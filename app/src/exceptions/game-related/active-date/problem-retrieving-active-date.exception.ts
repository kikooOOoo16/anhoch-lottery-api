import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemRetrievingActiveDateException extends HttpException {

    constructor() {
        super('Problem retrieving active date data.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}