import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CoverImageDocument = Document & CoverImage;

@Schema()
export class CoverImage {
  @Prop({ default: 'default_profile_img' })
  filename: string;

  @Prop({ default: 'default_profile_img_path' })
  path: string;

  @Prop({ default: 'image/jpg' })
  mimetype: string;
}

export const CoverImageSchema = SchemaFactory.createForClass(CoverImage);
