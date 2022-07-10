import { Module } from '@nestjs/common';
import { CommercialsService } from './services/commercials.service';
import { CommercialsController } from './controllers/commercials.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommercialSchema } from './models/commercial.model';
import { CommonModule } from '../common/common.module';
import { CommercialStatisticSchema } from './models/commercial-statistic.model';
import { CommercialStatisticsService } from './services/commercial-statistics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Commercial', schema: CommercialSchema },
      { name: 'CommercialStatistic', schema: CommercialStatisticSchema },
    ]),
    CommonModule,
  ],
  providers: [CommercialsService, CommercialStatisticsService],
  controllers: [CommercialsController],
})
export class CommercialsModule {}
