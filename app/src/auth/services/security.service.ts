import { Injectable, Logger } from '@nestjs/common';
import { UserDocument } from '../../users/models/user.model';
import { AdminDocument } from '../../admins/models/admin.model';
import { Buffer } from 'buffer';
import { WrongCredentialsException } from '../../exceptions/auth-related/wrong-credentials.exception';
import { promisify } from 'util';
import { scrypt as _scrypt } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenDocument } from '../models/token.model';
import { ProblemCreatingTokenException } from '../../exceptions/auth-related/problem-creating-token.exception';
import { TokenExpiredException } from '../../exceptions/auth-related/token-expired.exception';
import { TokenType } from '../enums/token-type.enum';
import { ProblemDeletingTokenException } from '../../exceptions/auth-related/problem-deleting-token.exception';
import { UserTokenNotFoundException } from '../../exceptions/auth-related/user-token-not-found.exception';
import { UserPasswordResetTokenNotVerifiedException } from '../../exceptions/auth-related/user-password-reset-token-not-verified.exception';

// native scrypt doesn't work with promise
const scrypt = promisify(_scrypt);

@Injectable()
export class SecurityService {
  constructor(@InjectModel('Token') private readonly tokenModel: Model<TokenDocument>) {}

  async generateToken(type: TokenType): Promise<TokenDocument> {
    const expiresAtTimeStamp = Date.now() + 600000;
    try {
      return await this.tokenModel.create({
        expiresAtTimeStamp,
        type: type === TokenType.USER_WELCOME ? TokenType.USER_WELCOME : TokenType.USER_RESET_PASSWORD,
      });
    } catch (e) {
      Logger.error(e, 'security.service: generateToken()');
      throw new ProblemCreatingTokenException();
    }
  }

  async deleteTokenById(tokenId: string): Promise<void> {
    try {
      await this.tokenModel.findByIdAndDelete(tokenId);
    } catch (e) {
      Logger.error(e, 'security.service: deleteToken()');
      throw new ProblemDeletingTokenException();
    }
  }

  async verifyUsersTokenExpirationAndStatus(user: UserDocument): Promise<void> {
    if (!user.token) {
      throw new UserTokenNotFoundException();
    } else if (!user.token.verified) {
      throw new UserPasswordResetTokenNotVerifiedException();
    }

    SecurityService.checkIfTokenExpired(user.token);
  }

  public static checkIfTokenExpired(token: TokenDocument): void {
    const result = Date.now() - token.expiresAtTimeStamp;
    if (result > 0) {
      throw new TokenExpiredException();
    }
  }

  public static async validatePassword(account: UserDocument | AdminDocument, password: string): Promise<void> {
    const [salt, storedHash] = account.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new WrongCredentialsException();
    }
  }
}
