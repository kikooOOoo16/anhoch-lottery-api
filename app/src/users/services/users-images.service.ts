import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from '../models/user.model';
import { ProblemSavingUserProfileImageException } from '../../exceptions/user-related/user-images/problem-saving-user-profile-image.exception';
import { InjectModel } from '@nestjs/mongoose';
import { ProfileImageDocument } from '../models/profile-image.model';
import { UsersService } from './users.service';
import { ProblemRetrievingUserProfileImageException } from '../../exceptions/user-related/user-images/problem-retrieving-user-profile-image.exception';
import { NoUserFoundException } from '../../exceptions/user-related/no-user-found.exception';
import { ProblemRemovingOldProfileImageException } from '../../exceptions/user-related/user-images/problem-removing-old-profile-image.exception';
import { CoverImageDocument } from '../models/cover-image.model';
import { ProblemSavingCoverImageException } from '../../exceptions/user-related/user-images/problem-saving-cover-image.exception';
import { ProblemRetrievingCoverImageException } from '../../exceptions/user-related/user-images/problem-retrieving-cover-image.exception';
import { ProblemDeletingProfileImageException } from '../../exceptions/user-related/user-images/problem-deleting-profile-image.exception';
import { ProfileImageNotFoundException } from '../../exceptions/user-related/user-images/profile-image-not-found.exception';
import { CoverImageNotFoundException } from '../../exceptions/user-related/user-images/cover-image-not-found.exception';
import { ProblemUpdatingDefaultProfileImageException } from '../../exceptions/admin-related/default-images/problem-updating-default-profile-image.exception';
import { ProblemUpdatingDefaultCoverImageException } from '../../exceptions/admin-related/default-images/problem-updating-default-cover-image.exception';
import { NoImageProvidedException } from '../../exceptions/user-related/user-images/no-image-provided.exception';

const fs = require('fs');

@Injectable()
export class UsersImagesService {
  constructor(
    private usersService: UsersService,
    @InjectModel('ProfileImage')
    private readonly profileImageModel: Model<ProfileImageDocument>,
    @InjectModel('CoverImage')
    private readonly coverImageModel: Model<CoverImageDocument>,
  ) {}

  async updateProfileImage(
    user: UserDocument,
    file: Express.Multer.File,
  ): Promise<ProfileImageDocument> {
    let savedUser: UserDocument;
    const oldProfileImage: ProfileImageDocument = user.profileImage;

    if (!file) {
      throw new NoImageProvidedException();
    }

    user.profileImage = new this.profileImageModel({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
    });

    try {
      savedUser = await user.save();
    } catch (e) {
      Logger.error(e, 'users-images.service: updateProfileImage()');
      throw new ProblemSavingUserProfileImageException();
    }

    UsersImagesService.removeProfileImageFile(
      oldProfileImage,
      process.env.PROFILE_IMG_DIR,
    );

    return savedUser.profileImage;
  }

  async updateCoverImage(
    user: UserDocument,
    file: Express.Multer.File,
  ): Promise<CoverImageDocument> {
    let savedUser: UserDocument;
    const oldCoverImage = user.coverImage;

    if (!file) {
      throw new NoImageProvidedException();
    }

    user.coverImage = new this.coverImageModel({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
    });

    try {
      savedUser = await user.save();
    } catch (e) {
      Logger.error(e, 'users-images.service: updateCoverImage()');
      throw new ProblemSavingCoverImageException();
    }

    UsersImagesService.removeCoverImageFile(
      oldCoverImage,
      process.env.COVER_IMG_DIR,
    );

    return savedUser.coverImage;
  }

