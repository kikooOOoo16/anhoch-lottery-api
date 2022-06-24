import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemRetrievingAdminException extends HttpException {

    constructor() {
        super('Problem retrieving admin data.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}