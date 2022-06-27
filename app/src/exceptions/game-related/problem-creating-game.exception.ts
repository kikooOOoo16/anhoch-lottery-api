import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemCreatingGameException extends HttpException {

    constructor() {
        super('Problem creating game.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}