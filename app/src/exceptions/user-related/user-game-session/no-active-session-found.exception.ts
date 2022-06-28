import {HttpException, HttpStatus} from "@nestjs/common";

export class NoActiveSessionFoundException extends HttpException {

    constructor() {
        super('No active game session found.', HttpStatus.NOT_FOUND);
    }
}