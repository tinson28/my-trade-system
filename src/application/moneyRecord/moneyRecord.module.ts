import { Module } from '@nestjs/common';
import { MoneyRecordService } from './moneyRecord.service';
import { MoneyRecordController } from './moneyRecord.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mt4_sync_credit } from '../../module/mt4/mt4_sync_credit';

@Module({
  imports: [
    TypeOrmModule.forFeature([mt4_sync_credit], 'mt4report'),
    TypeOrmModule.forFeature([mt4_sync_credit], 'mt4report_demo'),
    TypeOrmModule.forFeature([mt4_sync_credit], 'mt5to4report'),
    TypeOrmModule.forFeature([mt4_sync_credit], 'mt5to4report_demo'),
  ],

  providers: [MoneyRecordService],
  controllers: [MoneyRecordController],
})
export class MoneyRecordModule { }
