import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.model';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { Buffer } from 'buffer';
import { CurrentUserMiddleware } from './middleware/current-user.middleware';
import { ProfileImageSchema } from './models/profile-image.model';
import { UsersImagesService } from './services/users-images.service';
import { CoverImageSchema } from './models/cover-image.model';

// native scrypt doesn't work with promise
const scrypt = promisify(_scrypt);

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: () => {
          const schema = UserSchema;
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
    MongooseModule.forFeature([
      { name: 'ProfileImage', schema: ProfileImageSchema },
      { name: 'CoverImage', schema: CoverImageSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersImagesService],
  exports: [UsersService, UsersImagesService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
