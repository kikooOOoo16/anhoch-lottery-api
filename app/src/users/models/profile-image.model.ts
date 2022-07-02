import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type ProfileImageDocument = Document & ProfileImage;

@Schema()
export class ProfileImage {
    @Prop({default: 'default_profile_img'})
    filename: string;

    @Prop({default: 'default_profile_img_path'})
    path: string;

    @Prop({default: 'image/jpg'})
    mimetype: string;
}

export const ProfileImageSchema = SchemaFactory.createForClass(ProfileImage);