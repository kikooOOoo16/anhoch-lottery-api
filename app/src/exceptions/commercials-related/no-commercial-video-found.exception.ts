import {HttpException, HttpStatus} from "@nestjs/common";

export class NoCommercialVideoFoundException extends HttpException {

    constructor() {
        super('No commercial video found.', HttpStatus.NOT_FOUND);
    }
}