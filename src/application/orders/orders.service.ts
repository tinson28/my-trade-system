import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like, Between } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { mt4_sync_order } from '../../module/mt4/mt4_sync_order';
import { relationship } from '../../module/relationship/relationship';
import { TradeListReqDto } from './tradeListReq.dto';
import { ConfigService } from '../..//@nt';
import * as moment from 'moment';
import { mt4_users } from '../../module/mt4/mt4_users';
import { MtEventService } from '../mtevent/mtevent.service';
import { Config } from 'nestjs-async-config';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(Config) readonly config: Config,
    @InjectRepository(mt4_sync_order, 'mt5to4report') private mt5ordersRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4report') private mt4ordersRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt5to4report_demo') private mt5_demoordersRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4report_demo') private mt4_demoordersRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4_s02') private mt4_s02ordersRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4_s03') private mt4_s03ordersRepository: Repository<mt4_sync_order>,
    @InjectRepository(relationship, 'relationship')
    private relationshipRepository: Repository<relationship>,
    protected readonly configService: ConfigService,
    protected readonly mtEventService: MtEventService,
  ) { }

  readonly mt4DatabaseName = this.config.get('reportdb')['mt4']['db_name'];
  readonly mt5DatabaseName = this.config.get('reportdb')['mt5']['db_name'];
  readonly mt4_demoDatabaseName = this.config.get('reportdb')['mt4_demo']['db_name'];
  readonly mt5_demoDatabaseName = this.config.get('reportdb')['mt5_demo']['db_name'];
  readonly mt4_s02DatabaseName = this.config.get('reportdb')['mt4_s02']['db_name'];
  readonly mt4_s03DatabaseName = this.config.get('reportdb')['mt4_s03']['db_name'];
  readonly relationshipDbName = this.configService.get('RELATIONSHIP_DB_NAME');

  /**
   * @name 取得交易紀錄(已/未平倉)
   * @author RexHong 2019-12-02
   * @name 取得交易資料
   * @param {string} query.accountNumber 查詢主帳號
   * @param {string,open||close} query.openOrClosePosition 開倉/平倉
   * @param {string} query.entity 牌照
   * @param {string} query.symbol 商品名稱
   * @param {object} query.tradeAccount 交易帳號
   * @param {date} query.startDate 查詢日期(起)
   * @param {date} query.endDate 查詢日期(迄)
   * @param {string} query.sortKey 排序欄位
   * @param {string} query.sortValue 排序遞增/遞減
   * @param {number} query.pageSize 分頁筆數
   * @param {number} query.pageIndex 分頁數
   */
  async getOrderList(queryConditions: TradeListReqDto) {
    const entity = queryConditions.entity; // entity,将来会分库,暂时不用
    const pageIndex = Number(queryConditions.pageIndex); // 第几页
    const pageSize = Number(queryConditions.pageSize); // 每页展示多少条
    const openOrClosePosition = queryConditions.openOrClosePosition; // openOrClosePosition
    const startDate = queryConditions.startDate; // 开始时间
    const endDate = queryConditions.endDate; // 结束时间
    const symbol = queryConditions.symbol ? queryConditions.symbol : ''; // 商品名称
    const tradeType = queryConditions.tradeType; // 买卖类型
    const sortKey = queryConditions.sortKey; // 排序key
    const sortValue = (queryConditions.sortValue).toUpperCase(); // 倒序
    const tradeAccount = JSON.parse(queryConditions.tradeAccount); // 交易账号{mt4:[1,2]}

    let mtName = ''; // mtName
    let queriesTotal = 0; // 查询次数,一个库算一次
    let count = 0;
    let list = [];
    const select = '*';
    const from = 'mt4_sync_order';
    for (const key in tradeAccount) {
      if (tradeAccount.hasOwnProperty(key)) {
        const tradeAccountArr = tradeAccount[key]; // 交易账号
        mtName = key.toLowerCase(); // mtName
        let where = '1 = 1';
        // 日期
        if (startDate && endDate) {
          // 篩選交易時間(未平倉)
          if (openOrClosePosition === 'open') {
            where += ' AND Close_Time = \'1970-01-01 00:00:00\' ';
            where += ` AND Open_Time >= '${moment(startDate).format('YYYY-MM-DD')}'
                      AND Open_Time < '${moment(endDate).add(1, 'day').format('YYYY-MM-DD')}' `;
          }
          // 篩選交易時間(已平倉)
          if (openOrClosePosition === 'close') {
            where += ` AND Close_Time >= '${moment(startDate).format('YYYY-MM-DD')}'
                      AND Close_Time < '${moment(endDate).add(1, 'day').format('YYYY-MM-DD')}' `;
          }
        }
        // 篩選商品 Symbol
        if (symbol) {
          where += ` AND Symbol = '${symbol}' `;
        }
        // 篩選交易類型(0買,1賣) Cmd
        if (tradeType) {
          where += ` AND Cmd = ${tradeType}`;
        }
        // 交易账号 Login
        if (tradeAccountArr.length) {
          where += ` AND Login IN (${tradeAccountArr.join(',')})`;
        }
        // sql
        let countResult = await this[`${mtName}ordersRepository`]
          .query(`SELECT COUNT(*) AS count FROM ${from} WHERE ${where}`);
        countResult = JSON.parse(JSON.stringify(countResult));
        count += Number(countResult[0].count);

        const sql = `SELECT ${select} FROM ${from} WHERE ${where}
                    ORDER BY ${sortKey} ${sortValue}
                    LIMIT ${pageIndex * pageSize + pageSize}`;
        let listResult = await this[`${mtName}ordersRepository`].query(sql);
        listResult = JSON.parse(JSON.stringify(listResult));
        list = list.concat(listResult);
        queriesTotal++;
      }
    }
    // 如果查了多个库,数据会多出来,手动排序
    if (queriesTotal > 1) {
      // 根据sortKey字段对[{}, {}]进行排序
      if (sortValue === 'DESC') {
        list = list.sort(function (a, b) {
          return (b[sortKey] - a[sortKey]);
        });
      } else if (sortValue === 'ASC') {
        list = list.sort(function (a, b) {
          return (a[sortKey] - b[sortKey]);
        });
      }
    }
    // 根据pageIndex、pageSize，利用slice()手动分页
    list = list.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

    return { totalCount: count, data: list };
  }

  /**
   * @name 取得交易紀錄(已/未平倉)
   * @author RexHong 2019-12-02
   * @name 取得交易資料
   * @param {string} query.accountNumber 查詢主帳號
   * @param {string,open||close} query.openOrClosePosition 開倉/平倉
   * @param {string} query.entity 牌照
   * @param {string} query.symbol 商品名稱
   * @param {string} query.tradeAccount 交易帳號
   * @param {date} query.startDate 查詢日期(起)
   * @param {date} query.endDate 查詢日期(迄)
   * @param {string} query.sortKey 排序欄位
   * @param {string} query.sortValue 排序遞增/遞減
   * @param {number} query.pageSize 分頁筆數
   * @param {number} query.pageIndex 分頁數
   */
  async getOrderListOld(queryConditions: TradeListReqDto) {
    let where = '';
    let pager = '';

    // 篩選交易時間(未平倉)
    if (queryConditions.openOrClosePosition === 'open') {
      where += ' WHERE mt_order.Close_Time = \'1970-01-01 00:00:00\' ';
      where += ' and mt_order.Open_Time >= @startDate and mt_order.Open_Time < @endDate ';
    }

    // 篩選交易時間(已平倉)
    if (queryConditions.openOrClosePosition === 'close') {
      where += ' WHERE mt_order.Close_Time >= @startDate and mt_order.Close_Time < @endDate ';
    }

    // 篩選商品
    if (queryConditions.symbol) {
      where += ' and mt_order.Symbol = @symbol ';
    }

    // 篩選交易帳號
    if (queryConditions.tradeAccount) {
      where += ' and mt_order.Login = @tradeAccount ';
    }

    // 篩選交易類型(0買,1賣)
    if (queryConditions.tradeType === '0' || queryConditions.tradeType === '1') {
      where += ' and mt_order.cmd = @cmd';
    }

    // 分頁
    if (queryConditions.pageSize && queryConditions.pageIndex) {
      pager = `
      LIMIT ${queryConditions.pageSize}
      OFFSET ${queryConditions.pageIndex * queryConditions.pageSize} `;
    }

    // 查詢指令
    const selectCommand = `
    #MT4 交易資料
    SELECT tradeAccount.node_id
      , mt_order.Ticket, mt_order.Login, mt_order.Symbol, mt_order.Digits, mt_order.Cmd
      , format(IFNULL(mt_order.Volume,0) /100,2) AS Volume
      , mt_order.Open_Time, mt_order.Open_Price, mt_order.SL
      , mt_order.TP, mt_order.Close_Time, mt_order.Commission, mt_order.Commission_Agent
      , mt_order.Swaps, mt_order.Close_Price, mt_order.Profit, mt_order.Comment
      , mt_order.Timestamp, mt_order.Modify_Time
    FROM ${this.mt4DatabaseName}.mt4_sync_order as mt_order
      INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON tradeAccount.node_id = mt_order.LOGIN
    ${where}
    UNION ALL
    #MT5 交易資料
    SELECT tradeAccount.node_id
      , mt_order.Ticket, mt_order.Login, mt_order.Symbol, mt_order.Digits, mt_order.Cmd
      , format(IFNULL(mt_order.Volume,0) /100,2) AS Volume
      , mt_order.Open_Time, mt_order.Open_Price, mt_order.SL
      , mt_order.TP, mt_order.Close_Time, mt_order.Commission, mt_order.Commission_Agent
      , mt_order.Swaps, mt_order.Close_Price, mt_order.Profit, mt_order.Comment
      , mt_order.Timestamp, mt_order.Modify_Time
    FROM ${this.mt5DatabaseName}.mt4_sync_order as mt_order
      INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON tradeAccount.node_id = mt_order.LOGIN
    ${where}
    `;

    const sql = `
    # 設定參數
    SET @accountNumber = ?;
    SET @entity = ?;
    SET @startDate = ?;
    SET @endDate = ?;
    SET @symbol = ?;
    SET @tradeAccount = ?;
    SET @cmd = ?;

    # 檢查暫存表
    DROP TEMPORARY TABLE IF EXISTS temp_tradeAccount_mt4;
    DROP TEMPORARY TABLE IF EXISTS temp_tradeAccount_mt5;
    # 取得 MT4 交易帳號
    CREATE TEMPORARY TABLE temp_tradeAccount_mt4 (
      SELECT node_id
      FROM ${this.relationshipDbName}.relationship as relations
      WHERE relations.master_account_number = @accountNumber
        AND relations.entity = @entity
        AND relations.trade_system = 'mt4'
    );
    # 取得 MT5 交易帳號
    CREATE TEMPORARY TABLE temp_tradeAccount_mt5 (
      SELECT node_id
      FROM ${this.relationshipDbName}.relationship as relations
      WHERE relations.master_account_number = @accountNumber
        AND relations.entity = @entity
        AND relations.trade_system = 'mt5'
    );

    # 取得資料
    SELECT * FROM
    (
      ${selectCommand}
    ) AS ResultData
    ORDER BY ${queryConditions.sortKey} ${queryConditions.sortValue} ${pager} ;

    # 取得資料總筆數
    SELECT count(*) AS totalCount FROM
    (
      ${selectCommand}
    ) AS ResultData;`;

    const sqlParams = [
      queryConditions.accountNumber,
      queryConditions.entity,
      moment(queryConditions.startDate).format('YYYY-MM-DD'),
      moment(queryConditions.endDate).add(1, 'day').format('YYYY-MM-DD'),
      queryConditions.symbol,
      queryConditions.tradeAccount,
      queryConditions.tradeType,
    ];

    const result = await this.relationshipRepository.query(sql, sqlParams);
    const data = result[result.length - 2];
    const totalCount: number = parseInt(result[result.length - 1][0]['totalCount'], 10) || 0;

    return { data, totalCount };
  }

  /**
   * @name取得商品清單
   * @author RexHong 2019-12-03
   * @param accountNumber 主帳號
   * @param entity (必填) 牌照
   */
  async getSymbolList(queryConditions: TradeListReqDto) {
    const entity = queryConditions.entity; // entity,将来会分库,暂时不用
    const tradeAccount = JSON.parse(queryConditions.tradeAccount); // 交易账号{mt4:[1,2]}
    let mtName = ''; // mtName
    let list = [];
    const select = 'Symbol';
    const from = 'mt4_sync_order';
    for (const key in tradeAccount) {
      if (tradeAccount.hasOwnProperty(key)) {
        const tradeAccountArr = tradeAccount[key]; // 交易账号
        mtName = key.toLowerCase(); // mtName
        let where = '1 = 1';
        // 交易账号 Login
        if (tradeAccountArr.length) {
          where += ` AND Login IN (${tradeAccountArr.join(',')})`;
        }

        const sql = `SELECT ${select} FROM ${from} WHERE ${where} GROUP BY Symbol`;
        let listResult = await this[`${mtName}ordersRepository`].query(sql);
        listResult = JSON.parse(JSON.stringify(listResult));
        list = [...new Set(list.concat(listResult))];
      }
    }

    return list.map(x => x.Symbol);
  }

  /**
   * @name取得商品清單
   * @author RexHong 2019-12-03
   * @param accountNumber 主帳號
   * @param entity (必填) 牌照
   */
  async getSymbolListOld(accountNumber: number, entity: string) {
    const sql = `
    #設定參數
    SET @accountNumber = ?;
    SET @entity = ?;

    # 檢查暫存表
    DROP TEMPORARY TABLE IF EXISTS temp_tradeAccount_mt4;
    DROP TEMPORARY TABLE IF EXISTS temp_tradeAccount_mt5;
    # 取得 MT4 交易帳號
    CREATE TEMPORARY TABLE temp_tradeAccount_mt4 (
      SELECT node_id
      FROM ${this.relationshipDbName}.relationship as relations
      WHERE relations.master_account_number = @accountNumber
        AND relations.entity = @entity
        AND relations.trade_system = 'mt4'
    );
    # 取得 MT5 交易帳號
    CREATE TEMPORARY TABLE temp_tradeAccount_mt5 (
      SELECT node_id
      FROM ${this.relationshipDbName}.relationship as relations
      WHERE relations.master_account_number = @accountNumber
        AND relations.entity = @entity
        AND relations.trade_system = 'mt5'
    );

    SELECT symbol FROM
    (
    #MT4 交易資料
    SELECT mt_order.symbol
    FROM ${this.mt4DatabaseName}.mt4_sync_order as mt_order
      INNER JOIN temp_tradeAccount_mt4 as tradeAccount ON tradeAccount.node_id = mt_order.LOGIN
    UNION ALL
    # MT5 交易資料
    SELECT mt_order.symbol
    FROM ${this.mt5DatabaseName}.mt4_sync_order as mt_order
    INNER JOIN temp_tradeAccount_mt5 as tradeAccount ON tradeAccount.node_id = mt_order.LOGIN
    ) AS ResultData
    GROUP BY symbol;`;

    const sqlParams = [
      accountNumber,
      entity,
    ];

    const data = await this.relationshipRepository.query(sql, sqlParams);
    const result = data[data.length - 1];
    return result.map(x => x.symbol);
  }

  async findOrder(body: any) {
    let result = { count: '' }, sql, count;
    sql = await this[`${body.mtName.toLowerCase()}ordersRepository`].createQueryBuilder('order')
    sql.leftJoin(mt4_users, 'user', 'user.LOGIN = order.Login')
      .select('user.NAME, `order`.`*`');

    if (body.tradeType === 'unClosePosition') {
      sql.andWhere({
        Login: In(body.list),
        Close_Time: '1970-01-01 00:00:00',
        Open_Time: Between(body.startDate, body.endDate),
      });
    } else if (body.tradeType === 'ClosePosition') {
      sql.andWhere({
        Login: In(body.list),
        Close_Time: Between(body.startDate, body.endDate),
      });
    } else if (body.tradeType === 'All') {
      sql.where({ Login: In(body.list) });
      //   console.log(sql);
    }
    if (body.searchVals !== '' && body.searchKeys === 'Name') {
      sql.andWhere('user.NAME like :name', { name: `%${body.searchVals}%` });
    } else if (typeof body.searchVals !== 'undefined' && body.searchVals !== '') {
      sql.andWhere({
        [body.searchKeys]: Like('%' + body.searchVals + '%'),
      });
    }

    count = await sql.getCount();
    result = await sql.limit(body.limit)
      .offset(body.offset)
      .orderBy('order.' + body.sortKey, body.sort)
      .execute();
    let obj = {
      count,
      rows: result,
    };
    return obj;
  }

  // async findOrderNew(body: any, res) {
  //   try {
  //     console.log('body from k8s', body);
  //     // 確認他是 ib 還是 cl
  //     let sql;
  //     sql = await this.relationshipRepository.createQueryBuilder('relationship')
  //       .where('r.path REGEXP :regex', { regex: `(\/+|^)${body.node_id}(\/+|$)` })
  //       .andWhere(' r.entity = :entity', { entity: body.entity });
  //     const rows = await sql.limit(100).execute();
  //     const count = await sql.getCount();
  //     // console.log(rows)
  //     return res.status(200).json({ count, rows });
  //   } catch (e) {
  //     console.log(e);
  //     return res.status(400).json({
  //       message: 'have error in at-client-account-service findOrderNew',
  //     });
  //   }
  // }

  async findUncloseOrder(query: { type: String }, login: Number) {
    try {
      const result = await this[`${query.type}ordersRepository`].createQueryBuilder('order')
        .select('order.Login')
        .where({
          Login: login,
          Close_Time: '1970-01-01 00:00:00',
        })
        .execute();
      if (result.length >= 1) {
        // 有未平倉的數據
        return { exist: true, status: 'success' };
      }
      return { exist: false, status: 'success' };
    } catch (err) {
      console.log(err);
      return { message: 'findUncloseOrder have error', data: err.message, status: 'falid' };
    }
  }

  async withdrawalCheck(body) {
    const tradeAccount = body.tradeAccount;
    const startDate = moment(body.startDate).format('YYYY-MM-DD HH:mm:ss.000');
    const endDate = moment(body.endDate).format('YYYY-MM-DD HH:mm:ss.000');
    const db = body.mtType === 'mt4' ? this.mt4DatabaseName : this.mt5DatabaseName;
    const sql = `SELECT COUNT(*) as count FROM ${db}.mt4_sync_order as o ` +
      'WHERE o.Login = ? AND o.Open_Time >= ? AND o.Open_Time <= ?';
    const sqlParams = [tradeAccount, startDate, endDate];
    const data = await this.relationshipRepository.query(sql, sqlParams);
    return data;
  }

  async findLastOrderByLogin(query) {
    const { tradeAccount, createDate, mtName } = query;
    const db = this[`${mtName}DatabaseName`];
    const repository = this[`${mtName}ordersRepository`];
    const sql = `SELECT Open_Time from ${db}.mt4_sync_order where login = ? AND Open_Time > IFNULL(
      (SELECT MAX(Close_Time) FROM ${db}.mt4_sync_deposit WHERE login = ? AND Close_Time < DATE_ADD(?, INTERVAL 3 HOUR)),
      (SELECT MAX(Close_Time) FROM ${db}.mt4_sync_transfer_in WHERE login = ? AND Close_Time < DATE_ADD(?, INTERVAL 3 HOUR))
    ) LIMIT 1`;
    const sqlParams = [tradeAccount, tradeAccount, createDate, tradeAccount, createDate];
    const date = await repository.query(sql, sqlParams);
    console.log(date);
    if (date.length > 0) {
      if (moment(date[0].Open_Time).utcOffset(+5).valueOf() < moment(createDate).valueOf()) {
        return 'Y';
      }
    }
    return 'N';
  }

  async calculateWithdrawalCharge(query) {
    let charge = 0; // 最终手续费
    let mtTimezone = 0; // MT时区
    const chargeRatio = 0.05; // 手续费比例5%
    const { tradeAccount, country } = query;
    const amount = Number(query.amount);
    if (amount <= 100) {
      charge = 5;
    } else {
      const mtName = query.mtName.toLowerCase();
      const db = this[`${mtName}DatabaseName`];
      const repository = this[`${mtName}ordersRepository`];
      const findDepositSql = `SELECT Close_Time FROM ${db}.mt4_sync_deposit
       WHERE Login = ${tradeAccount} ORDER BY Close_Time DESC LIMIT 1`;
      const lastDepositData = await repository.query(findDepositSql);
      if (lastDepositData.length > 0) {
        const lastDepositTime = lastDepositData[0].Close_Time;
        const currentTime = moment().toDate();
        const mtTimezoneResult = await this.mtEventService.getMtTimezone();
        if (mtTimezoneResult.code === 1001 && mtTimezoneResult.data) {
          mtTimezone = mtTimezoneResult.data['timezone'];
        }
        const currentTimezone = parseInt(moment().format('ZZ')) / 100;
        console.log('currentTimezone:', currentTimezone);
        console.log('mtTimezone:', mtTimezone);
        console.log(lastDepositTime, currentTime);
        console.log(moment(lastDepositTime).format('YYYY-MM-DD HH:mm:ss'));
        console.log(moment(currentTime).format('YYYY-MM-DD HH:mm:ss'));
        const findOrderSql = `SELECT Open_Time FROM ${db}.mt4_sync_order
         WHERE Login = ${tradeAccount} AND
               Open_Time BETWEEN '${moment(lastDepositTime).format('YYYY-MM-DD HH:mm:ss')}'
                         AND '${moment(currentTime)
            .subtract(currentTimezone - mtTimezone, 'hours')
            .format('YYYY-MM-DD HH:mm:ss')}'
         ORDER BY Open_Time DESC LIMIT 1`;
        const orderData = await repository.query(findOrderSql);
        if (orderData.length > 0) {
          console.log('orderData:', orderData);
          charge = 0;
        } else {
          charge = amount * chargeRatio;
        }
      } else {
        charge = amount * chargeRatio;
      }
    }

    return (charge).toFixed(2);
  }

}
