import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, LoggerModule, AxiosModule } from './@nt';
import { AsyncConfigModule, Config } from 'nestjs-async-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './application/users/users.module';
import { OrdersModule } from './application/orders/orders.module';
import { IbListModule } from './application/ibList/ibList.module';
import { AccountCreateModule } from './application/accountCreate/accountCreate.module';
import { MteventModule } from './application/mtevent/mtevent.module';
import { MoneyRecordModule } from './application/moneyRecord/moneyRecord.module';
import { LeadPrdModule } from './application/leadPrd/leadPrd.module';
import { PositionsModule } from './application/positions/positions.module';
import { CustomerListModule } from './application/customerList/customerList.module';
import { TradeAccountModule } from './application/tradeAccount/tradeAccount.module';
import { UserRecordsModule } from './application/userRecords/userRecords.module';
import { TransactionListModule } from './application/transactionList/transactionList.module';
import { CrmModule } from './application/crm/crm.module';
import { AffModule } from './application/aff/aff.module';

@Module({
  imports: [
    AsyncConfigModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      name: 'mt4report',
      useFactory: (config: Config) => ({
        keepConnectionAlive: true,
        type: 'mysql',
        host: config.get('reportdb')['mt4']['db_host'],
        port: config.get('reportdb')['mt4']['db_port'],
        username: config.get('reportdb')['mt4']['db_username'],
        password: config.get('reportdb')['mt4']['db_pwd'],
        database: config.get('reportdb')['mt4']['db_name'],
        synchronize: false,
        entities: [__dirname + '/module/mt4/*.{ts,js}'],
        logging: true,
        extra: {
          connectionLimit: 100,
        },
      }),
      inject: [Config],
    }),
    TypeOrmModule.forRootAsync({
      name: 'mt4report_demo',
      useFactory: (config: Config) => ({
        keepConnectionAlive: true,
        type: 'mysql',
        host: config.get('reportdb')['mt4_demo']['db_host'],
        port: config.get('reportdb')['mt4_demo']['db_port'],
        username: config.get('reportdb')['mt4_demo']['db_username'],
        password: config.get('reportdb')['mt4_demo']['db_pwd'],
        database: config.get('reportdb')['mt4_demo']['db_name'],
        synchronize: false,
        entities: [__dirname + '/module/mt4/*.{ts,js}'],
        logging: true,
        extra: {
          connectionLimit: 100,
        },
      }),
      inject: [Config],
    }),
    TypeOrmModule.forRootAsync({
      name: 'mt5to4report',
      useFactory: (config: Config) => ({
        keepConnectionAlive: true,
        type: 'mysql',
        host: config.get('reportdb')['mt5']['db_host'],
        port: config.get('reportdb')['mt5']['db_port'],
        username: config.get('reportdb')['mt5']['db_username'],
        password: config.get('reportdb')['mt5']['db_pwd'],
        database: config.get('reportdb')['mt5']['db_name'],
        synchronize: false,
        entities: [__dirname + '/module/mt4/*.{ts,js}'],
        logging: true,
        extra: {
          connectionLimit: 100,
        },
      }),
      inject: [Config],
    }),
    TypeOrmModule.forRootAsync({
      name: 'mt5to4report_demo',
      useFactory: (config: Config) => ({
        keepConnectionAlive: true,
        type: 'mysql',
        host: config.get('reportdb')['mt5_demo']['db_host'],
        port: config.get('reportdb')['mt5_demo']['db_port'],
        username: config.get('reportdb')['mt5_demo']['db_username'],
        password: config.get('reportdb')['mt5_demo']['db_pwd'],
        database: config.get('reportdb')['mt5_demo']['db_name'],
        synchronize: false,
        entities: [__dirname + '/module/mt4/*.{ts,js}'],
        logging: true,
        extra: {
          connectionLimit: 100,
        },
      }),
      inject: [Config],
    }),
    TypeOrmModule.forRootAsync({
      name: 'mt4_s02',
      useFactory: (config: Config) => ({
        keepConnectionAlive: true,
        type: 'mysql',
        host: config.get('reportdb')['mt4_s02']['db_host'],
        port: config.get('reportdb')['mt4_s02']['db_port'],
        username: config.get('reportdb')['mt4_s02']['db_username'],
        password: config.get('reportdb')['mt4_s02']['db_pwd'],
        database: config.get('reportdb')['mt4_s02']['db_name'],
        synchronize: false,
        entities: [__dirname + '/module/mt4/*.{ts,js}'],
        logging: true,
        extra: {
          connectionLimit: 100,
        },
      }),
      inject: [Config],
    }),
    TypeOrmModule.forRootAsync({
      name: 'mt4_s03',
      useFactory: (config: Config) => ({
        keepConnectionAlive: true,
        type: 'mysql',
        host: config.get('reportdb')['mt4_s03']['db_host'],
        port: config.get('reportdb')['mt4_s03']['db_port'],
        username: config.get('reportdb')['mt4_s03']['db_username'],
        password: config.get('reportdb')['mt4_s03']['db_pwd'],
        database: config.get('reportdb')['mt4_s03']['db_name'],
        synchronize: false,
        entities: [__dirname + '/module/mt4/*.{ts,js}'],
        logging: true,
        extra: {
          connectionLimit: 100,
        },
      }),
      inject: [Config],
    }),
    TypeOrmModule.forRoot({
      name: 'relationship',
      type: 'mysql',
      host: new ConfigService().get('RELATIONSHIP_DB_HOST'),
      port: new ConfigService().get('RELATIONSHIP_DB_PORT'),
      username: new ConfigService().get('RELATIONSHIP_DB_USERNAME'),
      password: new ConfigService().get('RELATIONSHIP_DB_PASSWORD'),
      database: new ConfigService().get('RELATIONSHIP_DB_NAME'),
      synchronize: false,
      entities: [__dirname + '/module/relationship/*.{ts,js}'],
      logging: true,
      extra: {
        connectionLimit: 100,
      },
      multipleStatements: true,
    }),
    TypeOrmModule.forRoot({
      name: 'crm',
      type: 'mysql',
      host: new ConfigService().get('CRM_DB_HOST'),
      port: new ConfigService().get('CRM_DB_PORT'),
      username: new ConfigService().get('CRM_DB_USERNAME'),
      password: new ConfigService().get('CRM_DB_PASSWORD'),
      database: new ConfigService().get('CRM_DB_NAME'),
      synchronize: false,
      entities: [__dirname + '/module/crm/*.{ts,js}'],
      logging: true,
      extra: {
        connectionLimit: 100,
      },
    }),
    LoggerModule,
    AxiosModule,
    // 以上为全局公共模块，业务模块中无需再单独引入
    UsersModule,
    OrdersModule,
    IbListModule,
    AccountCreateModule,
    MteventModule,
    MoneyRecordModule,
    LeadPrdModule,
    PositionsModule,
    CustomerListModule,
    TradeAccountModule,
    UserRecordsModule,
    TransactionListModule,
    CrmModule,
    AffModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}


