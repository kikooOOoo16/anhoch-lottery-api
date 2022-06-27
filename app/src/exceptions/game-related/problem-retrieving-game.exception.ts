import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemRetrievingGameException extends HttpException {

    constructor() {
        super('Problem retrieving game.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}