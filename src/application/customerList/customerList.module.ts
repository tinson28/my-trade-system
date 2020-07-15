import { Module } from '@nestjs/common';
import { CustomerListService } from './customerList.service';
import { CustomerListController } from './customerList.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { relationship } from '../../module/relationship/relationship';

@Module({
  imports: [
    TypeOrmModule.forFeature([relationship], 'relationship'),
  ],

  providers: [CustomerListService],
  controllers: [CustomerListController],
})
export class CustomerListModule {}
