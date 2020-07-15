import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mt4_users } from '../../module/mt4/mt4_users';
import { Config } from 'nestjs-async-config';

@Module({
  imports: [
    TypeOrmModule.forFeature([mt4_users], 'mt5to4report'),
    TypeOrmModule.forFeature([mt4_users], 'mt4report'),
    TypeOrmModule.forFeature([mt4_users], 'mt5to4report_demo'),
    TypeOrmModule.forFeature([mt4_users], 'mt4report_demo'),
    TypeOrmModule.forFeature([mt4_users], 'mt4_s02'),
    TypeOrmModule.forFeature([mt4_users], 'mt4_s03'),
  ],
  controllers: [UsersController],
  providers: [Config, UsersService],
})
export class UsersModule {}
