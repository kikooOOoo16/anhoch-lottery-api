import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../models/user.model';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { ProblemCreatingNewUserException } from '../../exceptions/user-related/problem-creating-new-user.exception';
import { ProblemRetrievingUserDataException } from '../../exceptions/user-related/problem-retrieving-user-data.exception';
import { NoUserFoundException } from '../../exceptions/user-related/no-user-found.exception';
import { HelperService } from '../../common/services/helper.service';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { ProblemUpdatingUserDataException } from '../../exceptions/user-related/problem-updating-user-data.exception';
import { ProblemUpdatingPlayedTodayStatusException } from '../../exceptions/user-related/problem-updating-played-today-status.exception';
import { ProblemRetrievingUsersException } from '../../exceptions/user-related/problem-retrieving-users.exception';
import { TokenDocument } from '../../auth/models/token.model';
import { TokenType } from '../../auth/enums/token-type.enum';
import { ProblemSettingUserResetTokenException } from '../../exceptions/user-related/problem-setting-user-reset-token.exception';
import { ProblemUpdatingResetPasswordTokenStatusException } from '../../exceptions/auth-related/problem-updating-reset-password-token-status.exception';
import { ProblemResettingUserPasswordException } from '../../exceptions/user-related/problem-resetting-user-password.exception';
import { oauth2_v2 } from 'googleapis';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {}

  async create(createUserDTO: CreateUserDTO, token: TokenDocument): Promise<UserDocument> {
    const newUser: UserDocument = new this.userModel(createUserDTO);
    newUser.token = token;

    try {
      return await newUser.save();
    } catch (e) {
      Logger.error(e, 'users.service.ts: create()');
      HelperService.handleDuplicateKeyErr(e);

      throw new ProblemCreatingNewUserException();
    }
  }

  async createWithGoogle(userData: oauth2_v2.Schema$Userinfo): Promise<UserDocument> {
    const newUser: UserDocument = new this.userModel({
      email: userData.email,
      firstName: userData.name,
      lastName: userData.family_name,
      isVerified: true,
      isRegisteredWithGoogle: true,
    });

    try {
      return await newUser.save();
    } catch (e) {
      Logger.error(e, 'users.service: createWithGoogle()');
      HelperService.handleDuplicateKeyErr(e);

      throw new ProblemCreatingNewUserException();
    }
  }

  async update(user: UserDocument, updateUserDTO: Partial<UpdateUserDTO>): Promise<UserDocument> {
    HelperService.checkIfObjectIsEmpty(updateUserDTO);

    Object.assign(user, updateUserDTO);

    try {
      return await this.userModel.findByIdAndUpdate(user.id, { ...user }, { new: true });
    } catch (e) {
      Logger.error(e, 'users.service.ts: update()');
      HelperService.handleDuplicateKeyErr(e);

      throw new ProblemUpdatingUserDataException();
    }
  }

  async setToken(user: UserDocument, token: TokenDocument): Promise<UserDocument> {
    user.token = token;
    try {
      return await user.save();
    } catch (e) {
      Logger.error(e, 'users.service: setToken()');
      throw new ProblemSettingUserResetTokenException();
    }
  }

  async modifyPlayedTodayStatus(user: UserDocument, playedToday: boolean) {
    let updatedUser: UserDocument;
    try {
      updatedUser = await this.userModel.findByIdAndUpdate(
        user.id,
        {
          playedToday,
        },
        { new: true },
      );
    } catch (e) {
      Logger.error(e, 'users.service.ts: modifyPlayedTodayStatus');
      throw new ProblemUpdatingPlayedTodayStatusException();
    }

    if (!updatedUser) {
      throw new NoUserFoundException();
    }

    return updatedUser;
  }

  async updateVerifyStatus(user: UserDocument): Promise<UserDocument> {
    user.isVerified = true;
    user.token = null;

    try {
      return await user.save();
    } catch (e) {
      Logger.error(e, 'users.service: updateVerifyStatus()');
      throw new ProblemUpdatingUserDataException();
    }
  }

  async updateUserResetPasswordTokenStatus(user: UserDocument) {
    user.token.verified = true;

    try {
      return await user.save();
    } catch (e) {
      Logger.error(e, 'users.service: updateUserResetPasswordTokenStatus()');
      throw new ProblemUpdatingResetPasswordTokenStatusException();
    }
  }

  async updateUserPassword(user: UserDocument, password: string): Promise<UserDocument> {
    user.password = password;
    user.token = null;

    try {
      return await user.save();
    } catch (e) {
      Logger.error(e, 'users.service: updateUserPassword()');
      throw new ProblemResettingUserPasswordException();
    }
  }

  async findByEmail(email: string): Promise<UserDocument> {
    let user: UserDocument;
    try {
      user = await this.userModel.findOne({ email }).populate('token').exec();
    } catch (e) {
      Logger.error(e, 'users.service.ts: findByEmail()');
      throw new ProblemRetrievingUserDataException();
    }

    if (!user) {
      throw new NoUserFoundException();
    }

    return user;
  }

  async findById(id: string): Promise<UserDocument> {
    try {
      return await this.userModel.findById(id);
    } catch (e) {
      Logger.error(e, 'users.service.ts: findByEmail()');
      throw new ProblemRetrievingUserDataException();
    }
  }

  async findByTokenId(token: string, tokenType: TokenType): Promise<UserDocument> {
    let user: UserDocument;
    try {
      user = await this.userModel.findOne({
        'token._id': token,
        'token.type': tokenType,
      });
    } catch (e) {
      throw new ProblemRetrievingUserDataException();
    }

    if (!user) {
      throw new NoUserFoundException();
    }

    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    try {
      return await this.userModel.find();
    } catch (e) {
      Logger.error(e, 'users.service.ts: findAll()');
      throw new ProblemRetrievingUsersException();
    }
  }
}
