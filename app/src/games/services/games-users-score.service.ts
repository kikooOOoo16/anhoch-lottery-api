import {Injectable, Logger} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {UserScoreDocument} from "../models/user-score.model";
import {Model} from "mongoose";
import {UserDocument} from "../../users/models/user.model";
import {ProblemCreatingUserScoreException} from "../../exceptions/game-related/game-user-score/problem-creating-user-score.exception";
import {GameLeaderboardDocument} from "../models/game-leaderboard.model";

@Injectable()
export class GamesUsersScoreService {

    constructor(@InjectModel('UserScore') private readonly userScoreModel: Model<UserScoreDocument>) {}

    async createUserScore(user: UserDocument, gameLeaderboard: GameLeaderboardDocument, time: number, score?): Promise<UserScoreDocument> {
        const userScore = new this.userScoreModel({
            user,
            gameLeaderboard,
            time
        });

        if (score) {
            userScore.score = score;
        }

        try {
            return await userScore.save();
        } catch (e) {
            Logger.error(e, 'games-users-score.service: createUserScore()');
            throw new ProblemCreatingUserScoreException();
        }
    }
}