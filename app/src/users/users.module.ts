import {MiddlewareConsumer, Module} from '@nestjs/common';
import {UsersController} from './controllers/users.controller';
import {UsersService} from "./services/users.service";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./models/user.model";
import {randomBytes, scrypt as _scrypt} from "crypto";
import {promisify} from "util";
import {Buffer} from "buffer";
import {CurrentUserMiddleware} from "./middleware/current-user.middleware";

// native scrypt doesn't work with promise
const scrypt = promisify(_scrypt);

@Module({
    imports: [
        MongooseModule.forFeatureAsync([{
            name: 'User',
            useFactory: () => {
                const schema = UserSchema;
                schema.pre('save', async function (next) {
                    const user = this;

                    if (user.isModified('password')) {
                        const salt = randomBytes(8).toString('hex');
                        const hash = (await scrypt(user.password, salt, 32)) as Buffer;

                        user.password = salt + '.' + hash.toString('hex');

                        next();
                    }
                });
                return schema;
            }
        }]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CurrentUserMiddleware).forRoutes('*');
    }
}
