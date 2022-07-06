import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [UsersModule, AdminsModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
