import {HttpException, HttpStatus} from "@nestjs/common";

export class ProfileImageNotFoundException extends HttpException {

    constructor() {
        super('Profile image not found.', HttpStatus.NOT_FOUND);
    }
}