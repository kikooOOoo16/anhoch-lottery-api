import { Expose, Transform } from 'class-transformer';

export class ActiveGameSessionDTO {
  @Expose()
  @Transform(({ obj }) => obj.id)
  sessionId: string;

  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: string;

  @Expose()
  @Transform(({ obj }) => obj.game.id)
  gameId: string;

  @Expose()
  startTimeStamp: number;
}
