import {Injectable, Logger} from "@nestjs/common";
import {GameLeaderboardDocument} from "../models/game-leaderboard.model";
import {Game, GameDocument} from "../models/game.model";
import {HelperService} from "../../common/services/helper.service";
import {ProblemRetrievingLeaderboardForGameException} from "../../exceptions/game-related/game-leaderboards/problem-retrieving-leaderboard-for-game.exception";
import {ProblemRetrievingLeaderboardsForGameException} from "../../exceptions/game-related/game-leaderboards/problem-retrieving-leaderboards-for-game.exception";
import {UserDocument} from "../../users/models/user.model";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {GamesFindService} from "./games-find.service";

@Injectable()
export class GamesLeaderboardsFindService {

    constructor(private gamesFindService: GamesFindService,
                @InjectModel('GameLeaderboard') private readonly gameLeaderboardModel: Model<GameLeaderboardDocument>) {
    }

    async findLeaderboardForTodayActiveGame(): Promise<GameLeaderboardDocument> {
        const todayActiveGame: GameDocument = await this.gamesFindService.findActiveGameForToday();

        try {
            return await this.gameLeaderboardModel
                .findOne({
                    date: HelperService.getCurrentDateTimestamp(),
                    game: todayActiveGame
                })
                .populate('userScores')
                .exec()
        } catch (e) {
            Logger.error(e, 'games-leaderboards.service: findLeaderboardForTodayActiveGame()');
            throw new ProblemRetrievingLeaderboardForGameException();
        }
    }

    async findLeaderboardByDateForGame(game: GameDocument | Game, dateTimestamp: number): Promise<GameLeaderboardDocument> {
        try {
            return await this.gameLeaderboardModel
                .findOne({
                    game,
                    date: dateTimestamp
                })
                .populate('userScores')
                .exec()
        } catch (e) {
            Logger.error(e, 'games-leaderboards.service: findLeaderboardByDateForGame()');
            throw new ProblemRetrievingLeaderboardForGameException();
        }
    }

    async findLeaderboardByDateByGameId(gameId: string, dateTimestamp: number) {
        const game: GameDocument = await this.gamesFindService.findById(gameId);

        return await this.findLeaderboardByDateForGame(game, dateTimestamp);
    }

    async findAllLeaderboardsForGame(gameId: string) {
        const game: GameDocument = await this.gamesFindService.findById(gameId);

        try {
            return await this.gameLeaderboardModel
                .find({
                    game
                })
                .populate('userScores');
        } catch (e) {
            Logger.error(e, 'games-leaderboards.service: findAllLeaderboardsForGame()');
            throw new ProblemRetrievingLeaderboardsForGameException();
        }
    }

    async findAllLeaderboardsWhereUserHasPlayed(user: UserDocument) {
        try {
            return await this.gameLeaderboardModel
                .find()
                .populate({
                    path: 'userScores',
                    match: {id: user.id}
                })
                .exec();
        } catch (e) {
            Logger.error(e, 'games-leaderboards.service: findAllLeaderboardsWhereUserHasPlayed()')
        }
    }
}