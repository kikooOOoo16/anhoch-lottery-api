import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { AdminsModule } from '../admins/admins.module';
import { EmailModule } from '../email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './models/token.model';
import { SecurityService } from './services/security.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]),
    UsersModule,
    AdminsModule,
    EmailModule,
  ],
  providers: [AuthService, SecurityService],
  controllers: [AuthController],
})
export class AuthModule {}
