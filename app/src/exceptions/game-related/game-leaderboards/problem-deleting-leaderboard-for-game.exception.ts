import {HttpException, HttpStatus} from "@nestjs/common";

export class ProblemDeletingLeaderboardForGameException extends HttpException {

    constructor() {
        super('Problem deleting leaderboard for game.', HttpStatus.SERVICE_UNAVAILABLE);
    }
}