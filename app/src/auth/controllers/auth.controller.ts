import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { NoActiveSessionGuard } from '../../guards/no-active-session.guard';
import { UserDocument } from '../../users/models/user.model';
import { SignInDTO } from '../dtos/sign-in.dto';
import { AnyActiveSessionGuard } from '../../guards/any-active-session.guard';
import { CreateUserDTO } from '../../users/dtos/create-user.dto';
import { UserDTO } from '../../users/dtos/user.dto';
import { SerializeDataInterceptor } from '../../interceptors/serialize-data.interceptor';
import { AdminDTO } from '../../admins/dtos/admin.dto';
import { AdminDocument } from '../../admins/models/admin.model';
import { VerifyTokenDTO } from '../dtos/verify-token.dto';
import { ForgotPasswordDTO } from '../dtos/forgot-password.dto';
import { Response } from 'express';
import { ResetPasswordDTO } from '../dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(NoActiveSessionGuard)
  @UseInterceptors(new SerializeDataInterceptor(UserDTO))
  async signUpUser(@Body() createUserDTO: CreateUserDTO, @Session() session: any): Promise<UserDocument> {
    const user: UserDocument = await this.authService.signUp(createUserDTO);

    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(NoActiveSessionGuard)
  @UseInterceptors(new SerializeDataInterceptor(UserDTO))
  async signInUser(@Body() signInDTO: SignInDTO, @Session() session: any): Promise<UserDocument> {
    const user = await this.authService.signIn(signInDTO);
    session.userId = user.id;

    return user;
  }

  @Get('/verify-account')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new SerializeDataInterceptor(UserDTO))
  async verifyAccount(@Query() verifyTokenDTO: VerifyTokenDTO): Promise<UserDocument> {
    return await this.authService.verifyAccount(verifyTokenDTO);
  }

  @Post('/forgot-password')
  @UseGuards(NoActiveSessionGuard)
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    await this.authService.initiateUserResetPassword(forgotPasswordDTO);
    return {
      message: 'Password reset email sent.',
    };
  }

  @Get('/verify-reset-password-token')
  @HttpCode(HttpStatus.OK)
  async verifyResetPasswordToken(@Query('token-id') tokenId: string, @Res() res: Response) {
    const redirectUrl = await this.authService.verifyResetPasswordToken(tokenId);
    return res.redirect(redirectUrl);
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  async resetUserPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    await this.authService.resetUserPassword(resetPasswordDTO);
    return {
      message: 'Password reset was successful.',
    };
  }

  @Post('/admin/signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(NoActiveSessionGuard)
  @UseInterceptors(new SerializeDataInterceptor(AdminDTO))
  async signInAdmin(@Body() signInDTO: SignInDTO, @Session() session: any): Promise<AdminDocument> {
    const admin = await this.authService.signInAdmin(signInDTO);
    session.adminId = admin.id;

    return admin;
  }

  @Post('/signout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AnyActiveSessionGuard)
  signOut(@Session() session: any, @Req() req): { message: string } {
    session.userId = null;
    session.adminId = null;
    req.session = null;

    return {
      message: 'Signed out successfully.',
    };
  }
}
