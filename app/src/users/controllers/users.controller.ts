import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserDocument } from '../models/user.model';
import { AnyActiveSessionGuard } from '../../guards/any-active-session.guard';
import { UserActiveSessionGuard } from '../../guards/user-active-session.guard';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { UserDTO } from '../dtos/user.dto';
import { SerializeDataInterceptor } from '../../interceptors/serialize-data.interceptor';
import { UserProfileDTO } from '../dtos/user-profile.dto';
import { UsersImagesService } from '../services/users-images.service';
import { join } from 'path';
import { Response } from 'express';
import LocalFilesInterceptor from '../../interceptors/local-files.interceptor';
import { ProfileImageDocument } from '../models/profile-image.model';
import { createReadStream } from 'fs';
import { CoverImageDocument } from '../models/cover-image.model';

const profileImageStorageOptions = {
  fieldName: 'profile-image',
  path: '/profile-images',
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.includes('image')) {
      return callback(new BadRequestException('File must be an image'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: Math.pow(1024, 2),
  },
};

const coverImageStorageOptions = {
  fieldName: 'cover-image',
  path: '/cover-images',
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.includes('image')) {
      return callback(new BadRequestException('File must be an image'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: Math.pow(1024, 2),
  },
};

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService, private userImagesService: UsersImagesService) {}

  @Get()
  @UseGuards(UserActiveSessionGuard)
  @UseInterceptors(new SerializeDataInterceptor(UserDTO))
  async getUserData(@CurrentUser() user: UserDocument): Promise<UserDocument> {
    return user;
  }

  @Get('/:id')
  @UseGuards(AnyActiveSessionGuard)
  @UseInterceptors(new SerializeDataInterceptor(UserProfileDTO))
  async getUserProfileData(@Param('id') userId: string): Promise<UserDocument> {
    return await this.usersService.findById(userId);
  }

  @Patch()
  @UseGuards(UserActiveSessionGuard)
  @UseInterceptors(new SerializeDataInterceptor(UserDTO))
  async updateUserData(@CurrentUser() user: UserDocument, @Body() updateUserDTO: UpdateUserDTO): Promise<UserDocument> {
    return await this.usersService.update(user, updateUserDTO);
  }

  @Delete('/profile-image')
  @UseGuards(UserActiveSessionGuard)
  async deleteProfileImage(@CurrentUser() user: UserDocument) {
    return await this.userImagesService.deleteProfileImage(user);
  }

  @Post('/profile-image')
  @UseGuards(UserActiveSessionGuard)
  @UseInterceptors(LocalFilesInterceptor(profileImageStorageOptions))
  async uploadProfileImage(
    @CurrentUser() user: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProfileImageDocument> {
    return await this.userImagesService.updateProfileImage(user, file);
  }

  @Post('/cover-image')
  @UseGuards(UserActiveSessionGuard)
  @UseInterceptors(LocalFilesInterceptor(coverImageStorageOptions))
  async uploadCoverImage(
    @CurrentUser() user: UserDocument,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CoverImageDocument> {
    return await this.userImagesService.updateCoverImage(user, file);
  }

  @Delete('/cover-image')
  @UseGuards(UserActiveSessionGuard)
  async deleteCoverImage(@CurrentUser() user: UserDocument) {
    return await this.userImagesService.deleteCoverImage(user);
  }

  @Get('/:id/profile-image')
  @UseGuards(AnyActiveSessionGuard)
  async getProfileImage(
    @Param('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const profileImage: ProfileImageDocument = await this.userImagesService.getProfileImageByUserId(userId);

    const stream = createReadStream(join(process.cwd(), profileImage.path));

    res.set({
      'Content-Disposition': `inline; filename="${profileImage.filename}"`,
      'Content-Type': profileImage.mimetype,
    });

    return new StreamableFile(stream);
  }

  @Get('/:id/cover-image')
  @UseGuards(AnyActiveSessionGuard)
  async getCoverImage(@Param('id') userId: string, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const coverImage: CoverImageDocument = await this.userImagesService.getCoverImageByUserId(userId);

    const stream = createReadStream(join(process.cwd(), coverImage.path));

    res.set({
      'Content-Disposition': `inline; filename="${coverImage.filename}"`,
      'Content-Type': coverImage.mimetype,
    });

    return new StreamableFile(stream);
  }
}
