import {Injectable, Logger} from "@nestjs/common";
import {UserDocument} from "../../users/models/user.model";
import {Game} from "../models/game.model";
import {GamesFindService} from "./games-find.service";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {ActiveGameSessionDocument} from "../models/active-game-session.model";
import {ProblemStartingGameSessionException} from "../../exceptions/user-related/user-game-session/problem-starting-game-session.exception";
import {ProblemRetrievingSessionException} from "../../exceptions/user-related/user-game-session/problem-retrieving-session.exception";
import {NoActiveSessionFoundException} from "../../exceptions/user-related/user-game-session/no-active-session-found.exception";
import {ProblemDeletingActiveGameSessionException} from "../../exceptions/user-related/user-game-session/problem-deleting-active-game-session.exception";
import {UsersService} from "../../users/services/users.service";
import {CanNotPlayMoreThanOnceOnTheSameDayException} from "../../exceptions/user-related/user-game-session/can-not-play-more-than-once-on-the-same-day.exception";
import {UserScoreDocument} from "../models/user-score.model";
import {GameLeaderboardDocument} from "../models/game-leaderboard.model";
import {GamesLeaderboardsService} from "./games-leaderboards.service";
import {HelperService} from "../../common/services/helper.service";
import {GamesUsersScoreService} from "./games-users-score.service";
import {GamesLeaderboardsFindService} from "./games-leaderboards-find.service";

@Injectable()
export class GamesSessionService {

    constructor(
        private gamesFindService: GamesFindService,
        private usersService: UsersService,
        private gamesLeaderboardsService: GamesLeaderboardsService,
        private gamesUsersScoreService: GamesUsersScoreService,
        private gamesLeaderboardsFindService: GamesLeaderboardsFindService,
        @InjectModel('ActiveGameSession') private readonly activeGameSessionModel: Model<ActiveGameSessionDocument>,
        @InjectModel('UserScore') private readonly userScoreModel: Model<UserScoreDocument>) {}

    async startSession(user: UserDocument): Promise<ActiveGameSessionDocument> {
        let activeGameSession: ActiveGameSessionDocument;

        if (user.playedToday) {
            throw new CanNotPlayMoreThanOnceOnTheSameDayException();
        }

        const currentActiveGame: Game = await this.gamesFindService.findActiveGameForToday();

        const startTimeStamp = new Date().getTime();

        const gameSession: ActiveGameSessionDocument = new this.activeGameSessionModel({
            user,
            game: currentActiveGame,
            startTimeStamp
        });

        try {
            activeGameSession = await gameSession.save();
        } catch (e) {
            Logger.error(e, 'games-session.service.ts: startSession()');
            throw new ProblemStartingGameSessionException();
        }

        await this.usersService.modifyPlayedTodayStatus(user, true);

        return activeGameSession;
    }

    async stopSession(user: UserDocument): Promise<UserScoreDocument> {
        const activeGameSession: ActiveGameSessionDocument = await this.findUserActiveGameSession(user);
        const gameLeaderboard: GameLeaderboardDocument = await this.gamesLeaderboardsFindService.findLeaderboardByDateForGame(activeGameSession.game, HelperService.getCurrentDateTimestamp());

        const endTimestamp: number = new Date().getTime();

        const timeFinished = endTimestamp - activeGameSession.startTimeStamp;

        await this.deleteActiveGameSession(user);

        const userScore: UserScoreDocument = await this.gamesUsersScoreService.createUserScore(user, gameLeaderboard, timeFinished);

        await this.gamesLeaderboardsService.addScoreToLeaderboard(gameLeaderboard, userScore);

        return userScore;
    }

    async findUserActiveGameSession(user: UserDocument, returnEmptySessionRes?: boolean): Promise<ActiveGameSessionDocument> {
        let activeGameSession: ActiveGameSessionDocument;

        try {
            activeGameSession = await this.activeGameSessionModel.findOne({
                user
            });
        } catch (e) {
            Logger.error(e, 'games-session.service.ts');
            throw new ProblemRetrievingSessionException();
        }

        if (!activeGameSession && returnEmptySessionRes) {
            return activeGameSession;
        }

        if (!activeGameSession) {
            throw new NoActiveSessionFoundException();
        }

        return activeGameSession;
    }

    async deleteActiveGameSession(user: UserDocument) {
        let deletedActiveGameSession: ActiveGameSessionDocument;
        try {
            deletedActiveGameSession = await this.activeGameSessionModel.findOneAndDelete({
                user
            })
        } catch (e) {
            Logger.error(e, 'games-session.service.ts: deleteActiveGameSession()');
            throw new ProblemDeletingActiveGameSessionException();
        }

        if (!deletedActiveGameSession) {
            throw new NoActiveSessionFoundException();
        }

        return deletedActiveGameSession;
    }
}