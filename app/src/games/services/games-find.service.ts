import { Injectable, Logger } from '@nestjs/common';
import { Game, GameDocument } from '../models/game.model';
import { ProblemRetrievingGameException } from '../../exceptions/game-related/problem-retrieving-game.exception';
import { NoGameFoundException } from '../../exceptions/game-related/no-game-found.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProblemRetrievingAllGamesException } from '../../exceptions/game-related/problem-retrieving-all-games.exception';
import { ProblemRetrievingActivePoolGamesException } from '../../exceptions/game-related/active-game-pool/problem-retrieving-active-pool-games.exception';
import { NoActiveGameFoundForTodayException } from '../../exceptions/game-related/active-date/no-active-game-found-for-today.exception';
import { HelperService } from '../../common/services/helper.service';
import { ActiveDateDocument } from '../models/active-date.model';
import { ProblemRetrievingActiveGameForTodayException } from '../../exceptions/game-related/active-date/problem-retrieving-active-game-for-today.exception';

@Injectable()
export class GamesFindService {
  constructor(
    @InjectModel('Game') private readonly gameModel: Model<GameDocument>,
    @InjectModel('ActiveDate')
    private readonly activeDateModel: Model<ActiveDateDocument>,
  ) {}

  async findById(id: string | Game): Promise<GameDocument> {
    let game: GameDocument;
    try {
      game = await this.gameModel.findById(id).populate('activeDates').exec();
    } catch (e) {
      Logger.error(e, 'games-find.service: create()');
      throw new ProblemRetrievingGameException();
    }

    if (!game) {
      throw new NoGameFoundException();
    }

    return game;
  }

  async findAll(): Promise<GameDocument[]> {
    try {
      return await this.gameModel.find().populate('activeDates').exec();
    } catch (e) {
      Logger.error(e, 'games-find.service: create()');
      throw new ProblemRetrievingAllGamesException();
    }
  }

  async findAllFilterByActivePool(inActivePool): Promise<GameDocument[]> {
    try {
      return await this.gameModel.find({
        inActivePool,
      });
    } catch (e) {
      Logger.error(e, 'games-find.service: getAllActivePoolGames()');
      throw new ProblemRetrievingActivePoolGamesException();
    }
  }

  async findActiveGameForToday(): Promise<GameDocument> {
    let activeDate: ActiveDateDocument;
    const currentDateTimestamp = HelperService.getCurrentDateTimeStamp();

    try {
      activeDate = await this.activeDateModel.findOne({
        date: currentDateTimestamp,
      });
    } catch (e) {
      Logger.error(e, 'games-find.service: findActiveGameForToday');
      throw new ProblemRetrievingActiveGameForTodayException();
    }

    if (!activeDate) {
      throw new NoActiveGameFoundForTodayException();
    }

    return await this.findById(activeDate.game);
  }
}
