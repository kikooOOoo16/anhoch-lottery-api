import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemUpdatingUserDataException extends HttpException {

    constructor() {
        super('Problem updating user data.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}