import { Module } from '@nestjs/common';
import { AffService } from './aff.service';
import { AffController } from './aff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { mt4_sync_deposit } from '../../module/mt4/mt4_sync_deposit';
import { mt4_sync_withdrawal } from '../../module/mt4/mt4_sync_withdrawal';
import { mt4_sync_transfer_in } from '../../module/mt4/mt4_sync_transfer_in';
import { mt4_sync_transfer_out } from '../../module/mt4/mt4_sync_transfer_out';
import { mt4_sync_credit } from '../../module/mt4/mt4_sync_credit';
import { mt4_sync_order } from '../../module/mt4/mt4_sync_order';
import { mt4_prices } from '../../module/mt4/mt4_prices';

@Module({
  imports: [
    TypeOrmModule.forFeature([mt4_sync_credit], 'mt4report'),
    TypeOrmModule.forFeature([mt4_sync_credit], 'mt4report_demo'),
    TypeOrmModule.forFeature([mt4_sync_credit], 'mt5to4report'),
    TypeOrmModule.forFeature([mt4_sync_credit], 'mt5to4report_demo'),
    TypeOrmModule.forFeature([mt4_sync_credit], 'mt4_s02'),
    TypeOrmModule.forFeature([mt4_sync_credit], 'mt4_s03'),

    TypeOrmModule.forFeature([mt4_sync_order], 'mt4report'),
    TypeOrmModule.forFeature([mt4_sync_order], 'mt4report_demo'),
    TypeOrmModule.forFeature([mt4_sync_order], 'mt5to4report'),
    TypeOrmModule.forFeature([mt4_sync_order], 'mt5to4report_demo'),
    TypeOrmModule.forFeature([mt4_sync_order], 'mt4_s02'),
    TypeOrmModule.forFeature([mt4_sync_order], 'mt4_s03'),

    TypeOrmModule.forFeature([mt4_prices], 'mt4report'),
    TypeOrmModule.forFeature([mt4_prices], 'mt4report_demo'),
    TypeOrmModule.forFeature([mt4_prices], 'mt5to4report'),
    TypeOrmModule.forFeature([mt4_prices], 'mt5to4report_demo'),
    TypeOrmModule.forFeature([mt4_prices], 'mt4_s02'),
    TypeOrmModule.forFeature([mt4_prices], 'mt4_s03'),
  ],
  providers: [AffService],
  controllers: [AffController],
})
export class AffModule { }
