import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/models/user.model';
import mongoose, { Document } from 'mongoose';

import { Type } from 'class-transformer';
import { Game } from './game.model';

export type ActiveGameSessionDocument = Document & ActiveGameSession;

@Schema()
export class ActiveGameSession {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Type(() => User)
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Game' })
  @Type(() => Game)
  game: Game;

  @Prop({ required: true })
  startTimeStamp: number;
}

export const ActiveGameSessionSchema = SchemaFactory.createForClass(ActiveGameSession);
