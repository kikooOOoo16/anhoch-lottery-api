import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateCommercialDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  name: string;

  @IsUrl()
  @IsOptional()
  @MaxLength(150)
  website: string;
}
