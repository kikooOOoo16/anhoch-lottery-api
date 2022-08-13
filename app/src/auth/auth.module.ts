import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { AdminsModule } from '../admins/admins.module';
import { EmailModule } from '../email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './models/token.model';
import { SecurityService } from './services/security.service';
import { GoogleAuthController } from './controllers/google-auth.controller';
import { GoogleAuthService } from './services/google-auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]),
    UsersModule,
    AdminsModule,
    EmailModule,
  ],
  providers: [AuthService, SecurityService, GoogleAuthService],
  controllers: [AuthController, GoogleAuthController],
})
export class AuthModule {}
