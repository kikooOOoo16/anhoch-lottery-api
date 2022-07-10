import { IsBoolean, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateCommercialStatisticsDTO {
  @IsString()
  filename: string;

  @IsNumber()
  @Min(1)
  @Max(400)
  watchedSeconds: number;

  @IsBoolean()
  watchedFull: boolean;

  @IsBoolean()
  visitedLink: boolean;

  @IsNumber()
  @Min(1)
  @Max(31)
  day: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  @Min(2022)
  @Max(2052)
  year: number;
}
