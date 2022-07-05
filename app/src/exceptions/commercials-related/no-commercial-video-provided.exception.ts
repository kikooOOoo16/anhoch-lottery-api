import {HttpException, HttpStatus} from "@nestjs/common";

export class NoCommercialVideoProvidedException extends HttpException {

    constructor() {
        super('No video provided.', HttpStatus.BAD_REQUEST);
    }
}