  async getProfileImageByUserId(id: string): Promise<ProfileImageDocument> {
    const user: UserDocument = await this.usersService.findById(id);

    if (!user) {
      throw new NoUserFoundException();
    }

    if (!user.profileImage) {
      return this.profileImageModel.findOne();
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

    if (!user.coverImage) {
      return this.coverImageModel.findOne();
    }

    try {
      return user.coverImage;
    } catch (e) {
      Logger.error(e, 'users-images.service: getCoverImageByUserId');
      throw new ProblemRetrievingCoverImageException();
    }
  }

  async deleteProfileImage(user: UserDocument): Promise<{ message: string }> {
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

    UsersImagesService.removeProfileImageFile(
      oldProfileImage,
      process.env.PROFILE_IMG_DIR,
    );

    return {
      message: 'Profile image removed successfully.',
    };
  }

  async deleteCoverImage(user: UserDocument): Promise<{ message: string }> {
    if (!user.coverImage) {
      throw new CoverImageNotFoundException();
    }

    const oldCoverImage: CoverImageDocument = user.coverImage;

    user.coverImage = null;

    try {
      await user.save();
    } catch (e) {
      Logger.error(e, 'users-images.service: deleteCoverImage()');
    }

    UsersImagesService.removeCoverImageFile(
      oldCoverImage,
      process.env.COVER_IMG_DIR,
    );

    return {
      message: 'Cover image removed successfully.',
    };
  }

  async updateDefaultUserProfileImage(
    file: Express.Multer.File,
  ): Promise<ProfileImageDocument> {
    let deletedDefaultImage: ProfileImageDocument;
    let savedDefaultImage: ProfileImageDocument;

    if (!file) {
      throw new NoImageProvidedException();
    }

    const defaultImage: ProfileImageDocument = new this.profileImageModel({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
    });

    try {
      deletedDefaultImage = await this.profileImageModel.findOneAndRemove({});
      savedDefaultImage = await defaultImage.save();
    } catch (e) {
      Logger.error(
        e,
        'default-images.service.ts: updateDefaultUserProfileImage()',
      );
      throw new ProblemUpdatingDefaultProfileImageException();
    }

    if (deletedDefaultImage) {
      UsersImagesService.removeProfileImageFile(
        deletedDefaultImage,
        process.env.DEFAULT_PROFILE_IMG_DIR,
      );
    }

    return savedDefaultImage;
  }

  async updateDefaultCoverImage(
    file: Express.Multer.File,
  ): Promise<CoverImageDocument> {
    let deletedDefaultCoverImage: CoverImageDocument;
    let savedDefaultCoverImage: CoverImageDocument;

    if (!file) {
      throw new NoImageProvidedException();
    }

    const defaultCoverImage: CoverImageDocument = new this.coverImageModel({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
    });

    try {
      deletedDefaultCoverImage = await this.coverImageModel.findOneAndRemove(
        {},
      );
      savedDefaultCoverImage = await defaultCoverImage.save();
    } catch (e) {
      Logger.error(e, 'default-images.service.ts: updateDefaultCoverImage()');
      throw new ProblemUpdatingDefaultCoverImageException();
    }

    if (deletedDefaultCoverImage) {
      UsersImagesService.removeCoverImageFile(
        deletedDefaultCoverImage,
        process.env.DEFAULT_COVER_IMG_DIR,
      );
    }

    return savedDefaultCoverImage;
  }

  private static removeProfileImageFile(
    profileImage: ProfileImageDocument,
    profileImageDirectory: string,
  ) {
    if (profileImage) {
      try {
        fs.unlinkSync(
          `${process.env.UPLOADED_FILES_DESTINATION}${profileImageDirectory}${profileImage.filename}`,
        );
      } catch (e) {
        Logger.error(e, 'users-images.service: removeProfileImageFile');
        throw new ProblemRemovingOldProfileImageException();
      }
    }
  }

  private static removeCoverImageFile(
    coverImage: CoverImageDocument,
    coverImageDirectory: string,
  ) {
    if (coverImage) {
      try {
        fs.unlinkSync(
          `${process.env.UPLOADED_FILES_DESTINATION}${coverImageDirectory}${coverImage.filename}`,
        );
      } catch (e) {
        Logger.error(e, 'users-images.service: removeCoverImageFile');
        throw new ProblemRemovingOldProfileImageException();
      }
    }
  }
}
