import { Module } from '@nestjs/common';
import { UserRecordsService } from './userRecords.service';
import { UserRecordsController } from './userRecords.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from 'nestjs-async-config';

import { mt4_sync_deposit } from '../../module/mt4/mt4_sync_deposit';
import { mt4_sync_withdrawal } from '../../module/mt4/mt4_sync_withdrawal';
import { mt4_sync_transfer_in } from '../../module/mt4/mt4_sync_transfer_in';
import { mt4_sync_transfer_out } from '../../module/mt4/mt4_sync_transfer_out';
import { mt4_sync_credit } from '../../module/mt4/mt4_sync_credit';
import { mt4_sync_order } from '../../module/mt4/mt4_sync_order';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      mt4_sync_deposit,
      mt4_sync_withdrawal,
      mt4_sync_transfer_in,
      mt4_sync_transfer_out,
      mt4_sync_credit,
      mt4_sync_order,
    ], 'mt4report'),

    TypeOrmModule.forFeature([
      mt4_sync_deposit,
      mt4_sync_withdrawal,
      mt4_sync_transfer_in,
      mt4_sync_transfer_out,
      mt4_sync_credit,
      mt4_sync_order,
    ], 'mt4report_demo'),

    TypeOrmModule.forFeature([
      mt4_sync_deposit,
      mt4_sync_withdrawal,
      mt4_sync_transfer_in,
      mt4_sync_transfer_out,
      mt4_sync_credit,
      mt4_sync_order,
    ], 'mt5to4report'),
    
    TypeOrmModule.forFeature([
      mt4_sync_deposit,
      mt4_sync_withdrawal,
      mt4_sync_transfer_in,
      mt4_sync_transfer_out,
      mt4_sync_credit,
      mt4_sync_order,
    ], 'mt5to4report_demo'),
    TypeOrmModule.forFeature([
      mt4_sync_deposit,
      mt4_sync_withdrawal,
      mt4_sync_transfer_in,
      mt4_sync_transfer_out,
      mt4_sync_credit,
      mt4_sync_order,
    ], 'mt4_s02'),
    TypeOrmModule.forFeature([
      mt4_sync_deposit,
      mt4_sync_withdrawal,
      mt4_sync_transfer_in,
      mt4_sync_transfer_out,
      mt4_sync_credit,
      mt4_sync_order,
    ], 'mt4_s03'),
  ],
  controllers: [UserRecordsController],
  providers: [Config, UserRecordsService],

})
export class UserRecordsModule { }
