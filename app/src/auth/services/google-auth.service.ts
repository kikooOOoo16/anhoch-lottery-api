import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { Auth, google, oauth2_v2 } from 'googleapis';
import { UserDocument } from '../../users/models/user.model';
import { InvalidGoogleTokenException } from '../../exceptions/auth-related/invalid-google-token.exception';
import { GoogleAuthNotEnabledForAccountException } from '../../exceptions/auth-related/google-auth-not-enabled-for-account.exception';

@Injectable()
export class GoogleAuthService {
  readonly oauthClient: Auth.OAuth2Client;
  constructor(private usersService: UsersService) {
    this.oauthClient = new google.auth.OAuth2(process.env.GOOGLE_AUTH_CLIENT_ID, process.env.GOOGLE_AUTH_CLIENT_SECRET);
  }

  async signUpUserWithGoogle(token: string): Promise<UserDocument> {
    const userData: oauth2_v2.Schema$Userinfo = await this.getUserDataFromGoogle(token);

    return await this.usersService.createWithGoogle(userData);
  }

  async signInUserWithGoogle(token: string): Promise<UserDocument> {
    let tokenInfo: Auth.TokenInfo;

    try {
      tokenInfo = await this.oauthClient.getTokenInfo(token);
    } catch (e) {
      Logger.error(e, 'google-auth.service; signInUserWithGoogle()');
      throw new InvalidGoogleTokenException();
    }

    const email: string = tokenInfo.email;

    const user: UserDocument = await this.usersService.findByEmail(email);

    if (!user.isRegisteredWithGoogle || !user.isVerified) {
      throw new GoogleAuthNotEnabledForAccountException();
    }

    return user;
  }

  async getUserDataFromGoogle(token: string): Promise<oauth2_v2.Schema$Userinfo> {
    const userInfoClient: oauth2_v2.Resource$Userinfo = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }
}
