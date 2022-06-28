import {HttpException, HttpStatus} from "@nestjs/common";

export class NoActiveGameFoundForTodayException extends HttpException {

    constructor() {
        super('No active game found for today.', HttpStatus.NOT_FOUND);
    }
}