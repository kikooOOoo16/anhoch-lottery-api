import {Module} from '@nestjs/common';
import {CommercialsService} from './services/commercials.service';
import {CommercialsController} from './controllers/commercials.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {CommercialSchema} from "./models/commercial.model";
import {CommonModule} from "../common/common.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Commercial', schema: CommercialSchema}
        ]),
        CommonModule
    ],
    providers: [CommercialsService],
    controllers: [CommercialsController]
})
export class CommercialsModule {
}
