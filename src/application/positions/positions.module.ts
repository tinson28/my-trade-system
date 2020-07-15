import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { mt4_sync_order } from '../../module/mt4/mt4_sync_order';
import { relationship } from '../../module/relationship/relationship';

@Module({
  imports: [
    TypeOrmModule.forFeature([mt4_sync_order], 'mt4report'),
    TypeOrmModule.forFeature([mt4_sync_order], 'mt4report_demo'),
    TypeOrmModule.forFeature([mt4_sync_order], 'mt4_s02'),
    TypeOrmModule.forFeature([mt4_sync_order], 'mt4_s03'),
    TypeOrmModule.forFeature([mt4_sync_order], 'mt5to4report'),
    TypeOrmModule.forFeature([mt4_sync_order], 'mt5to4report_demo'),
    TypeOrmModule.forFeature([relationship], 'relationship'),
  ],
  providers: [PositionsService],
  controllers: [PositionsController],
})
export class PositionsModule {}
