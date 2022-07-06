import { Module } from '@nestjs/common';
import { GamesController } from './controllers/games.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';
import { GameSchema } from './models/game.model';
import { ActiveDateSchema } from './models/active-date.model';
import { ActiveGameSessionSchema } from './models/active-game-session.model';
import { GameLeaderboardSchema } from './models/game-leaderboard.model';
import { UserScoreSchema } from './models/user-score.model';
import { GamesService } from './services/games.service';
import { GamesFindService } from './services/games-find.service';
import { GamesActivePoolService } from './services/games-active-pool.service';
import { GamesActiveDateService } from './services/games-active-date.service';
import { GamesSessionService } from './services/games-session.service';
import { GamesLeaderboardsService } from './services/games-leaderboards.service';
import { GamesDayCycleService } from './services/games-day-cycle.service';
import { GamesUsersScoreService } from './services/games-users-score.service';
import { GamesLeaderboardsFindService } from './services/games-leaderboards-find.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Game', schema: GameSchema },
      { name: 'ActiveDate', schema: ActiveDateSchema },
      { name: 'ActiveGameSession', schema: ActiveGameSessionSchema },
      { name: 'GameLeaderboard', schema: GameLeaderboardSchema },
      { name: 'UserScore', schema: UserScoreSchema },
    ]),
    UsersModule,
    CommonModule,
  ],
  controllers: [GamesController],
  providers: [
    GamesService,
    GamesFindService,
    GamesActivePoolService,
    GamesActiveDateService,
    GamesSessionService,
    GamesLeaderboardsService,
    GamesDayCycleService,
    GamesUsersScoreService,
    GamesLeaderboardsFindService,
  ],
})
export class GamesModule {}
