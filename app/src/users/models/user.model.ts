import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProfileImageDocument, ProfileImageSchema } from './profile-image.model';
import { CoverImageDocument, CoverImageSchema } from './cover-image.model';
import { TokenDocument, TokenSchema } from '../../auth/models/token.model';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    required: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop()
  city: string;

  @Prop()
  age: number;

  @Prop({
    unique: true,
  })
  phone: string;

  @Prop({
    default: false,
  })
  playedToday: boolean;

  @Prop({ type: ProfileImageSchema })
  profileImage: ProfileImageDocument;

  @Prop({ type: CoverImageSchema })
  coverImage: CoverImageDocument;

  @Prop({ type: TokenSchema })
  token: TokenDocument;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isRegisteredWithGoogle: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
