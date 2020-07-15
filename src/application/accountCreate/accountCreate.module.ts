import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mt4_users } from '../../module/mt4/mt4_users';
import { AccountCreateService } from './accountCreate.service';
import { AccountCreateController } from './accountCreate.controller';
import { MtEventService } from '../mtevent/mtevent.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([mt4_users], 'mt5to4report'),
    TypeOrmModule.forFeature([mt4_users], 'mt4report'),
    TypeOrmModule.forFeature([mt4_users], 'mt5to4report_demo'),
    TypeOrmModule.forFeature([mt4_users], 'mt4report_demo'),
  ],

  providers: [AccountCreateService, MtEventService],
  controllers: [AccountCreateController],
})
export class AccountCreateModule { }
