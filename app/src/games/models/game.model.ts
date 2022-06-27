import mongoose, {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ActiveDate} from "./active-date.model";
import {Type} from "class-transformer";

export type GameDocument = Game & Document;

@Schema()
export class Game {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true})
    description: string;

    @Prop({ required: true, default: false })
    inActivePool: boolean;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ActiveDate' })
    @Type(() => ActiveDate)
    activeDates: ActiveDate[];
}

export const GameSchema = SchemaFactory.createForClass(Game);