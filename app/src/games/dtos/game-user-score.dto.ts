import { Expose, Transform } from 'class-transformer';

export class GameUserScoreDTO {
  @Expose()
  _id: string;

  @Expose()
  time: number;

  @Expose()
  score: number;

  @Transform(({ obj }) => obj.gameLeaderboard.id)
  @Expose()
  leaderBoardId: string;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: string;
}
