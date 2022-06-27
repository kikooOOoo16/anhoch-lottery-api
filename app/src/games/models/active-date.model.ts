import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import {Game} from "./game.model";
import {Type} from "class-transformer";

export type ActiveDateDocument = ActiveDate & Document;

@Schema()
export class ActiveDate {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Game'})
    @Type(() => Game)
    game: Game;

    @Prop({required: true, unique: true})
    date: number;
}

export const ActiveDateSchema = SchemaFactory.createForClass(ActiveDate);