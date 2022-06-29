import {Injectable} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {GamesFindService} from "./games-find.service";
import {GameDocument} from "../models/game.model";
import {GamesLeaderboardsService} from "./games-leaderboards.service";

@Injectable()
export class GamesDayCycleService {

    constructor(
        private gamesFindService: GamesFindService,
        private gamesLeaderboardsService: GamesLeaderboardsService) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleActiveGameCycle() {
        const activeGame: GameDocument = await this.gamesFindService.findActiveGameForToday();

        // close any leftover active game sessions

        // set user played_today value to false

        if (activeGame) {
            // check if game has a leaderboard for the date if not create one
            // await this.gamesLeaderboardsService.createLeaderboardForGame(activeGame);
        }
    }
}