import {Injectable, Logger} from "@nestjs/common";
import {GameDocument} from "../models/game.model";
import {ActiveDateDocument} from "../models/active-date.model";
import {ProblemRetrievingActiveDateException} from "../../exceptions/game-related/active-date/problem-retrieving-active-date.exception";
import {GameAlreadySetAsActiveForDateException} from "../../exceptions/game-related/active-date/game-already-set-as-active-for-date.exception";
import {AnotherGameActiveForDateException} from "../../exceptions/game-related/active-date/another-game-active-for-date.exception";
import {ModifyActiveGameDateDTO} from "../dtos/modify-active-game-date.dto";
import {SelectedGameNotInActivePoolException} from "../../exceptions/game-related/active-game-pool/selected-game-not-in-active-pool.exception";
import {ProblemSettingActiveDateForGameException} from "../../exceptions/game-related/active-date/problem-setting-active-date-for-game.exception";
import {NoActiveDateFoundException} from "../../exceptions/game-related/active-date/no-active-date-found.exception";
import {ProvidedDateHasPassedException} from "../../exceptions/game-related/active-date/provided-date-has-passed.exception";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {GamesFindService} from "./games-find.service";
import {HelperService} from "../../common/services/helper.service";
import {GamesLeaderboardsService} from "./games-leaderboards.service";

@Injectable()
export class GamesActiveDateService {

    constructor(@InjectModel('ActiveDate') private readonly  activeDateModel: Model<ActiveDateDocument>,
                private gamesFindService: GamesFindService,
                private gamesLeaderboardsService: GamesLeaderboardsService) {
    }

    async findIfAnyGameIsActiveOnDate(game: GameDocument, timestamp): Promise<void> {
        let foundDate: ActiveDateDocument;

        try {
            foundDate = await this.activeDateModel
                .findOne({
                    date: timestamp
                })
                .populate('game')
                .exec();
        } catch (e) {
            Logger.error(e, 'games.service.ts: findIfGameIsActiveOnDate()');
            throw new ProblemRetrievingActiveDateException();
        }

        if (foundDate && foundDate.game.name === game.name) {
            const receivedDate = new Date(timestamp);
            throw new GameAlreadySetAsActiveForDateException(receivedDate);
        } else if (foundDate) {
            Logger.debug(`The game ${foundDate.game.name} is already set on the date - ${new Date(timestamp)}`);
            throw new AnotherGameActiveForDateException(foundDate.game.name, new Date(timestamp));
        }
    }

    async setActiveDate(id, {day, month, year}: ModifyActiveGameDateDTO): Promise<ActiveDateDocument> {
        const game: GameDocument = await this.gamesFindService.findById(id);
        let savedActiveDate: ActiveDateDocument;

        if (!game.inActivePool) {
            throw new SelectedGameNotInActivePoolException();
        }

        const dateTimestamp: number = HelperService.convertToTimestamp(day, month, year);

        GamesActiveDateService.checkIfDatePassed(dateTimestamp);

        await this.findIfAnyGameIsActiveOnDate(game, dateTimestamp);

        const activeDate = new this.activeDateModel({
            date: dateTimestamp,
            game
        });

        try {
            savedActiveDate = await activeDate.save();
        } catch (e) {
            Logger.error(e, 'games.service.ts: setActiveDate()');
            throw new ProblemSettingActiveDateForGameException();
        }

        await this.gamesLeaderboardsService.createLeaderboardForGame(game, dateTimestamp);

        return savedActiveDate;
    }

    async removeActiveDate(id, {day, month, year}: ModifyActiveGameDateDTO): Promise<ActiveDateDocument> {
        let activeDate: ActiveDateDocument;
        const game: GameDocument = await this.gamesFindService.findById(id);

        const dateTimestamp: number = HelperService.convertToTimestamp(day, month, year);

        GamesActiveDateService.checkIfDatePassed(dateTimestamp);

        try {
            activeDate = await this.activeDateModel
                .findOneAndDelete({
                    date: dateTimestamp,
                    game
                })
                .populate('game')
                .exec();
        } catch (e) {
            Logger.error(e, 'games.service.ts removeActiveDate()');
            throw new ProblemRetrievingActiveDateException();
        }

        if (!activeDate) {
            throw new NoActiveDateFoundException();
        }

        await this.gamesLeaderboardsService.deleteLeaderboardForGame(game, dateTimestamp);

        return activeDate;
    }

    private static checkIfDatePassed(dateTimestamp: number) {
        const today = new Date();
        today.setHours(0, 0, 0,0);

        const todayTimestamp = today.getTime();

        if (dateTimestamp < todayTimestamp) {
            throw new ProvidedDateHasPassedException(new Date(dateTimestamp));
        }
    }
}