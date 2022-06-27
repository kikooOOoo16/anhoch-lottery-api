import {Injectable} from "@nestjs/common";
import {GameDocument} from "../models/game.model";
import {GameAlreadyHasThatActivePoolStatusExceptions} from "../../exceptions/game-related/active-game-pool/game-already-has-that-active-pool-status.exceptions";
import {ProblemModifyingGamesActivePoolStatusException} from "../../exceptions/game-related/active-game-pool/problem-modifying-games-active-pool-status.exception";
import {GamesFindService} from "./games-find.service";

@Injectable()
export class GamesActivePoolService {

    constructor(private gamesFindService: GamesFindService) {}

    async modifyGameActivePoolStatus(id, status): Promise<GameDocument> {
        const game: GameDocument = await this.gamesFindService.findById(id);

        if (game.inActivePool === status) {
            throw new GameAlreadyHasThatActivePoolStatusExceptions(status);
        }

        game.inActivePool = status;

        try {
            return await game.save();
        } catch (e) {
            throw new ProblemModifyingGamesActivePoolStatusException();
        }
    }
}