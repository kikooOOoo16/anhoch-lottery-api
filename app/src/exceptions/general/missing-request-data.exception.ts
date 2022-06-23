import {HttpException, HttpStatus} from "@nestjs/common";

export class MissingRequestDataException extends HttpException {

    constructor() {
        super('Missing request data.', HttpStatus.BAD_REQUEST);
    }
}