import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommercialDocument = Document & Commercial;

@Schema()
export class Commercial {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: 5 })
  minimumWatchSeconds: number;

  @Prop({ default: null })
  website: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  mimetype: string;
}

export const CommercialSchema = SchemaFactory.createForClass(Commercial);
