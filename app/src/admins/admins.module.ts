import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdminsController } from './controllers/admins.controller';
import { AdminsService } from './services/admins.service';
import { MongooseModule } from '@nestjs/mongoose';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { Buffer } from 'buffer';
import { promisify } from 'util';
import { AdminSchema } from './models/admin.model';
import { CommonModule } from '../common/common.module';
import { CurrentAdminMiddleware } from './middleware/current-admin.middleware';
import { UsersModule } from '../users/users.module';

// native scrypt doesn't work with promise
const scrypt = promisify(_scrypt);

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Admin',
        useFactory: () => {
          const schema = AdminSchema;
          schema.pre('save', async function (next) {
            if (this.isModified('password')) {
              const salt = randomBytes(8).toString('hex');
              const hash = (await scrypt(this.password, salt, 32)) as Buffer;

              this.password = salt + '.' + hash.toString('hex');

              next();
            }
          });
          return schema;
        },
      },
    ]),
    CommonModule,
    UsersModule,
  ],
  exports: [AdminsService],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentAdminMiddleware).forRoutes('*');
  }
}
