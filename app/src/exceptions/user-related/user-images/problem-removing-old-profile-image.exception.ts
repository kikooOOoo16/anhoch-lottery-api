import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemRemovingOldProfileImageException extends HttpException {

    constructor() {
        super('Problem removing old profile image.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}