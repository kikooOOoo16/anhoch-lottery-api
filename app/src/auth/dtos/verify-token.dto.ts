import { IsString, Length } from 'class-validator';

export class VerifyTokenDTO {
  @IsString()
  @Length(24)
  tokenId: string;
}
