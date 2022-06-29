import {Injectable, Logger} from "@nestjs/common";
import {GameDocument} from "../models/game.model";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {GameLeaderboardDocument} from "../models/game-leaderboard.model";
import {ProblemCreatingLeaderboardException} from "../../exceptions/game-related/game-leaderboards/problem-creating-leaderboard.exception";
import {ProblemDeletingLeaderboardForGameException} from "../../exceptions/game-related/game-leaderboards/problem-deleting-leaderboard-for-game.exception";
import {UserScoreDocument} from "../models/user-score.model";
import {ProblemAddingScoreToLeaderboardException} from "../../exceptions/game-related/game-leaderboards/problem-adding-score-to-leaderboard.exception";

@Injectable()
export class GamesLeaderboardsService {

    constructor(@InjectModel('GameLeaderboard') private readonly gameLeaderboardModel: Model<GameLeaderboardDocument>) {}

    async createLeaderboardForGame(game: GameDocument, dateTimestamp: number): Promise<GameLeaderboardDocument> {
        let newLeaderboard: GameLeaderboardDocument;
        const gameLeaderboard = new this.gameLeaderboardModel({
            game,
            date: dateTimestamp
        })

        try {
            newLeaderboard = await gameLeaderboard.save();
        } catch (e) {
            Logger.error(e, 'games-leaderboards.service: createLeaderboardForGame()');
            throw new ProblemCreatingLeaderboardException();
        }

        return newLeaderboard;
    }

    async deleteLeaderboardForGame(game: GameDocument, dateTimestamp: number): Promise<GameLeaderboardDocument> {
        try {
            return await this.gameLeaderboardModel.findOneAndDelete({
                game,
                date: dateTimestamp
            })
        } catch (e) {
            Logger.error(e, 'games-leaderboards.service: deleteLeaderboardForGame()');
            throw new ProblemDeletingLeaderboardForGameException();
        }
    }

    async addScoreToLeaderboard(gameLeaderboard: GameLeaderboardDocument, userScore: UserScoreDocument): Promise<GameLeaderboardDocument> {
        if (gameLeaderboard.userScores) {
            gameLeaderboard.userScores = [...gameLeaderboard.userScores, userScore.id];
        } else {
            gameLeaderboard.userScores = [userScore.id];
        }

        try {
            return await gameLeaderboard.save();
        } catch (e) {
            Logger.error(e, 'games-leaderboards.service: addScoreToLeaderboard()');
            throw new ProblemAddingScoreToLeaderboardException();
        }
    }
}