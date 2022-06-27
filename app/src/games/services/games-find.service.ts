import {Injectable, Logger} from "@nestjs/common";
import {GameDocument} from "../models/game.model";
import {ProblemRetrievingGameException} from "../../exceptions/game-related/problem-retrieving-game.exception";
import {NoGameFoundException} from "../../exceptions/game-related/no-game-found.exception";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {ProblemRetrievingAllGamesException} from "../../exceptions/game-related/problem-retrieving-all-games.exception";
import {ProblemRetrievingActivePoolGamesException} from "../../exceptions/game-related/active-game-pool/problem-retrieving-active-pool-games.exception";

@Injectable()
export class GamesFindService {

    constructor(@InjectModel('Game') private readonly gameModel: Model<GameDocument>) {}

    async findById(id: string): Promise<GameDocument> {
        let game: GameDocument;
        try {
            game = await this.gameModel
                .findById(id)
                .populate('activeDates')
                .exec();
        } catch (e) {
            Logger.error(e, 'games.service.ts: create()');
            throw new ProblemRetrievingGameException();
        }

        if (!game) {
            throw new NoGameFoundException();
        }

        return game;
    }

    async findAll(): Promise<GameDocument[]> {
        try {
            return await this.gameModel
                .find()
                .populate('activeDates')
                .exec();
        } catch (e) {
            Logger.error(e, 'games.service.ts: create()');
            throw new ProblemRetrievingAllGamesException();
        }
    }

    async findAllFilterByActivePool(inActivePool): Promise<GameDocument[]> {
        try {
            return await this.gameModel
                .find({
                    inActivePool
                });
        } catch (e) {
            Logger.error(e, 'games.service.ts: getAllActivePoolGames()');
            throw new ProblemRetrievingActivePoolGamesException();
        }
    }
}