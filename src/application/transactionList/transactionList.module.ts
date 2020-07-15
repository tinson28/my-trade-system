import { Module } from '@nestjs/common';
import { TransactionListService } from './transactionList.service';
import { TransactionListController } from './transactionList.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { relationship } from '../../module/relationship/relationship';

@Module({
  imports: [
    TypeOrmModule.forFeature([relationship], 'relationship'),
  ],

  providers: [TransactionListService],
  controllers: [TransactionListController],
})
export class TransactionListModule {}
