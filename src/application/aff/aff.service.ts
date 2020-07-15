import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import moment = require('moment');
import { mt4_sync_credit } from '../../module/mt4/mt4_sync_credit';
import { mt4_sync_order } from '../../module/mt4/mt4_sync_order';
import { mt4_prices } from '../../module/mt4/mt4_prices';
import { Injectable, Param, Query, Logger } from '@nestjs/common';

@Injectable()
export class AffService {
  constructor(
    @InjectRepository(mt4_sync_credit, 'mt4report') private mt4SyncCreditRepository: Repository<mt4_sync_credit>,
    @InjectRepository(mt4_sync_credit, 'mt4report_demo') private mt4demoSyncCreditRepository: Repository<mt4_sync_credit>,
    @InjectRepository(mt4_sync_credit, 'mt5to4report') private mt5SyncCreditRepository: Repository<mt4_sync_credit>,
    @InjectRepository(mt4_sync_credit, 'mt5to4report_demo') private mt5demoSyncCreditRepository: Repository<mt4_sync_credit>,
    @InjectRepository(mt4_sync_credit, 'mt4_s02') private mt4_s02SyncCreditRepository: Repository<mt4_sync_credit>,
    @InjectRepository(mt4_sync_credit, 'mt4_s03') private mt4_s03SyncCreditRepository: Repository<mt4_sync_credit>,

    @InjectRepository(mt4_sync_order, 'mt4report') private mt4SyncOrdersRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4report_demo') private mt4demoSyncOrdersRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt5to4report') private mt5SyncOrdersRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt5to4report_demo') private mt5demoSyncOrdersRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4_s02') private mt4_s02SyncOrdersRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4_s03') private mt4_s03SyncOrdersRepository: Repository<mt4_sync_order>,

    @InjectRepository(mt4_prices, 'mt4report') private mt4PricesRepository: Repository<mt4_prices>,
    @InjectRepository(mt4_prices, 'mt4report_demo') private mt4demoPricesRepository: Repository<mt4_prices>,
    @InjectRepository(mt4_prices, 'mt5to4report') private mt5PricesRepository: Repository<mt4_prices>,
    @InjectRepository(mt4_prices, 'mt5to4report_demo') private mt5demoPricesRepository: Repository<mt4_prices>,
    @InjectRepository(mt4_prices, 'mt4_s02') private mt4_s02PricesRepository: Repository<mt4_prices>,
    @InjectRepository(mt4_prices, 'mt4_s03') private mt4_s03PricesRepository: Repository<mt4_prices>,
  ) { }

	/**
	 * 查询用户资金记录
	 * @param query
	 */
  async getMoneyRecord(query) {
    const tradeTypeArr = ['credit', 'transfer', 'deposit', 'withdrawal']; // 四种交易类型,5张表
    const entity = query.entity ? (query.entity).toUpperCase() : 'KY'; // entity,将来会分库,暂时不用
    const startDate = query.startDate ? query.startDate : ''; // 开始时间
    const endDate = query.endDate ? query.endDate : ''; // 结束时间
    const sortKey = query.sortKey || 'Close_Time'; // 排序key
    const sortVal = query.sortVal || 'DESC'; // 倒序
    const tradeAccount = query.tradeAccount ? JSON.parse(query.tradeAccount) : ''; // 交易号{mt4:[1,2]}
    let tradeAccountType = ''; // 交易账号类型
    let tradeType = query.tradeType || []; // 交易类型
    if (tradeType.length === 0) { // 如果不选为全部类型
      tradeType = tradeTypeArr;
    }

    if (entity && typeof tradeAccount === 'object') {
      let list = [];
      for (const key in tradeAccount) {
        if (tradeAccount.hasOwnProperty(key)) {
          const tradeAccountArr = tradeAccount[key]; // 交易账号
          tradeAccountType = key.toLowerCase(); // 交易账号类型
          if (tradeAccountType === 'mt4_demo') {
            tradeAccountType = 'mt4demo';
          } else if (tradeAccountType === 'mt5_demo') {
            tradeAccountType = 'mt5demo';
          }
          const select = '`Login`,`Ticket`,`Profit`,`Comment`,`Close_Time`';
          const from = 'mt4_sync_';
          let where = '1 = 1';
          // 日期
          if (startDate && endDate) {
            where += ` AND Close_Time BETWEEN '${moment(startDate).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')}' AND '${moment(endDate).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')}'`;
          }
          // Login
          if (tradeAccountArr.length) {
            where += ` AND Login IN (${tradeAccountArr.join(',')})`;
          }
          // tradeType
          const subSql = [];
          for (const type of tradeType) {
            if (tradeTypeArr.indexOf(type) >= 0) {
              if (type === 'transfer') {
                subSql.push(` ( SELECT ${select},'transferOut' AS Type FROM ${from}${type}_out WHERE ${where} ) `);
                subSql.push(` ( SELECT ${select},'transferIn' AS Type FROM ${from}${type}_in WHERE ${where} ) `);
              } else {
                subSql.push(` ( SELECT ${select},'${type}' AS Type FROM ${from}${type} WHERE ${where} ) `);
              }
            }
          }

          if (subSql.length && tradeAccountType) {
            const sql = `SELECT ${select},Type FROM (${subSql.join('UNION ALL')}) AS subResult ORDER BY ${sortKey} ${sortVal}`;
            let listResult = await this[`${tradeAccountType}SyncCreditRepository`].query(sql);
            listResult = JSON.parse(JSON.stringify(listResult));
            list = list.concat(listResult);

            // 取得货币并整合进list
            let newSql = `SELECT LOGIN, CURRENCY FROM mt4_users WHERE LOGIN IN (${tradeAccountArr.join(',')})`;
            let getCurrency = await this[`${tradeAccountType}SyncCreditRepository`].query(newSql);
            getCurrency = JSON.parse(JSON.stringify(getCurrency));
            for (const key in list) {
              if (list.hasOwnProperty(key)) {
                const element = list[key];
                for (const item of getCurrency) {
                  if (item.LOGIN == element.Login) {
                    list[key]['currency'] = item.CURRENCY
                  }
                }
              }
            }
            // console.log(1111111, list, getCurrency);
          }
        }
      }
      const count = list.length;
      return { code: 1004, message: '数据查询成功', data: { count, list } };
    }
    return { code: 2015, message: '参数错误', data: '' };
  }

  /**
   * 交易记录
   * @param query
   */
  async getTradeRecord(query) {
    // query.tradeAccount = '{"mt5_demo":["3241","696000021","696000022"],"mt4_demo":["3241","691000031","601000002"],"mt4_s02":["3241","63200023","652000001"],"mt4_s03":["62200031", "69200055","623000000"]}' ;
    const entity = query.entity ? (query.entity).toUpperCase() : 'KY'; // entity,将来会分库,暂时不用
    const startDate = query.startDate ? query.startDate : ''; // 开始时间
    const endDate = query.endDate ? query.endDate : ''; // 结束时间
    const tradeAccount = query.tradeAccount ? JSON.parse(query.tradeAccount) : ''; // 交易号{mt4:[1,2]}
    let tradeAccountType = ''; // 交易账号类型
    if (entity && typeof tradeAccount === 'object') {
      let list = [];
      for (const key in tradeAccount) {
        if (tradeAccount.hasOwnProperty(key)) {
          const tradeAccountArr = tradeAccount[key]; // 交易账号
          tradeAccountType = key.toLowerCase(); // 交易账号类型
          if (tradeAccountType === 'mt4_demo') {
            tradeAccountType = 'mt4demo';
          } else if (tradeAccountType === 'mt5_demo') {
            tradeAccountType = 'mt5demo';
          }
          let where = `WHERE Close_Time <> '1970-01-01 00:00:00'`;
          // 日期
          if (startDate && endDate) {
            where += ` AND Close_Time BETWEEN '${moment(startDate).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')}' AND '${moment(endDate).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')}'`;
          }
          // Login
          if (tradeAccountArr.length) {
            where += ` AND Login IN (${tradeAccountArr.join(',')})`;
          }
          let sql = `SELECT * FROM mt4_sync_order as o LEFT JOIN mt4_prices as p ON o.Symbol = p.SYMBOL ${where}`;
          let listResult = await this[`${tradeAccountType}SyncOrdersRepository`].query(sql);
          listResult = JSON.parse(JSON.stringify(listResult));
          list = list.concat(listResult);

          // 取得货币并整合进list
          let newSql = `SELECT LOGIN, CURRENCY FROM mt4_users WHERE LOGIN IN (${tradeAccountArr.join(',')})`;
          let getCurrency = await this[`${tradeAccountType}SyncOrdersRepository`].query(newSql);
          getCurrency = JSON.parse(JSON.stringify(getCurrency));
          for (const key in list) {
            if (list.hasOwnProperty(key)) {
              const element = list[key];
              for (const item of getCurrency) {
                if (item.LOGIN == element.Login) {
                  list[key]['currency'] = item.CURRENCY
                }
              }
            }
          }
          // console.log(222222, list, getCurrency);
        }
      }
      const count = list.length;
      return { code: 1004, message: '数据查询成功', data: { count, list } };
    }
    return { code: 2015, message: '参数错误', data: '' };
  }

}