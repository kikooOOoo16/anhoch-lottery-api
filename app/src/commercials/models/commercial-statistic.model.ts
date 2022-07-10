import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Commercial } from './commercial.model';
import { User } from '../../users/models/user.model';

export type CommercialStatisticDocument = Document & CommercialStatistic;

@Schema()
export class CommercialStatistic {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Commercial', required: true })
  @Type(() => Commercial)
  commercial: Commercial;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @Type(() => User)
  user: User;

  @Prop({ required: true })
  watchedSeconds: number;

  @Prop({ required: true })
  watchedFull: boolean;

  @Prop({ required: true })
  visitedLink: boolean;

  @Prop({ required: true })
  date: number;
}

export const CommercialStatisticSchema = SchemaFactory.createForClass(CommercialStatistic);
