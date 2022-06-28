import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors} from '@nestjs/common';
import {AdminActiveSessionGuard} from "../../guards/admin-active-session.guard";
import {GamesService} from "../services/games.service";
import {CreateGameDTO} from "../dtos/create-game.dto";
import {ModifyGameActivePoolStatusDTO} from "../dtos/modify-game-active-pool-status.dto";
import {ModifyActiveGameDateDTO} from "../dtos/modify-active-game-date.dto";
import {GamesFindService} from "../services/games-find.service";
import {GamesActivePoolService} from "../services/games-active-pool.service";
import {GamesActiveDateService} from "../services/games-active-date.service";
import {UserActiveSessionGuard} from "../../guards/user-active-session.guard";
import {CurrentUser} from "../../users/decorators/current-user.decorator";
import {UserDocument} from "../../users/models/user.model";
import {AnyActiveSessionGuard} from "../../guards/any-active-session.guard";
import {Game, GameDocument} from "../models/game.model";
import {ActiveDateDocument} from "../models/active-date.model";
import {GamesSessionService} from "../services/games-session.service";
import {ActiveGameSessionDocument} from "../models/active-game-session.model";
import {SerializeDataInterceptor} from "../../interceptors/serialize-data.interceptor";
import {ActiveGameSessionDTO} from "../dtos/active-game-session.dto";

@Controller('game')
export class GamesController {

    constructor(
        private gamesService: GamesService,
        private gamesFindService: GamesFindService,
        private gamesActivePoolService: GamesActivePoolService,
        private gamesActiveDateService: GamesActiveDateService,
        private gamesSessionService: GamesSessionService) {}

    @Post()
    @UseGuards(AdminActiveSessionGuard)
    async createGame(@Body() createGameDTO: CreateGameDTO) {
        return await this.gamesService.create(createGameDTO);
    }

    @Delete('/:id')
    @UseGuards(AdminActiveSessionGuard)
    async deleteGame(@Param('id') gameId: string): Promise<GameDocument> {
        return await this.gamesService.delete(gameId);
    }

    @Get('/active-today')
    @UseGuards(AnyActiveSessionGuard)
    async getActiveGameForToday(): Promise<Game> {
        return await this.gamesFindService.findActiveGameForToday();
    }

    @Get('/all')
    @UseGuards(AdminActiveSessionGuard)
    async getAllGames(): Promise<GameDocument[]> {
        return await this.gamesFindService.findAll();
    }

    @Get('/all/active-pool')
    @UseGuards(AdminActiveSessionGuard)
    async getAllGamesInActivePool(): Promise<GameDocument[]> {
        return await this.gamesFindService.findAllFilterByActivePool(true);
    }

    @Get('/all/not-active-pool')
    @UseGuards(AdminActiveSessionGuard)
    async getAllGamesNotInActivePool(): Promise<GameDocument[]> {
        return await this.gamesFindService.findAllFilterByActivePool(false);
    }

    @Patch('/:id/active-pool-status')
    @UseGuards(AdminActiveSessionGuard)
    async modifyGamesActivePoolStatus(@Param('id') gameId: string, @Body() {status}: ModifyGameActivePoolStatusDTO): Promise<GameDocument> {
        return await this.gamesActivePoolService.modifyGameActivePoolStatus(gameId, status);
    }

    @Post('/:id/set-active')
    @UseGuards(AdminActiveSessionGuard)
    async setActiveDateForGame(@Param('id') gameId: string, @Body() modifyActiveGameDateDTO: ModifyActiveGameDateDTO): Promise<ActiveDateDocument> {
        return await this.gamesActiveDateService.setActiveDate(gameId, modifyActiveGameDateDTO)
    }

    @Delete('/:id/remove-active')
    @UseGuards(AdminActiveSessionGuard)
    async removeActiveDateForGame(@Param('id') gameId: string, @Body() modifyActiveGameDateDTO: ModifyActiveGameDateDTO): Promise<ActiveDateDocument> {
        return await this.gamesActiveDateService.removeActiveDate(gameId, modifyActiveGameDateDTO);
    }

    @Post('/start')
    @UseGuards(UserActiveSessionGuard)
    @UseInterceptors(new SerializeDataInterceptor(ActiveGameSessionDTO))
    async startGameSession(@CurrentUser() user: UserDocument): Promise<ActiveGameSessionDocument> {
        return await this.gamesSessionService.startSession(user);
    }

    @Post('/stop')
    @UseGuards(UserActiveSessionGuard)
    async stopGameSession(@CurrentUser() user: UserDocument) {
        return await this.gamesSessionService.stopSession(user);
    }
}
