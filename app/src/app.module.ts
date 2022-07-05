import {MiddlewareConsumer, Module, ValidationPipe} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {AuthModule} from './auth/auth.module';
import {APP_PIPE} from "@nestjs/core";
import {UsersModule} from './users/users.module';
import {CommonModule} from "./common/common.module";
import {AdminsModule} from './admins/admins.module';
import {GamesModule} from './games/games.module';
import {ScheduleModule} from "@nestjs/schedule";
import { CommercialsModule } from './commercials/commercials.module';
import * as Joi from '@hapi/joi';

const cookieSession = require('cookie-session');

const configModuleOptions = {
    isGlobal: true,
    envFilePath: `.env.${process.env.NODE_ENV}`,
    validationSchema: Joi.object({
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
    })
}

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        MongooseModule.forRoot(process.env.MONGO_DB_URL, {
            dbName: process.env.MONGO_DB_NAME
        }),
        ScheduleModule.forRoot(),
        AuthModule,
        UsersModule,
        CommonModule,
        AdminsModule,
        GamesModule,
        CommercialsModule
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
