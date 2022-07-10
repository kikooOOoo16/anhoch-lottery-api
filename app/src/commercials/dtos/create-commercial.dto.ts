import { IsNumber, IsOptional, IsString, IsUrl, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCommercialDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  name: string;

  @IsNumber()
  @IsOptional()
  @Min(3)
  @Max(20)
  minimumWatchSeconds: number;

  @IsUrl()
  @IsOptional()
  @MaxLength(150)
  website: string;
}
