import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemRetrievingLeaderboardsForGameException extends HttpException {

    constructor() {
        super('Problem retrieving leaderboards for game.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}