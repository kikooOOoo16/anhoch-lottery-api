import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    firstname: string;

    @Prop({ required: true })
    lastname: string

    @Prop({
        required: true,
        lowercase: true
    })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    age: number;

    @Prop({ required: true })
    phone: number;
}

export const UserSchema = SchemaFactory.createForClass(User);