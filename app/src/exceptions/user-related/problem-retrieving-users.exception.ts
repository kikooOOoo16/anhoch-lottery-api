import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemRetrievingUsersException extends HttpException {

    constructor() {
        super('Problem retrieving users.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}