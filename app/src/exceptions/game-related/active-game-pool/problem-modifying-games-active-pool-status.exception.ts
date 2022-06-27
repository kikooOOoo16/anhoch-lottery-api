import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemModifyingGamesActivePoolStatusException extends HttpException {

    constructor() {
        super(`Problem modifying game's active pool status.`, HttpStatus.SERVICE_UNAVAILABLE);
    }
}