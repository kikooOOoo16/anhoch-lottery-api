import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { SignInDTO } from '../dtos/sign-in.dto';
import { UserDocument } from '../../users/models/user.model';
import { AdminsService } from '../../admins/services/admins.service';
import { AdminDocument } from '../../admins/models/admin.model';
import { EmailService } from '../../email/services/email.service';
import { SecurityService } from './security.service';
import { TokenDocument } from '../models/token.model';
import { VerifyTokenDTO } from '../dtos/verify-token.dto';
import { ForgotPasswordDTO } from '../dtos/forgot-password.dto';
import { UserEmailNotVerifiedException } from '../../exceptions/user-related/user-email-not-verified.exception';
import { TokenType } from '../enums/token-type.enum';
import { ResetPasswordDTO } from '../dtos/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private securityService: SecurityService,
    private usersService: UsersService,
    private adminsService: AdminsService,
    private emailService: EmailService,
  ) {}

  async signUp(createUserDTO): Promise<UserDocument> {
    const token: TokenDocument = await this.securityService.generateToken(TokenType.USER_WELCOME);
    const user: UserDocument = await this.usersService.create(createUserDTO, token);

    await this.emailService.sendVerificationEmail(
      user.email,
      user.firstName,
      `${process.env.API_URL}/auth/verify-account?tokenId=${user.token.id}`,
    );

    return user;
  }

  async signIn({ email, password }: SignInDTO): Promise<UserDocument> {
    const user: UserDocument = await this.usersService.findByEmail(email);

    await SecurityService.validatePassword(user, password);

    return user;
  }

  async signInAdmin({ email, password }: SignInDTO): Promise<AdminDocument> {
    const admin: AdminDocument = await this.adminsService.findByEmail(email);

    await SecurityService.validatePassword(admin, password);

    return admin;
  }

  async verifyAccount({ tokenId }: VerifyTokenDTO): Promise<UserDocument> {
    const user: UserDocument = await this.usersService.findByTokenId(tokenId, TokenType.USER_WELCOME);

    SecurityService.checkIfTokenExpired(user.token);

    const updatedUser = await this.usersService.updateVerifyStatus(user);
    await this.securityService.deleteTokenById(tokenId);

    return updatedUser;
  }

  async initiateUserResetPassword({ email }: ForgotPasswordDTO) {
    const user: UserDocument = await this.usersService.findByEmail(email);

    if (!user.isVerified) {
      throw new UserEmailNotVerifiedException();
    }

    const token: TokenDocument = await this.securityService.generateToken(TokenType.USER_RESET_PASSWORD);
    await this.usersService.setToken(user, token);

    await this.emailService.sendResetPasswordEmail(
      email,
      `${process.env.API_URL}/auth/verify-reset-password-token?token-id=${token.id}`,
    );
  }

  async verifyResetPasswordToken(tokenId: string): Promise<string> {
    const user: UserDocument = await this.usersService.findByTokenId(tokenId, TokenType.USER_RESET_PASSWORD);
    await this.usersService.updateUserResetPasswordTokenStatus(user);
    return process.env.NG_APP_URL + '/reset-password';
  }

  async resetUserPassword({ email, password }: ResetPasswordDTO): Promise<void> {
    const user: UserDocument = await this.usersService.findByEmail(email);
    await this.securityService.verifyUsersTokenExpirationAndStatus(user);
    await this.usersService.updateUserPassword(user, password);
  }
}
