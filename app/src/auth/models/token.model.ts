import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TokenType } from '../enums/token-type.enum';

export type TokenDocument = Document & Token;

@Schema({ timestamps: true })
export class Token {
  @Prop()
  expiresAtTimeStamp: number;

  @Prop({ type: String, enum: TokenType })
  type: TokenType;

  @Prop({ default: false })
  verified: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
