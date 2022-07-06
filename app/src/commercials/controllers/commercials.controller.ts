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
import { AdminActiveSessionGuard } from '../../guards/admin-active-session.guard';
import { CommercialsService } from '../services/commercials.service';
import { CreateCommercialDTO } from '../dtos/create-commercial.dto';
import LocalFilesInterceptor from '../../interceptors/local-files.interceptor';
import { ModifyCommercialsWatchDurationDTO } from '../dtos/modify-commercials-watch-duration.dto';
import { ModifyCommercialActiveStatusDTO } from '../dtos/modify-commercial-active-status.dto';
import { CommercialDocument } from '../models/commercial.model';
import { UserActiveSessionGuard } from '../../guards/user-active-session.guard';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { UpdateCommercialDTO } from '../dtos/update-commercial.dto';

const commercialVideoStorageOptions = {
  fieldName: 'commercial-video',
  path: '/commercial-videos',
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.includes('video')) {
      return callback(new BadRequestException('File must be a video'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: Math.pow(5024, 2),
  },
};

@Controller('commercial')
export class CommercialsController {
  constructor(private commercialsService: CommercialsService) {}

  @Get('')
  @UseGuards(UserActiveSessionGuard)
  async getRandomActiveCommercial(@Res({ passthrough: true }) res: Response) {
    const commercial: CommercialDocument =
      await this.commercialsService.getRandomActiveCommercial();

    const stream = createReadStream(join(process.cwd(), commercial.path));

    res.set({
      'Content-Disposition': `inline; filename="${commercial.filename}"`,
      'Content-Type': commercial.mimetype,
    });

    return new StreamableFile(stream);
  }

  @Get('/all')
  @UseGuards(AdminActiveSessionGuard)
  async getAll(): Promise<CommercialDocument[]> {
    return await this.commercialsService.getAll();
  }

  @Post('/create')
  @UseGuards(AdminActiveSessionGuard)
  @UseInterceptors(LocalFilesInterceptor(commercialVideoStorageOptions))
  async create(
    @Body() createCommercialDTO: CreateCommercialDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CommercialDocument> {
    return await this.commercialsService.create(createCommercialDTO, file);
  }

  @Post('/duration')
  @UseGuards(AdminActiveSessionGuard)
  async modifyWatchDuration(
    @Body()
    modifyCommercialsWatchDurationDTO: ModifyCommercialsWatchDurationDTO,
  ): Promise<any> {
    return await this.commercialsService.modifyWatchDuration(
      modifyCommercialsWatchDurationDTO,
    );
  }

  @Patch('/:id')
  @UseGuards(AdminActiveSessionGuard)
  async updateCommercial(
    @Param('id') commercialId: string,
    @Body() updateCommercialDTO: UpdateCommercialDTO,
  ): Promise<CommercialDocument> {
    return await this.commercialsService.update(
      commercialId,
      updateCommercialDTO,
    );
  }

  @Patch('/:id/status')
  @UseGuards(AdminActiveSessionGuard)
  async updateActiveStatus(
    @Param('id') commercialId: string,
    @Body() modifyActiveStatusDTO: ModifyCommercialActiveStatusDTO,
  ): Promise<CommercialDocument> {
    return await this.commercialsService.modifyActiveStatus(
      commercialId,
      modifyActiveStatusDTO,
    );
  }

  @Delete('/:id/delete')
  @UseGuards(AdminActiveSessionGuard)
  async delete(@Param('id') commercialId: string) {
    return await this.commercialsService.delete(commercialId);
  }
}
