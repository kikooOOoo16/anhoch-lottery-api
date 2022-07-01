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
import {
    ProblemDeletingProfileImageException
} from "../../exceptions/user-related/user-images/problem-deleting-profile-image.exception";
import {
    ProfileImageNotFoundException
} from "../../exceptions/user-related/user-images/profile-image-not-found.exception";
import {CoverImageNotFoundException} from "../../exceptions/user-related/user-images/cover-image-not-found.exception";

const fs = require('fs');


@Injectable()
export class UsersImagesService {

    constructor(
        private usersService: UsersService,
        @InjectModel('ProfileImage') private readonly profileImageModel: Model<ProfileImageDocument>,
        @InjectModel('CoverImage') private readonly coverImageModel: Model<CoverImageDocument>) {}

    async updateProfileImage(user: UserDocument, file: Express.Multer.File): Promise<ProfileImageDocument> {
        let savedUser: UserDocument;

        UsersImagesService.removeProfileImageFile(user.profileImage);

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

        UsersImagesService.removeCoverImageFile(user.coverImage);

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

    async deleteProfileImage(user: UserDocument): Promise<{message: string}> {
        if (!user.profileImage) {
            throw new ProfileImageNotFoundException();
        }

        const oldProfileImage: ProfileImageDocument = user.profileImage;

        user.profileImage = null;

        try {
            await user.save();
        } catch (e) {
            Logger.error(e, 'users-images.service: deleteProfileImage()');
            throw new ProblemDeletingProfileImageException();
        }

        UsersImagesService.removeProfileImageFile(oldProfileImage);

        return {
            message: 'Profile image removed successfully.'
        }
    }

    async deleteCoverImage(user: UserDocument): Promise<{message: string}> {
        if (!user.coverImage) {
            throw new CoverImageNotFoundException();
        }

        const oldCoverImage: CoverImageDocument = user.coverImage;

        user.coverImage = null;

        try {
            await user.save();
        } catch (e) {
            Logger.error(e, 'users-images.service: deleteCoverImage()')
        }

        UsersImagesService.removeCoverImageFile(oldCoverImage);

        return {
            message: 'Cover image removed successfully.'
        }
    }

    private static removeProfileImageFile(profileImage: ProfileImageDocument) {
        if (profileImage) {
            try {
                fs.unlinkSync(`${process.env.UPLOADED_FILES_DESTINATION}${process.env.PROFILE_IMG_DIR}${profileImage.filename}`)
            } catch (e) {
                Logger.error(e, 'users-images.service: removeOldProfileImage');
                throw new ProblemRemovingOldProfileImageException();
            }
        }
    }

    private static removeCoverImageFile(coverImage: CoverImageDocument) {
        if (coverImage) {
            try {
                fs.unlinkSync(`${process.env.UPLOADED_FILES_DESTINATION}${process.env.COVER_IMG_DIR}${coverImage.filename}`)
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