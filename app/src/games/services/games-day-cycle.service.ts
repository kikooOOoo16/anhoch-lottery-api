import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../../users/services/users.service';
import { UserDocument } from '../../users/models/user.model';
import { GamesSessionService } from './games-session.service';

@Injectable()
export class GamesDayCycleService {
  constructor(private usersService: UsersService, private gamesSessionService: GamesSessionService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleActiveGameCycle() {
    const users: UserDocument[] = await this.usersService.findAll();

    for (const user of users) {
      await this.usersService.modifyPlayedTodayStatus(user, false);

      const activeGameSession = await this.gamesSessionService.findUserActiveGameSession(user, true);

      if (activeGameSession) {
        await this.gamesSessionService.stopSession(user);
      }
    }
  }
}
