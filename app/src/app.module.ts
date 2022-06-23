import {MiddlewareConsumer, Module, ValidationPipe} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {AuthModule} from './auth/auth.module';
import {APP_PIPE} from "@nestjs/core";
import {UsersModule} from './users/users.module';

const cookieSession = require('cookie-session');

const configModuleOptions = {
    isGlobal: true,
    envFilePath: `.env.${process.env.NODE_ENV}`
}

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        MongooseModule.forRoot(process.env.MONGO_DB_URL, {
            dbName: process.env.MONGO_DB_NAME
        }),
        AuthModule,
        UsersModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true
            })
        }
    ],
})
export class AppModule {

    constructor(private configService: ConfigService) {
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieSession(
            {
                keys: [this.configService.get('COOKIE_SECRET')]
            })
        ).forRoutes('*');
    }
}
