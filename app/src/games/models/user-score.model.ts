import mongoose, {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {User} from "../../users/models/user.model";
import {GameLeaderboard} from "./game-leaderboard.model";

export type UserScoreDocument = Document & UserScore;

@Schema()
export class UserScore {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'GameLeaderboard', required: true})
    gameLeaderboard: GameLeaderboard;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    user: User;

    @Prop({required: true})
    time: number;

    @Prop({default: 0})
    score: number;
}

export const UserScoreSchema = SchemaFactory.createForClass(UserScore);