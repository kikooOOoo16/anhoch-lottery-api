import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleTokenVerificationDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}
