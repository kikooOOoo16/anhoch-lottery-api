import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemRetrievingActivePoolGamesException extends HttpException {

    constructor() {
        super('Problem retrieving active pool games list.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}