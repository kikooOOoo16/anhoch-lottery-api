import {HttpException, HttpStatus} from "@nestjs/common";

export class NoActiveDateFoundException extends HttpException {

    constructor() {
        super('No active date found.', HttpStatus.NOT_FOUND);
    }
}