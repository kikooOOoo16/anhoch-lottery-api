import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {AdminActiveSessionGuard} from "../../guards/admin-active-session.guard";
import {GamesService} from "../services/games.service";
import {CreateGameDTO} from "../dtos/create-game.dto";
import {ModifyGameActivePoolStatusDTO} from "../dtos/modify-game-active-pool-status.dto";
import {ModifyActiveGameDateDTO} from "../dtos/modify-active-game-date.dto";
import {GamesFindService} from "../services/games-find.service";
import {GamesActivePoolService} from "../services/games-active-pool.service";
import {GamesActiveDateService} from "../services/games-active-date.service";

@Controller('game')
export class GamesController {

    constructor(
        private gamesService: GamesService,
        private gamesFindService: GamesFindService,
        private gamesActivePoolService: GamesActivePoolService,
        private gamesActiveDateService: GamesActiveDateService) {}

    @Post()
    @UseGuards(AdminActiveSessionGuard)
    async createGame(@Body() createGameDTO: CreateGameDTO) {
        return await this.gamesService.create(createGameDTO);
    }

    @Delete('/:id')
    @UseGuards(AdminActiveSessionGuard)
    async deleteGame(@Param('id') gameId: string) {
        return await this.gamesService.delete(gameId);
    }

    @Get('/all')
    @UseGuards(AdminActiveSessionGuard)
    async getAllGames() {
        return await this.gamesFindService.findAll();
    }

    @Get('/all/active-pool')
    @UseGuards(AdminActiveSessionGuard)
    async getAllGamesInActivePool() {
        return await this.gamesFindService.findAllFilterByActivePool(true);
    }

    @Get('/all/not-active-pool')
    @UseGuards(AdminActiveSessionGuard)
    async getAllGamesNotInActivePool() {
        return await this.gamesFindService.findAllFilterByActivePool(false);
    }

    @Patch('/:id/active-pool-status')
    @UseGuards(AdminActiveSessionGuard)
    async modifyGamesActivePoolStatus(@Param('id') gameId: string, @Body() {status}: ModifyGameActivePoolStatusDTO) {
        return await this.gamesActivePoolService.modifyGameActivePoolStatus(gameId, status);
    }

    @Post('/:id/set-active')
    @UseGuards(AdminActiveSessionGuard)
    async setActiveDateForGame(@Param('id') gameId: string, @Body() modifyActiveGameDateDTO: ModifyActiveGameDateDTO) {
        return await this.gamesActiveDateService.setActiveDate(gameId, modifyActiveGameDateDTO)
    }

    @Delete('/:id/remove-active')
    @UseGuards(AdminActiveSessionGuard)
    async removeActiveDateForGame(@Param('id') gameId: string, @Body() modifyActiveGameDateDTO: ModifyActiveGameDateDTO) {
        return await this.gamesActiveDateService.removeActiveDate(gameId, modifyActiveGameDateDTO);
    }
}
