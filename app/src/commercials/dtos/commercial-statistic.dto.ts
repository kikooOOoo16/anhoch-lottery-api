import { Expose, Transform } from 'class-transformer';

export class CommercialStatisticDTO {
  @Expose()
  _id: string;

  @Transform(({ obj }) => obj.commercial._id)
  @Expose()
  commercialId: string;

  @Transform(({ obj }) => obj.user._id)
  @Expose()
  userId: string;

  @Expose()
  watchedSeconds: string;

  @Expose()
  watchedFull: boolean;

  @Expose()
  visitedLink: boolean;

  @Expose()
  date: number;
}
