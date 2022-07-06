import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NoActiveSessionGuard } from '../../guards/no-active-session.guard';
import { AdminsService } from '../services/admins.service';
import { CreateAdminDTO } from '../dtos/create-admin.dto';
import { SerializeDataInterceptor } from '../../interceptors/serialize-data.interceptor';
import { AdminDTO } from '../dtos/admin.dto';
import { AdminActiveSessionGuard } from '../../guards/admin-active-session.guard';
import { CurrentAdmin } from '../decorators/current-admin.decorator';
import { UpdateAdminDTO } from '../dtos/update-admin.dto';
import { AdminDocument } from '../models/admin.model';
import LocalFilesInterceptor from '../../interceptors/local-files.interceptor';
import { UsersImagesService } from '../../users/services/users-images.service';

const defaultProfileImageStorageOptions = {
  fieldName: 'default-profile-image',
  path: '/default-profile-image',
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

const defaultCoverImageStorageOptions = {
  fieldName: 'default-cover-image',
  path: '/default-cover-image',
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

@Controller('admin')
export class AdminsController {
  constructor(
    private adminsService: AdminsService,
    private usersImagesService: UsersImagesService,
  ) {}

  @Post('/create')
  @UseGuards(NoActiveSessionGuard)
  @UseInterceptors(new SerializeDataInterceptor(AdminDTO))
  async createAdminAccount(@Body() createAdminDTO: CreateAdminDTO) {
    return await this.adminsService.create(createAdminDTO);
  }

  @Patch('/update')
  @UseGuards(AdminActiveSessionGuard)
  @UseInterceptors(new SerializeDataInterceptor(AdminDTO))
  async updateAdmin(
    @Body() updateAdminDTO: UpdateAdminDTO,
    @CurrentAdmin() admin: AdminDocument,
  ) {
    return await this.adminsService.update(admin, updateAdminDTO);
  }

  @Get()
  @UseGuards(AdminActiveSessionGuard)
  @UseInterceptors(new SerializeDataInterceptor(AdminDTO))
  getCurrentAdminData(@CurrentAdmin() admin: AdminDocument) {
    return admin;
  }

  @Post('/default-profile-image')
  @UseGuards(AdminActiveSessionGuard)
  @UseInterceptors(LocalFilesInterceptor(defaultProfileImageStorageOptions))
  async updateDefaultProfileImage(@UploadedFile() file: Express.Multer.File) {
    return await this.usersImagesService.updateDefaultUserProfileImage(file);
  }

  @Post('/default-cover-image')
  @UseGuards(AdminActiveSessionGuard)
  @UseInterceptors(LocalFilesInterceptor(defaultCoverImageStorageOptions))
  async updateDefaultCoverImage(@UploadedFile() file: Express.Multer.File) {
    return await this.usersImagesService.updateDefaultCoverImage(file);
  }
}
