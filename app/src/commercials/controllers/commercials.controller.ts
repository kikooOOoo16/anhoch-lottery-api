import {
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
import { CreateCommercialStatisticsDTO } from '../dtos/create-commercial-statistics.dto';
import { CommercialStatisticsService } from '../services/commercial-statistics.service';
import { CurrentUser } from '../../users/decorators/current-user.decorator';
import { UserDocument } from '../../users/models/user.model';
import { CommercialStatistic, CommercialStatisticDocument } from '../models/commercial-statistic.model';
import { CommercialStatisticDTO } from '../dtos/commercial-statistic.dto';
import { SerializeDataInterceptor } from '../../interceptors/serialize-data.interceptor';
import { CommercialStatisticByDateDTO } from '../dtos/commercial-statistic-by-date.dto';
import { commercialVideoStorageOptions } from '../../common/storage-options/storage-options';

@Controller('commercial')
export class CommercialsController {
  constructor(
    private commercialsService: CommercialsService,
    private commercialStatisticsService: CommercialStatisticsService,
  ) {}

  @Get('')
  @UseGuards(UserActiveSessionGuard)
  async getRandomActiveCommercial(@Res({ passthrough: true }) res: Response) {
    const commercial: CommercialDocument = await this.commercialsService.getRandomActiveCommercial();

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
    return await this.commercialsService.modifyWatchDuration(modifyCommercialsWatchDurationDTO);
  }

  @Post('/statistics/add')
  @UseGuards(UserActiveSessionGuard)
  @UseInterceptors(new SerializeDataInterceptor(CommercialStatisticDTO))
  async addCommercialStatistics(
    @Body() createCommercialStatisticsDTO: CreateCommercialStatisticsDTO,
    @CurrentUser() user: UserDocument,
  ): Promise<CommercialStatistic> {
    return await this.commercialStatisticsService.addCommercialStatistics(user, createCommercialStatisticsDTO);
  }

  @Patch('/:id')
  @UseGuards(AdminActiveSessionGuard)
  async updateCommercial(
    @Param('id') commercialId: string,
    @Body() updateCommercialDTO: UpdateCommercialDTO,
  ): Promise<CommercialDocument> {
    return await this.commercialsService.update(commercialId, updateCommercialDTO);
  }

  @Get('/:id/statistics/all')
  @UseGuards(AdminActiveSessionGuard)
  async getCommercialStatistics(@Param('id') commercialId: string): Promise<CommercialStatisticDocument[]> {
    return await this.commercialStatisticsService.getAllStatisticsForCommercial(commercialId);
  }

  @Get('/:id/statistics/date')
  @UseGuards(AdminActiveSessionGuard)
  async getCommercialStatisticsForDate(
    @Param('id') commercialId: string,
    @Body() commercialStatisticByDateDTO: CommercialStatisticByDateDTO,
  ): Promise<CommercialStatisticDocument[]> {
    return await this.commercialStatisticsService.getAllStatisticsForCommercialByDate(
      commercialId,
      commercialStatisticByDateDTO,
    );
  }

  @Patch('/:id/status')
  @UseGuards(AdminActiveSessionGuard)
  async updateActiveStatus(
    @Param('id') commercialId: string,
    @Body() modifyActiveStatusDTO: ModifyCommercialActiveStatusDTO,
  ): Promise<CommercialDocument> {
    return await this.commercialsService.modifyActiveStatus(commercialId, modifyActiveStatusDTO);
  }

  @Delete('/:id/delete')
  @UseGuards(AdminActiveSessionGuard)
  async delete(@Param('id') commercialId: string) {
    return await this.commercialsService.delete(commercialId);
  }
}
