import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemCreatingUserScoreException extends HttpException {

    constructor() {
        super('Problem creating user score.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}