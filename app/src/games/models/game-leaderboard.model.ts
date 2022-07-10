import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Game } from './game.model';
import { UserScore } from './user-score.model';

export type GameLeaderboardDocument = Document & GameLeaderboard;

@Schema()
export class GameLeaderboard {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Game' })
  game: Game;

  @Prop({ required: true, unique: true })
  date: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'UserScore' })
  userScores: UserScore[];
}

export const GameLeaderboardSchema = SchemaFactory.createForClass(GameLeaderboard);
