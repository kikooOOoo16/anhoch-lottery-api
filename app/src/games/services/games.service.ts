import {Injectable, Logger} from '@nestjs/common';
import {CreateGameDTO} from "../dtos/create-game.dto";
import {InjectModel} from "@nestjs/mongoose";
import {GameDocument} from "../models/game.model";
import {Model} from "mongoose";
import {ProblemCreatingGameException} from "../../exceptions/game-related/problem-creating-game.exception";
import {ProblemDeletingGameException} from "../../exceptions/game-related/problem-deleting-game.exception";

@Injectable()
export class GamesService {

    constructor(
        @InjectModel('Game') private readonly gameModel: Model<GameDocument>) {}

    async create(createGameDTO: CreateGameDTO): Promise<GameDocument> {
        try {
            const game: GameDocument = new this.gameModel(createGameDTO);
            return await game.save();
        } catch (e) {
            Logger.error(e, 'games.service.ts: create()');
            throw new ProblemCreatingGameException();
        }
    }

    async delete(id: string) {
        try {
            return await this.gameModel.findByIdAndDelete(id);
        } catch (e) {
            Logger.error(e, 'games.service.ts: create()');
            throw new ProblemDeletingGameException();
        }
    }
}
