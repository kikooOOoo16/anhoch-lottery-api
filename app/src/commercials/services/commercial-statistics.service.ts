import { Injectable, Logger } from '@nestjs/common';
import { CreateCommercialStatisticsDTO } from '../dtos/create-commercial-statistics.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommercialStatistic, CommercialStatisticDocument } from '../models/commercial-statistic.model';
import { CommercialsService } from './commercials.service';
import { CommercialDocument } from '../models/commercial.model';
import { HelperService } from '../../common/services/helper.service';
import { UserDocument } from '../../users/models/user.model';
import { ProblemRetrievingCommercialStatisticsException } from '../../exceptions/commercials-related/commercial-statistics/problem-retrieving-commercial-statistics.exception';
import { CommercialStatisticByDateDTO } from '../dtos/commercial-statistic-by-date.dto';

@Injectable()
export class CommercialStatisticsService {
  constructor(
    private commercialsService: CommercialsService,
    @InjectModel('CommercialStatistic') private readonly commercialStatisticModel: Model<CommercialStatisticDocument>,
  ) {}

  async addCommercialStatistics(
    user: UserDocument,
    { filename, visitedLink, watchedSeconds, watchedFull, day, month, year }: CreateCommercialStatisticsDTO,
  ): Promise<CommercialStatistic> {
    const commercial: CommercialDocument = await this.commercialsService.findByFileName(filename);

    const dateTimestamp: number = HelperService.convertToTimestamp(day, month, year);

    const newCommercialStatistic = new this.commercialStatisticModel({
      commercial,
      user,
      visitedLink,
      watchedFull,
      watchedSeconds,
      date: dateTimestamp,
    });

    try {
      return await newCommercialStatistic.save();
    } catch (e) {
      Logger.error(e, 'commercial-statistics.service: addCommercialStatistics');
    }
  }

  async getAllStatisticsForCommercial(id: string): Promise<CommercialStatisticDocument[]> {
    const commercial: CommercialDocument = await this.commercialsService.findById(id);

    try {
      return await this.commercialStatisticModel.find({ commercial: commercial.id });
    } catch (e) {
      Logger.error(e, 'commercial-statistics.service: getAllStatisticsForCommercialById()');
      throw new ProblemRetrievingCommercialStatisticsException();
    }
  }

  async getAllStatisticsForCommercialByDate(
    id: string,
    { day, month, year }: CommercialStatisticByDateDTO,
  ): Promise<CommercialStatisticDocument[]> {
    const commercial: CommercialDocument = await this.commercialsService.findById(id);

    const dateTimestamp: number = HelperService.convertToTimestamp(day, month, year);

    try {
      return await this.commercialStatisticModel.find({
        commercial: commercial.id,
        date: dateTimestamp,
      });
    } catch (e) {
      Logger.error(e, 'commercial-statistics.service: getAllStatisticsForCommercialByDate()');
      throw new ProblemRetrievingCommercialStatisticsException();
    }
  }
}
