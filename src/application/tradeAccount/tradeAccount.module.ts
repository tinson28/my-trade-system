import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeAccountController } from './tradeAccount.controller';
import { TradeAccountService } from './tradeAccount.service';
import { mt4_users } from '../../module/mt4/mt4_users';
import { relationship } from '../../module/relationship/relationship';

import { MtEventService } from '../mtevent/mtevent.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([mt4_users], 'mt4report'),
    TypeOrmModule.forFeature([mt4_users], 'mt4report_demo'),
    TypeOrmModule.forFeature([mt4_users], 'mt4_s02'),
    TypeOrmModule.forFeature([mt4_users], 'mt4_s03'),
    TypeOrmModule.forFeature([mt4_users], 'mt5to4report'),
    TypeOrmModule.forFeature([mt4_users], 'mt5to4report_demo'),
    TypeOrmModule.forFeature([relationship], 'relationship'),
  ],
  controllers: [TradeAccountController],
  providers: [TradeAccountService, MtEventService],
})
export class TradeAccountModule {}
