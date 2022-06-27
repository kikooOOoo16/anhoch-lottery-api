import {HttpException, HttpStatus} from "@nestjs/common";

export class GameAlreadySetAsActiveForDateException extends HttpException {

    constructor(date: Date) {
        super(`Game already set as active for date ${date}`, HttpStatus.BAD_REQUEST);
    }
}