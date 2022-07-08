import { Injectable, Logger } from '@nestjs/common';
import { CreateGameDTO } from '../dtos/create-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { GameDocument } from '../models/game.model';
import { Model } from 'mongoose';
import { ProblemCreatingGameException } from '../../exceptions/game-related/problem-creating-game.exception';
import { ProblemDeletingGameException } from '../../exceptions/game-related/problem-deleting-game.exception';
import { GameLeaderboardDocument } from '../models/game-leaderboard.model';
import { ProblemAddingLeaderboardToGameException } from '../../exceptions/game-related/game-leaderboards/problem-adding-leaderboard-to-game.exception';
import { ProblemRemovingLeaderboardFromGamesListException } from '../../exceptions/game-related/game-leaderboards/problem-removing-leaderboard-from-games-list.exception';

@Injectable()
export class GamesService {
  constructor(@InjectModel('Game') private readonly gameModel: Model<GameDocument>) {}

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

  async addLeaderboardToGameLeaderboardsList(
    game: GameDocument,
    leaderboard: GameLeaderboardDocument,
  ): Promise<GameDocument> {
    game.gameLeaderboards
      ? (game.gameLeaderboards = [...game.gameLeaderboards, leaderboard.id])
      : (game.gameLeaderboards = [leaderboard.id]);

    try {
      return await game.save();
    } catch (e) {
      Logger.error(e, 'games.service: addLeaderboardToGameLeaderboardsList()');
      throw new ProblemAddingLeaderboardToGameException();
    }
  }

  async removeLeaderboardFromGame(game: GameDocument, leaderboard: GameLeaderboardDocument): Promise<GameDocument> {
    game.gameLeaderboards = game.gameLeaderboards.filter(leaderboardId => leaderboardId.toString() !== leaderboard.id);

    try {
      return await game.save();
    } catch (e) {
      Logger.error(e, 'games.service: removeLeaderboardFromGame()');
      throw new ProblemRemovingLeaderboardFromGamesListException();
    }
  }
}
