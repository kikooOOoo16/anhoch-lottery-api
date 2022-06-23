import {HttpException, HttpStatus} from "@nestjs/common";

export class WrongCredentialsException extends HttpException {

    constructor() {
        super('Wrong credentials provided,', HttpStatus.BAD_REQUEST);
    }
}