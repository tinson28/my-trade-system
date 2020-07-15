import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mt4_sync_order } from '../../module/mt4/mt4_sync_order';
import { relationship } from '../../module/relationship/relationship';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../@nt';
import moment = require('moment');

@Injectable()
export class IbListService {

  constructor(
    @InjectRepository(mt4_sync_order, 'mt5to4report') private mt5Repository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4report') private mt4Repository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt5to4report_demo') private mt5_demoRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4report_demo') private mt4_demoRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4_s02') private mt4_s02Repository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4_s03') private mt4_s03Repository: Repository<mt4_sync_order>,
    @InjectRepository(relationship, 'relationship') private relationshipRepository: Repository<relationship>,
    protected configService: ConfigService,
  ) { }
  readonly relationshipDbName = this.configService.get('RELATIONSHIP_DB_NAME');

  async getIbList(query) {
    const accountNumber = query.accountNumber;
    const entity = query.entity;
    const sortKey = query.sortKey;
    const sortVal = query.sortVal;
    const offset = query.offset;
    const limit = query.limit;

    // 0.通过 主账号 去 relationship表 查询 该主账号的path
    const sql0StartTime = moment().valueOf();
    const sql0 = `SELECT path
                  FROM ${this.relationshipDbName}.relationship
                  WHERE node_id = ${accountNumber}`;
    let accountInfo = await this.relationshipRepository.query(sql0);
    const sql0EndTime = moment().valueOf();
    console.log('getIbList.sql0.开始:', sql0StartTime);
    console.log('getIbList.sql0.结束:', sql0EndTime);
    console.log('getIbList.sql0.耗时:', sql0EndTime - sql0StartTime);
    accountInfo = JSON.parse(JSON.stringify(accountInfo))[0];
    const path = accountInfo.path;
    // console.log('path：', path);

    // 1.通过条件 去 relationship表 找到该代理下的所有IB CL TD
    const sql1StartTime = moment().valueOf();
    const sql1 = `SELECT node_id, trade_system, path, acc_type, parent_id
                 FROM ${this.relationshipDbName}.relationship
                 WHERE entity = '${entity}' AND path LIKE '${path}%'`;
    let allTradeAccounts = await this.relationshipRepository.query(sql1);
    const sql1EndTime = moment().valueOf();
    console.log('getIbList.sql1.开始:', sql1StartTime);
    console.log('getIbList.sql1.结束:', sql1EndTime);
    console.log('getIbList.sql1.耗时:', sql1EndTime - sql1StartTime);
    allTradeAccounts = JSON.parse(JSON.stringify(allTradeAccounts));
    // console.log('allTradeAccounts：', allTradeAccounts);

    // 2.TD交易账号按 trade_system 分组
    const tradeAccountGroupByMt = {};
    for (const tradeAccount of allTradeAccounts) {
      if (tradeAccount.acc_type === 'TD') {
        const nodeId = Number(tradeAccount.node_id);
        if (!tradeAccountGroupByMt[tradeAccount.trade_system]) {
          tradeAccountGroupByMt[tradeAccount.trade_system] = [];
        }
        tradeAccountGroupByMt[tradeAccount.trade_system].push(nodeId);
      }
    }
    // console.log(tradeAccountGroupByMt);

    // 3.查出各个 trade_system 的 TD users 资料
    const sql2StartTime = moment().valueOf();
    let tradeAccountInfoCounts = []; // 交易账号 个人数据 统计
    for (const key in tradeAccountGroupByMt) {
      if (tradeAccountGroupByMt.hasOwnProperty(key)) {
        const tradeAccountArr = tradeAccountGroupByMt[key]; // 交易账号数组
        const tradeSystem = key.toLowerCase(); // trade_system
        // 通过 交易账号 去 users表 找到交易账户资料
        const sql2 = `SELECT LOGIN, BALANCE, EQUITY, MARGIN_FREE
                      FROM mt4_users
                      WHERE LOGIN IN (${tradeAccountArr.join(',')})`;
        let tradeAccountInfo = await this[`${tradeSystem}Repository`].query(sql2);
        tradeAccountInfo = JSON.parse(JSON.stringify(tradeAccountInfo));
        tradeAccountInfoCounts = tradeAccountInfoCounts.concat(tradeAccountInfo);
      }
    }
    const sql2EndTime = moment().valueOf();
    console.log('getIbList.sql2.开始:', sql2StartTime);
    console.log('getIbList.sql2.结束:', sql2EndTime);
    console.log('getIbList.sql2.耗时:', sql2EndTime - sql2StartTime);
    // console.log('tradeAccountInfoCounts：', tradeAccountInfoCounts);
    // 4.整合数据
    const sql4StartTime = moment().valueOf();
    const ibInfoArr = allTradeAccounts.filter(x => x.acc_type === 'IB'); // IB relationship信息数组
    // 交易账号: relationship 和 mt4_users数据合并
    for (const key in allTradeAccounts) {
      if (allTradeAccounts.hasOwnProperty(key)) {
        for (const tradeAccountInfo of tradeAccountInfoCounts) {
          if (Number(allTradeAccounts[key].node_id) === Number(tradeAccountInfo.LOGIN)) {
            allTradeAccounts[key] = Object.assign(allTradeAccounts[key], tradeAccountInfo);
            break;
          }
        }
      }
    }
    ibInfoArr.forEach((ib) => {
      const nodeId = Number(ib.node_id);
      let BALANCE = 0; // 余额
      let EQUITY = 0; // 净值
      let MARGIN_FREE = 0; // 可用保证金
      let agentCount = 0; // 子代理数
      let clientCount = 0; // 客户数
      const regExp = new RegExp(`\/${nodeId}(\/+|$)`);
      allTradeAccounts
        .filter(tdInfo => Number(tdInfo.node_id) !== nodeId && regExp.test(tdInfo.path))
        .map((item) => {
          if (item.acc_type === 'TD') {
            BALANCE = BALANCE + (item.BALANCE || 0);
            EQUITY = EQUITY + (item.EQUITY || 0);
            MARGIN_FREE = MARGIN_FREE + (item.MARGIN_FREE || 0);
          } else if (item.acc_type === 'IB') {
            agentCount += 1;
          } else if (item.acc_type === 'CL') {
            clientCount += 1;
          }
        });
      ib['BALANCE'] = BALANCE;
      ib['EQUITY'] = EQUITY;
      ib['MARGIN_FREE'] = MARGIN_FREE;
      ib['agentCount'] = agentCount;
      ib['clientCount'] = clientCount;
    });
    const masterAccount = ibInfoArr.filter(x => Number(x.node_id) === Number(accountNumber));
    let othersAccount = ibInfoArr.filter(x => Number(x.node_id) !== Number(accountNumber));
    const totalPages = othersAccount.length;

    othersAccount.sort((a, b) => {
      if (parseInt(a.node_id, 10) === accountNumber) {
        return -1;
      }
      if (parseInt(b.node_id, 10) === accountNumber) {
        return 1;
      }
      if (sortVal === 'ASC') {
        if (parseInt(a[sortKey], 10) > parseInt(b[sortKey], 10)) {
          return 1;
        }
        if (parseInt(a[sortKey], 10) < parseInt(b[sortKey], 10)) {
          return -1;
        }
        return 0;
      }
      if (sortVal === 'DESC') {
        if (parseInt(a[sortKey], 10) > parseInt(b[sortKey], 10)) {
          return -1;
        }
        if (parseInt(a[sortKey], 10) < parseInt(b[sortKey], 10)) {
          return 1;
        }
        return 0;
      }
      return 0;
    });

    if (offset) {
      othersAccount = othersAccount.splice(offset);
    }
    if (limit) {
      othersAccount = othersAccount.splice(0, limit);
    }
    const sql4EndTime = moment().valueOf();
    console.log('getIbList.数据整合开始:', sql4StartTime);
    console.log('getIbList.数据整合结束:', sql4EndTime);
    console.log('getIbList.数据整合耗时:', sql4EndTime - sql4StartTime);

    return { masterAccount, othersAccount, totalPages };
  }

  async getIBAndCLAndTD(accountNumber, entity) {
    const sql = '(SELECT relationship.*, 0 AS BALANCE, 0 AS EQUITY, 0 AS MARGIN_FREE ' +
      `FROM ${this.configService.get('RELATIONSHIP_DB_NAME')}.relationship ` +
      `LEFT JOIN ${this.configService.get('MT4_DB_NAME')}.mt4_users ` +
      'ON relationship.node_id = mt4_users.LOGIN ' +
      "WHERE (relationship.acc_type = 'IB' OR relationship.acc_type = 'CL') " +
      'AND relationship.entity = ? ' +
      'AND relationship.path REGEXP ? ) ' +
      'UNION ' +
      '(SELECT relationship.*, ' +
      'mt4_users.BALANCE, mt4_users.EQUITY, mt4_users.MARGIN_FREE ' +
      `FROM ${this.configService.get('RELATIONSHIP_DB_NAME')}.relationship ` +
      `LEFT JOIN ${this.configService.get('MT4_DB_NAME')}.mt4_users ` +
      'ON relationship.node_id = mt4_users.LOGIN ' +
      "WHERE (relationship.trade_system = 'mt4' AND relationship.acc_type = 'TD') " +
      'AND relationship.entity = ? ' +
      'AND relationship.path REGEXP ? ) ' +
      'UNION ' +
      '(SELECT relationship.*, ' +
      'mt4_users.BALANCE, mt4_users.EQUITY, mt4_users.MARGIN_FREE ' +
      `FROM ${this.configService.get('RELATIONSHIP_DB_NAME')}.relationship ` +
      `LEFT JOIN ${this.configService.get('DB_NAME')}.mt4_users ` +
      'ON relationship.node_id = mt4_users.LOGIN ' +
      "WHERE (relationship.trade_system = 'mt5' AND relationship.acc_type = 'TD') " +
      'AND relationship.entity = ? ' +
      'AND relationship.path REGEXP ? ) ';

    const sqlParams = [
      entity, `(\/+|^)${accountNumber}(\/+|$)`,
      entity, `(\/+|^)${accountNumber}(\/+|$)`,
      entity, `(\/+|^)${accountNumber}(\/+|$)`,
    ];
    const relationships = await this.relationshipRepository
      .query(sql, sqlParams);

    return relationships;
  }

}
