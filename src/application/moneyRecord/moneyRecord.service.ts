import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { mt4_sync_credit } from '../../module/mt4/mt4_sync_credit';
import { Injectable, Param, Query } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class MoneyRecordService {
  constructor(
    @InjectRepository(mt4_sync_credit, 'mt4report')
    private mt4SyncCreditRepository: Repository<mt4_sync_credit>,
    @InjectRepository(mt4_sync_credit, 'mt4report_demo')
    private mt4demoSyncCreditRepository: Repository<mt4_sync_credit>,
    @InjectRepository(mt4_sync_credit, 'mt5to4report')
    private mt5SyncCreditRepository: Repository<mt4_sync_credit>,
    @InjectRepository(mt4_sync_credit, 'mt5to4report_demo')
    private mt5demoSyncCreditRepository: Repository<mt4_sync_credit>,
  ) { }

  /**
   * 查询用户资金记录
   * @author Ben
   * @param query
   */
  async getMoneyRecord(query) {
    const tradeTypeArr = ['credit', 'transfer', 'deposit', 'withdrawal']; // 四种交易类型,5张表
    const RADIX_DECIMAL = 10;
    const entity = query.entity ? (query.entity).toUpperCase() : 'KY'; // entity,将来会分库,暂时不用
    const page = parseInt(query.page || 1, RADIX_DECIMAL); // 第几页
    const pageSize = parseInt(query.pageSize || 10, RADIX_DECIMAL); // 每页展示多少条
    const startDate = query.startDate ? Number(query.startDate) : ''; // 开始时间
    const endDate = query.endDate ? Number(query.endDate) : ''; // 结束时间
    const sortKey = query.sortKey || 'Close_Time'; // 排序key
    const sortVal = query.sortVal || 'DESC'; // 倒序
    const tradeAccount = query.tradeAccount ? JSON.parse(query.tradeAccount) : ''; // 交易号{mt4:[1,2]}
    let tradeAccountType = ''; // 交易账号类型
    let tradeType = query.tradeType || []; // 交易类型
    if (tradeType.length === 0) { // 如果不选为全部类型
      tradeType = tradeTypeArr;
    }
    if (entity && typeof tradeAccount === 'object') {
      let queriesTotal = 0; // 查询次数,一个库算一次
      let count = 0;
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
            where += ` AND Close_Time
            BETWEEN '${moment(startDate).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')}'
            AND '${moment(endDate).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')}'`;
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
                subSql.push(` ( SELECT ${select},'transferOut' AS Type
                  FROM ${from}${type}_out WHERE ${where} ) `);
                subSql.push(` ( SELECT ${select},'transferIn' AS Type
                  FROM ${from}${type}_in WHERE ${where} ) `);
              } else {
                subSql.push(` ( SELECT ${select},'${type}' AS Type
                FROM ${from}${type} WHERE ${where} ) `);
              }
            }
          }

          if (subSql.length && tradeAccountType) {
            let countResult = await this[`${tradeAccountType}SyncCreditRepository`]
              .query(`SELECT COUNT(*) AS count FROM (${subSql.join('UNION ALL')}) AS subResult`);
            countResult = JSON.parse(JSON.stringify(countResult));
            count += Number(countResult[0].count);

            const sql = `SELECT ${select},Type FROM (${subSql.join('UNION ALL')}) AS subResult
            ORDER BY ${sortKey} ${sortVal}
            LIMIT ${(page - 1) * pageSize + pageSize}`;
            let listResult = await this[`${tradeAccountType}SyncCreditRepository`].query(sql);
            listResult = JSON.parse(JSON.stringify(listResult));
            list = list.concat(listResult);
            queriesTotal++;
          }
        }
      }
      // 如果查了多个库,数据会多出来,手动排序
      if (queriesTotal > 1) {
        // 根据Close_Time字段对[{}, {}]进行倒序
        list = list.sort(function (a, b) {
          return (b.Close_Time - a.Close_Time);
        });
      }
      // 根据page、pageSize，利用slice()手动分页
      list = list.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
      return { code: 1004, message: '数据查询成功', data: { count, list } };
    }
    return { code: 2015, message: '参数错误', data: '' };
  }

}
