import {Module} from '@nestjs/common';
import {GamesController} from './controllers/games.controller';
import {GamesService} from './services/games.service';
import {MongooseModule} from "@nestjs/mongoose";
import {GameSchema} from "./models/game.model";
import {ActiveDateSchema} from "./models/active-date.model";
import {GamesFindService} from "./services/games-find.service";
import {GamesActivePoolService} from "./services/games-active-pool.service";
import {CommonModule} from "../common/common.module";
import {GamesActiveDateService} from "./services/games-active-date.service";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {name: 'Game', schema: GameSchema},
                {name: 'ActiveDate', schema: ActiveDateSchema}
            ]
        ),
        CommonModule,
    ],
    controllers: [GamesController],
    providers: [
        GamesService,
        GamesFindService,
        GamesActivePoolService,
        GamesActiveDateService
    ]
})
export class GamesModule {
}
