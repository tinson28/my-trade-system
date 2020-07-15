import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { relationship } from '../../module/relationship/relationship';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '../../@nt';
import { Config } from 'nestjs-async-config';
import moment = require('moment');

@Injectable()
export class CustomerListService {

  constructor(
    @Inject(Config) readonly config: Config,
    @InjectRepository(relationship, 'relationship')
    private relationshipRepository: Repository<relationship>,
    protected configService: ConfigService,
  ) { }

  readonly mt4DbName = this.config.get('reportdb')['mt4']['db_name'];
  readonly mt5DbName = this.config.get('reportdb')['mt5']['db_name'];
  readonly mt4_demoDbName = this.config.get('reportdb')['mt4_demo']['db_name'];
  readonly mt5_demoDbName = this.config.get('reportdb')['mt5_demo']['db_name'];
  readonly mt4_s02DbName = this.config.get('reportdb')['mt4_s02']['db_name'];
  readonly mt4_s03DbName = this.config.get('reportdb')['mt4_s03']['db_name'];
  readonly relationshipDbName = this.configService.get('RELATIONSHIP_DB_NAME');

  async getCLAndTD(accountNumber, entity) {
    try {
      const sql0StartTime = moment().valueOf();
      const sql = `(SELECT relationship.*, 0 AS BALANCE, 0 AS EQUITY
        FROM ${this.relationshipDbName}.relationship
        WHERE relationship.acc_type = 'CL'
        AND relationship.entity = ?
        AND relationship.path REGEXP ? )
        UNION ALL
        (SELECT relationship.*,
        mt4_users.BALANCE, mt4_users.EQUITY
        FROM ${this.relationshipDbName}.relationship
        LEFT JOIN ${this.mt4DbName}.mt4_users
        ON relationship.node_id = mt4_users.LOGIN
        WHERE (relationship.trade_system = 'mt4' AND relationship.acc_type = 'TD')
        AND relationship.entity = ?
        AND relationship.path REGEXP ? )
        UNION ALL
        (SELECT relationship.*,
        mt4_users.BALANCE, mt4_users.EQUITY
        FROM ${this.relationshipDbName}.relationship
        LEFT JOIN ${this.mt4_s02DbName}.mt4_users
        ON relationship.node_id = mt4_users.LOGIN
        WHERE (relationship.trade_system = 'mt4_s02' AND relationship.acc_type = 'TD')
        AND relationship.entity = ?
        AND relationship.path REGEXP ? )
        UNION ALL
        (SELECT relationship.*,
          mt4_users.BALANCE, mt4_users.EQUITY
          FROM ${this.relationshipDbName}.relationship
          LEFT JOIN ${this.mt4_s03DbName}.mt4_users
          ON relationship.node_id = mt4_users.LOGIN
          WHERE (relationship.trade_system = 'mt4_s03' AND relationship.acc_type = 'TD')
          AND relationship.entity = ?
          AND relationship.path REGEXP ? )
          UNION ALL
        (SELECT relationship.*,
        mt4_users.BALANCE, mt4_users.EQUITY
        FROM ${this.relationshipDbName}.relationship
        LEFT JOIN ${this.mt5DbName}.mt4_users
        ON relationship.node_id = mt4_users.LOGIN
        WHERE (relationship.trade_system = 'mt5' AND relationship.acc_type = 'TD')
        AND relationship.entity = ?
        AND relationship.path REGEXP ? ) `;

      const sqlParams = [
        entity, `(\/+|^)${accountNumber}(\/+|$)`,
        entity, `(\/+|^)${accountNumber}(\/+|$)`,
        entity, `(\/+|^)${accountNumber}(\/+|$)`,
        entity, `(\/+|^)${accountNumber}(\/+|$)`,
        entity, `(\/+|^)${accountNumber}(\/+|$)`,
      ];
      const result = await this.relationshipRepository.query(sql, sqlParams);
      const sql0EndTime = moment().valueOf();
      console.log('getCustomerList.sql.开始:', sql0StartTime);
      console.log('getCustomerList.sql.结束:', sql0EndTime);
      console.log('getCustomerList.sql.耗时:', sql0EndTime - sql0StartTime);
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getTradeAccount(accountNumber, entity) {
    try {
      const sql0StartTime = moment().valueOf();
      const sql = `
      SELECT relationship.node_id, relationship.trade_system,
        mt4_users.GROUP, mt4_users.EQUITY, mt4_users.LEVERAGE, mt4_users.CURRENCY,
        mt4_users.MARGIN, mt4_users.MARGIN_LEVEL,
        mt4_users.ENABLE, mt4_users.ENABLE_READONLY
      FROM ${this.relationshipDbName}.relationship
        INNER JOIN ${this.mt4DbName}.mt4_users ON relationship.node_id = mt4_users.LOGIN
      WHERE (relationship.trade_system = 'mt4' AND relationship.acc_type = 'TD')
        AND relationship.entity = ?
        AND relationship.master_account_number = ?
      UNION ALL
      SELECT relationship.node_id, relationship.trade_system,
        mt4_users.GROUP, mt4_users.EQUITY, mt4_users.LEVERAGE, mt4_users.CURRENCY,
        mt4_users.MARGIN, mt4_users.MARGIN_LEVEL,
        mt4_users.ENABLE, mt4_users.ENABLE_READONLY
      FROM ${this.relationshipDbName}.relationship
        INNER JOIN ${this.mt4_s02DbName}.mt4_users ON relationship.node_id = mt4_users.LOGIN
      WHERE (relationship.trade_system = 'mt4_s02' AND relationship.acc_type = 'TD')
        AND relationship.entity = ?
        AND relationship.master_account_number = ?
      UNION ALL
      SELECT relationship.node_id, relationship.trade_system,
        mt4_users.GROUP, mt4_users.EQUITY, mt4_users.LEVERAGE, mt4_users.CURRENCY,
        mt4_users.MARGIN, mt4_users.MARGIN_LEVEL,
        mt4_users.ENABLE, mt4_users.ENABLE_READONLY
      FROM ${this.relationshipDbName}.relationship
        INNER JOIN ${this.mt4_s03DbName}.mt4_users ON relationship.node_id = mt4_users.LOGIN
      WHERE (relationship.trade_system = 'mt4_s03' AND relationship.acc_type = 'TD')
        AND relationship.entity = ?
        AND relationship.master_account_number = ?
      UNION ALL
      SELECT relationship.node_id, relationship.trade_system,
        mt4_users.GROUP, mt4_users.EQUITY, mt4_users.LEVERAGE, mt4_users.CURRENCY,
        mt4_users.MARGIN, mt4_users.MARGIN_LEVEL,
        mt4_users.ENABLE, mt4_users.ENABLE_READONLY
      FROM ${this.relationshipDbName}.relationship
        INNER JOIN ${this.mt5DbName}.mt4_users ON relationship.node_id = mt4_users.LOGIN
      WHERE (relationship.trade_system = 'mt5' AND relationship.acc_type = 'TD')
        AND relationship.entity = ?
        AND relationship.master_account_number = ? `;

      const sqlParams = [entity, accountNumber, entity, accountNumber, entity, accountNumber, entity, accountNumber];
      const result = await this.relationshipRepository.query(sql, sqlParams);
      const sql0EndTime = moment().valueOf();
      console.log('getTradeAccounts.sql.开始:', sql0StartTime);
      console.log('getTradeAccounts.sql.结束:', sql0EndTime);
      console.log('getTradeAccounts.sql.耗时:', sql0EndTime - sql0StartTime);
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }
}
