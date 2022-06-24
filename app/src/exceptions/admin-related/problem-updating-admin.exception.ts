import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemUpdatingAdminException extends HttpException {

    constructor() {
        super('Problem updating admin.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}