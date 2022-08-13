import { Body, Controller, Post, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { NoActiveSessionGuard } from '../../guards/no-active-session.guard';
import { SerializeDataInterceptor } from '../../interceptors/serialize-data.interceptor';
import { UserDocument } from '../../users/models/user.model';
import { UserDTO } from '../../users/dtos/user.dto';
import { GoogleTokenVerificationDTO } from '../dtos/google-token-verification.dto';
import { GoogleAuthService } from '../services/google-auth.service';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private googleAuthService: GoogleAuthService) {}

  @Post('/signup')
  @UseGuards(NoActiveSessionGuard)
  @UseInterceptors(new SerializeDataInterceptor(UserDTO))
  async singUpUserWithGoogle(
    @Body() googleTokenVerificationDto: GoogleTokenVerificationDTO,
    @Session() session: any,
  ): Promise<UserDocument> {
    const user: UserDocument = await this.googleAuthService.signUpUserWithGoogle(googleTokenVerificationDto.token);
    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  @UseGuards(NoActiveSessionGuard)
  @UseInterceptors(new SerializeDataInterceptor(UserDTO))
  async signInUserWithGoogle(
    @Body() googleTokenVerificationDto: GoogleTokenVerificationDTO,
    @Session() session: any,
  ): Promise<UserDocument> {
    const user: UserDocument = await this.googleAuthService.signInUserWithGoogle(googleTokenVerificationDto.token);
    session.userId = user.id;

    return user;
  }
}
