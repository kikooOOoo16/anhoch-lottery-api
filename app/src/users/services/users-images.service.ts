import {Injectable, Logger} from "@nestjs/common";
import * as sharp from 'sharp';
import {Model} from "mongoose";
import {UserDocument} from "../models/user.model";
import {
    ProblemSavingUserProfileImageException
} from "../../exceptions/user-related/user-images/problem-saving-user-profile-image.exception";
import {InjectModel} from "@nestjs/mongoose";
import {ProfileImageDocument} from "../models/profile-image.model";
import {UsersService} from "./users.service";
import {
    ProblemRetrievingUserProfileImageException
} from "../../exceptions/user-related/user-images/problem-retrieving-user-profile-image.exception";
import {NoUserFoundException} from "../../exceptions/user-related/no-user-found.exception";
import {
    ProblemRemovingOldProfileImageException
} from "../../exceptions/user-related/user-images/problem-removing-old-profile-image.exception";
import {CoverImageDocument} from "../models/cover-image.model";
import {
    ProblemSavingCoverImageException
} from "../../exceptions/user-related/user-images/problem-saving-cover-image.exception";
import {
    ProblemRetrievingCoverImageException
} from "../../exceptions/user-related/user-images/problem-retrieving-cover-image.exception";

const fs = require('fs');


@Injectable()
export class UsersImagesService {

    constructor(
        private usersService: UsersService,
        @InjectModel('ProfileImage') private readonly profileImageModel: Model<ProfileImageDocument>,
        @InjectModel('CoverImage') private readonly coverImageModel: Model<CoverImageDocument>) {}

    async updateProfileImage(user: UserDocument, file: Express.Multer.File): Promise<ProfileImageDocument> {
        let savedUser: UserDocument;

        UsersImagesService.removeOldProfileImage(user);

        user.profileImage = new this.profileImageModel({
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype
        });

        try {
            savedUser = await user.save();
        } catch (e) {
            Logger.error(e, 'users-images.service: updateProfileImage()');
            throw new ProblemSavingUserProfileImageException();
        }

        return savedUser.profileImage;
    }

    async updateCoverImage(user: UserDocument, file: Express.Multer.File): Promise<CoverImageDocument> {
        let savedUser: UserDocument;

        UsersImagesService.removeOldCoverImage(user);

        user.coverImage = new this.coverImageModel({
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype
        });

        try {
            savedUser = await user.save();
        } catch (e) {
            Logger.error(e, 'users-images.service: updateCoverImage()');
            throw new ProblemSavingCoverImageException();
        }

        return savedUser.coverImage;
    }

    async getProfileImageByUserId(id: string): Promise<ProfileImageDocument> {
        const user: UserDocument = await this.usersService.findById(id);

        if (!user) {
            throw new NoUserFoundException();
        }

        try {
            return user.profileImage;
        } catch (e) {
            Logger.error(e, 'users-images.service: getProfileImageByUserId');
            throw new ProblemRetrievingUserProfileImageException();
        }
    }

    async getCoverImageByUserId(id: string): Promise<CoverImageDocument> {
        const user: UserDocument = await this.usersService.findById(id);

        if (!user) {
            throw new NoUserFoundException();
        }

        try {
            return user.coverImage;
        } catch (e) {
            Logger.error(e, 'users-images.service: getCoverImageByUserId');
            throw new ProblemRetrievingCoverImageException();
        }
    }

    private static removeOldProfileImage(user: UserDocument) {
        if (user.profileImage) {
            try {
                fs.unlinkSync(`${process.env.UPLOADED_FILES_DESTINATION}${process.env.PROFILE_IMG_DIR}${user.profileImage.filename}`)
            } catch (e) {
                Logger.error(e, 'users-images.service: removeOldProfileImage');
                throw new ProblemRemovingOldProfileImageException();
            }
        }
    }

    private static removeOldCoverImage(user: UserDocument) {
        if (user.coverImage) {
            try {
                fs.unlinkSync(`${process.env.UPLOADED_FILES_DESTINATION}${process.env.COVER_IMG_DIR}${user.coverImage.filename}`)
            } catch (e) {
                Logger.error(e, 'users-images.service: removeOldCoverImage');
                throw new ProblemRemovingOldProfileImageException();
            }
        }
    }

    private static async resizeImage(file: Express.Multer.File): Promise<Buffer> {
        return await sharp(file.buffer)
            .resize({width: 250, height: 250})
            .png()
            .toBuffer();
    }
}