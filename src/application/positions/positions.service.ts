import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mt4_sync_order } from '../../module/mt4/mt4_sync_order';
import { relationship } from '../../module/relationship/relationship';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../@nt';
import moment = require('moment');
import { SubPositionsDto } from './subPositions.dto';

@Injectable()
export class PositionsService {

  constructor(
    @InjectRepository(mt4_sync_order, 'mt5to4report')
    private mt5Repository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4report')
    private mt4Repository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt5to4report_demo')
    private mt5_demoRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4report_demo')
    private mt4_demoRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4_s02')
    private mt4_s02Repository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4_s03')
    private mt4_s03Repository: Repository<mt4_sync_order>,
    @InjectRepository(relationship, 'relationship')
    private relationshipRepository: Repository<relationship>,
    private readonly configService: ConfigService,
  ) { }

  readonly mt4DbName = this.configService.get('MT4_DB_NAME');
  readonly mt5DbName = this.configService.get('DB_NAME');
  readonly relationshipDbName = this.configService.get('RELATIONSHIP_DB_NAME');

  /**
   * @name 仓位总结
   * @author Ben.zhu 2020-03-17
   * @param {number} nodeId 主帳號 必填
   * @param {string} entity 牌照 必填
   * @param {Date} startDate date 查詢日期(起) 必填
   * @param {Date} endDate date 查詢日期(迄) 必填
   */
  async getOwnPositionData(nodeId: number, entity: string, startDate: Date, endDate: Date) {
    // 0.通过 主账号 去 relationship表 查询 该主账号的path和parent_id
    const sql0 = `SELECT path, parent_id
                  FROM ${this.relationshipDbName}.relationship
                  WHERE node_id = ${nodeId}`;
    let accountInfo = await this.relationshipRepository.query(sql0);
    accountInfo = JSON.parse(JSON.stringify(accountInfo))[0];
    // console.log('accountInfo：', accountInfo);
    const path = accountInfo.path;
    // console.log('path：', path);
    // 1.通过 主账号path 去 relationship表 查询 所有交易账号
    const sql1 = `SELECT node_id, trade_system
                  FROM ${this.relationshipDbName}.relationship
                  WHERE path LIKE '${path}/%' AND acc_type = 'TD'`;
    let allTradeAccounts = await this.relationshipRepository.query(sql1);
    allTradeAccounts = JSON.parse(JSON.stringify(allTradeAccounts));
    // 2.交易账号按 trade_system 分组
    const tradeAccountGroupByMt = {};
    for (const tradeAccount of allTradeAccounts) {
      const nodeId = Number(tradeAccount.node_id);
      if (!tradeAccountGroupByMt[tradeAccount.trade_system]) {
        tradeAccountGroupByMt[tradeAccount.trade_system] = [];
      }
      tradeAccountGroupByMt[tradeAccount.trade_system].push(nodeId);
    }
    // console.log('tradeAccountGroupByMt：', tradeAccountGroupByMt);
    // 3.查出各个 trade_system 的 入金deposit、出金withdrawal、转入transferIn、代理佣金rebate、订单order、交易账号users 资料
    const tableObj = { // 要进行查询的表名和对应的字段
      mt4_sync_deposit: "'' AS Volume, '' AS Commission, '' AS Commission_Agent, '' AS Swaps, Profit",
      mt4_sync_withdrawal: "'' AS Volume, '' AS Commission, '' AS Commission_Agent, '' AS Swaps, Profit",
      mt4_sync_transfer_in: "'' AS Volume, '' AS Commission, '' AS Commission_Agent, '' AS Swaps, Profit",
      mt4_sync_rebate: "'' AS Volume, '' AS Commission, '' AS Commission_Agent, '' AS Swaps, Profit",
      mt4_sync_order: 'Volume, Commission, Commission_Agent, Swaps, Profit',
    };
    let tradeAccountTradeCounts = []; // 交易账号 交易数据 统计
    let tradeAccountInfoCounts = []; // 交易账号 个人数据 统计
    for (const key in tradeAccountGroupByMt) {
      if (tradeAccountGroupByMt.hasOwnProperty(key)) {
        const tradeAccountArr = tradeAccountGroupByMt[key]; // 交易账号数组
        const tradeSystem = key.toLowerCase(); // trade_system
        // where
        let where = '1 = 1';
        // 日期
        if (startDate && endDate) {
          where += ` AND Close_Time >= '${moment(startDate).format('YYYY-MM-DD')}'
                     AND Close_Time < '${moment(endDate).add(1, 'day').format('YYYY-MM-DD')}'`;
        }
        // Login
        if (tradeAccountArr.length) {
          where += ` AND Login IN (${tradeAccountArr.join(',')})`;
        }
        // tableObj
        const subSql = [];
        for (const tableName in tableObj) {
          if (tableObj.hasOwnProperty(tableName)) {
            subSql.push(` ( SELECT ${tableObj[tableName]}, '${tableName}' AS Type
                            FROM ${tableName}
                            WHERE ${where} ) `);
          }
        }

        if (subSql.length && tradeSystem) {
          const sql = ` SELECT SUM(Volume) AS Volume, SUM(Commission) AS Commission,
                               SUM(Commission_Agent) AS Commission_Agent, SUM(Swaps) AS Swaps,
                               SUM(Profit) AS Profit, Type
                        FROM (${subSql.join('UNION ALL')}) AS subResult
                        GROUP BY Type`;
          let listResult = await this[`${tradeSystem}Repository`].query(sql);
          listResult = JSON.parse(JSON.stringify(listResult));
          tradeAccountTradeCounts = tradeAccountTradeCounts.concat(listResult);
        }

        // 通过 交易账号 去 users表 找到交易账户资料
        const sql9 = `SELECT LOGIN, SUM(BALANCE) AS BALANCE, CURRENCY, SUM(EQUITY) AS EQUITY
                      FROM mt4_users
                      WHERE LOGIN IN (${tradeAccountArr.join(',')})
                      GROUP BY CURRENCY`;
        let tradeAccountInfo = await this[`${tradeSystem}Repository`].query(sql9);
        tradeAccountInfo = JSON.parse(JSON.stringify(tradeAccountInfo));
        tradeAccountInfoCounts = tradeAccountInfoCounts.concat(tradeAccountInfo);
      }
    }
    // console.log('Own');
    // console.log('transactionRecord: ', tradeAccountTradeCounts);
    // console.log('tradeAccountsInfo：', tradeAccountInfoCounts);

    // 4.整合数据
    const tradeCountGroupByType = {}; // 不同交易类型的统计记录
    for (const transaction of tradeAccountTradeCounts) {
      if (!tradeCountGroupByType[transaction.Type]) {
        tradeCountGroupByType[transaction.Type] = [];
      }
      tradeCountGroupByType[transaction.Type].push(transaction);
    }
    // console.log(tradeCountGroupByType);
    // 入金
    let depositUSD = 0;
    if (tradeCountGroupByType['mt4_sync_deposit']) {
      const depositProfitArr = tradeCountGroupByType['mt4_sync_deposit'].map(x => x.Profit);
      depositUSD = depositProfitArr.reduce((acc, cur) => acc + cur, 0);
    }
    // 出金
    let withdrawalUSD = 0;
    if (tradeCountGroupByType['mt4_sync_withdrawal']) {
      const withdrawalProfitArr = tradeCountGroupByType['mt4_sync_withdrawal'].map(x => x.Profit);
      withdrawalUSD = withdrawalProfitArr.reduce((acc, cur) => acc + cur, 0);
    }
    // 净入金
    const netDepositUSD = depositUSD + withdrawalUSD;
    // 转入金
    let transferInUSD = 0;
    if (tradeCountGroupByType['mt4_sync_transfer_in']) {
      const transferInProfitArr = tradeCountGroupByType['mt4_sync_transfer_in'].map(x => x.Profit);
      transferInUSD = transferInProfitArr.reduce((acc, cur) => acc + cur, 0);
    }
    // 代理佣金
    let commissionAgentUSD = 0;
    if (tradeCountGroupByType['mt4_sync_rebate']) {
      const rebateProfitArr = tradeCountGroupByType['mt4_sync_rebate'].map(x => x.Profit);
      commissionAgentUSD = rebateProfitArr.reduce((acc, cur) => acc + cur, 0);
    }
    let volume = 0;
    let commissionUSD = 0;
    let swapsUSD = 0;
    let profitUSD = 0;
    if (tradeCountGroupByType['mt4_sync_order']) {
      // 交易量
      const orderVolumeArr = tradeCountGroupByType['mt4_sync_order'].map(x => x.Volume);
      volume = orderVolumeArr.reduce((acc, cur) => acc + cur, 0);
      // 佣金
      const orderCommissionArr = tradeCountGroupByType['mt4_sync_order'].map(x => x.Commission);
      commissionUSD = orderCommissionArr.reduce((acc, cur) => acc + cur, 0);
      // 利息
      const orderSwapsArr = tradeCountGroupByType['mt4_sync_order'].map(x => x.Swaps);
      swapsUSD = orderSwapsArr.reduce((acc, cur) => acc + cur, 0);
      // 盈亏
      const orderProfitArr = tradeCountGroupByType['mt4_sync_order'].map(x => x.Profit);
      profitUSD = orderProfitArr.reduce((acc, cur) => acc + cur, 0);
    }
    // 余额
    const balanceArr = tradeAccountInfoCounts.map(x => x.BALANCE);
    const balanceUSD = balanceArr.reduce((acc, cur) => acc + cur, 0);
    // 净值
    const equityArr = tradeAccountInfoCounts.map(x => x.EQUITY);
    const equityUSD = equityArr.reduce((acc, cur) => acc + cur, 0);

    // 返回值
    const data = [{
      node_id: nodeId, // 主账号
      parent_id: accountInfo.parent_id, // 上级帐号
      depositUSD, // 入金
      withdrawalUSD, // 出金
      netDepositUSD, // 净入金
      transferInUSD, // 转入金
      Volume: (volume / 100).toFixed(2), // 交易量
      commissionUSD, // 佣金
      commissionAgentUSD, // 代理佣金
      SwapsUSD: swapsUSD, // 利息
      profitUSD, // 盈亏
      balanceUSD, // 余额
      equityUSD, // 净值
    }];

    return data;
  }

  /**
   * @name 倉位總結資料
   * @author rex.hong 2019-12-16
   * @param {number} nodeId 主帳號 必填
   * @param {string} entity 牌照 必填
   * @param {Date} startDate date 查詢日期(起) 必填
   * @param {Date} endDate date 查詢日期(迄) 必填
   */
  async getOwnPositionDataOld(nodeId: number, entity: string, startDate: Date, endDate: Date) {
    let sqlCommand = `
    #刪除暫存表
    DROP TEMPORARY TABLE IF EXISTS \`temp_master\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_tradeAccount_mt4\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_tradeAccount_mt5\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_deposit\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_withdrawal\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_transferIn\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_rebate\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_order\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_users\`;

    #查詢參數
    SET @nodeId = ?;
    SET @entity = ?;
    SET @startDate = ?;
    SET @endDate = ?;
    SET @path = (SELECT path
        FROM ${this.relationshipDbName}.relationship
        WHERE node_id = @nodeId); `;

    sqlCommand += `
    #取得目前登入帳號下所有樹狀子節點的relationship資料,並新增至tempMaster
    CREATE TEMPORARY TABLE temp_master(
      SELECT m1.node_id,m1.parent_id,m1.path,m1.acc_type ,m1.node_id AS belongTo
      FROM ${this.relationshipDbName}.relationship as m1
      WHERE m1.node_id = @nodeId
    );

    #取得自己底下MT4所有交易帳號
    CREATE TEMPORARY TABLE temp_tradeAccount_mt4(
      SELECT @nodeId as belongTo, m1.*
      FROM ${this.relationshipDbName}.relationship AS m1
      WHERE m1.path LIKE CONCAT(@path,'/%') and m1.acc_type = 'TD' and trade_system = 'mt4');

    #取得自己底下MT5所有交易帳號
    CREATE TEMPORARY TABLE temp_tradeAccount_mt5(
    SELECT @nodeId as belongTo, m1.*
    FROM ${this.relationshipDbName}.relationship AS m1
    WHERE m1.path LIKE CONCAT(@path,'/%') and m1.acc_type = 'TD' and trade_system = 'mt5');

    #取得入金資料
    CREATE TEMPORARY TABLE temp_deposit
    (
      SELECT belongTo,sum(profit) as Profit
      FROM (
        SELECT tradeAccount.belongTo, deposit.profit
        FROM ${this.mt4DbName}.mt4_sync_deposit AS deposit
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON deposit.Login = tradeAccount.node_id
        WHERE deposit.Close_Time >= @startDate AND deposit.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, deposit.profit
        FROM ${this.mt5DbName}.mt4_sync_deposit AS deposit
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON deposit.Login = tradeAccount.node_id
        WHERE deposit.Close_Time >= @startDate AND deposit.Close_Time < @endDate
      ) AS result
      GROUP BY belongTo
    );
    #取得出金資料
    CREATE TEMPORARY TABLE temp_withdrawal
    (
      SELECT belongTo,sum(profit) as profit
      FROM (
        SELECT tradeAccount.belongTo, withdrawal.profit
        FROM ${this.mt4DbName}.mt4_sync_withdrawal AS withdrawal
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON withdrawal.Login = tradeAccount.node_id
        WHERE withdrawal.Close_Time >= @startDate AND withdrawal.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, withdrawal.profit
        FROM ${this.mt5DbName}.mt4_sync_withdrawal AS withdrawal
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON withdrawal.Login = tradeAccount.node_id
        WHERE withdrawal.Close_Time >= @startDate AND withdrawal.Close_Time < @endDate
      ) AS Result
      GROUP BY belongTo
    );
    #取得轉入金資料
    CREATE TEMPORARY TABLE temp_transferIn
    (
      SELECT belongTo,SUM(profit) AS profit
      FROM (
        SELECT tradeAccount.belongTo, transferIn.profit
        FROM ${this.mt4DbName}.mt4_sync_transfer_in AS transferIn
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON transferIn.Login = tradeAccount.node_id
        WHERE transferIn.Close_Time >= @startDate AND transferIn.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, transferIn.profit
        FROM ${this.mt5DbName}.mt4_sync_transfer_in AS transferIn
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON transferIn.Login = tradeAccount.node_id
        WHERE transferIn.Close_Time >= @startDate AND transferIn.Close_Time < @endDate
      ) AS Result
      GROUP BY belongTo
    );
    #取得代理傭金資料
    CREATE TEMPORARY TABLE temp_rebate
    (
      SELECT belongTo,SUM(profit) AS profit
      FROM (
        SELECT tradeAccount.belongTo, rebate.Profit
        FROM ${this.mt4DbName}.mt4_sync_rebate AS rebate
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON rebate.Login = tradeAccount.node_id
        WHERE rebate.Close_Time >= @startDate AND rebate.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, rebate.Profit
        FROM ${this.mt5DbName}.mt4_sync_rebate AS rebate
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON rebate.Login = tradeAccount.node_id
        WHERE rebate.Close_Time >= @startDate AND rebate.Close_Time < @endDate
      ) AS Result
      GROUP BY belongTo
    );
    #取得交易資料
    CREATE TEMPORARY TABLE temp_order
    (
      SELECT belongTo,SUM(volume) AS volume,SUM(Commission) AS Commission
        ,SUM(commission_Agent) as commission_Agent,SUM(Swaps) as Swaps
        ,SUM(profit) as profit
      FROM (
        SELECT tradeAccount.belongTo, orderData.volume,orderData.Commission
          ,orderData.commission_Agent,orderData.Swaps ,orderData.profit
        FROM ${this.mt4DbName}.mt4_sync_order AS orderData
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON orderData.Login = tradeAccount.node_id
        WHERE orderData.Close_Time >= @startDate AND orderData.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, orderData.volume,orderData.Commission
          ,orderData.commission_Agent,orderData.Swaps ,orderData.profit
        FROM ${this.mt5DbName}.mt4_sync_order AS orderData
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON orderData.Login = tradeAccount.node_id
        WHERE orderData.Close_Time >= @startDate AND orderData.Close_Time < @endDate
      ) AS Result
      GROUP BY belongTo
    );
    #取得交易帳戶資料
    CREATE TEMPORARY TABLE temp_users
    (
      SElECT belongTo,CURRENCY,SUM(BALANCE) AS BALANCE,SUM(EQUITY) AS EQUITY
      FROM (
        SELECT tradeAccount.belongTo,userData.BALANCE,userData.CURRENCY,userData.EQUITY
        FROM ${this.mt4DbName}.mt4_users AS userData
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON userData.Login = tradeAccount.node_id
        UNION ALL
        SELECT tradeAccount.belongTo,userData.BALANCE,userData.CURRENCY,userData.EQUITY
        FROM ${this.mt5DbName}.mt4_users AS userData
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON userData.Login = tradeAccount.node_id
      ) AS Result
      GROUP BY belongTo,CURRENCY
    );
    #整合資料
    SELECT main.belongTo as node_id,main.parent_id
      # 入金
      ,IFNULL(deposit.Profit,0) AS depositUSD
      # 出金
      ,IFNULL(withdrawal.Profit,0) AS withdrawalUSD
      # 淨入金
      ,IFNULL(deposit.Profit,0) + IFNULL(withdrawal.Profit,0) AS netDepositUSD
      # 轉入金
      ,IFNULL(transferIn.Profit,0) AS transferInUSD
      # 交易量
      ,format(IFNULL(orders.Volume,0) /100,2) AS Volume
      # 傭金
      ,IFNULL(orders.Commission,0) AS commissionUSD
      # 代理傭金
      ,IFNULL(rebate.Profit,0) AS commissionAgentUSD
      # 利息
      ,IFNULL(orders.Swaps,0) AS SwapsUSD
      # 盈亏
      ,IFNULL(orders.profit,0) AS profitUSD
      # 餘額
      ,IFNULL(users.balance,0) AS balanceUSD
      # 淨值
      ,IFNULL(users.EQUITY,0) AS equityUSD
    FROM temp_master AS main
      LEFT JOIN temp_deposit AS deposit ON main.belongTo = deposit.belongTo
      LEFT JOIN temp_withdrawal AS withdrawal ON main.belongTo = withdrawal.belongTo
      LEFT JOIN temp_transferIn AS transferIn ON main.belongTo = transferIn.belongTo
      LEFT JOIN temp_order AS orders ON main.belongTo = orders.belongTo
      LEFT JOIN temp_rebate AS rebate ON main.belongTo = rebate.belongTo
      LEFT JOIN temp_users AS users ON main.belongTo = users.belongTo`;

    const params = [
      nodeId,
      entity,
      moment(startDate).format('YYYY-MM-DD'),
      moment(endDate).add(1, 'day').format('YYYY-MM-DD'),
    ];

    const data = await this.relationshipRepository
      .query(sqlCommand, params) || [];
    return data[data.length - 1];
  }

  /**
   * @name 仓位总结资料IB代理/CL客戶
   * @author Ben.Zhu 2020-03-18
   * @param {number} accountNumber 主帳號 必填
   * @param {number} searchValue 主帳號或上級帳號
   * @param {string} accType CL/IB 必填
   * @param {string} entity 牌照 必填
   * @param {Date} startDate 查詢日期(起) 必填
   * @param {Date} endDate  查詢日期(迄) 必填
   * @param {string} sortKey 排序欄位 必填
   * @param {string} sortValue 排序值 DESC/ASC 必填
   * @param {number} pageIndex 分頁 必填
   * @param {number} pageSize 分頁數 必填
   */
  async getSubPositionData(query: SubPositionsDto) {
    const accountNumber = query.accountNumber;
    const searchValue = query.searchValue;
    const accType = query.accType;
    const entity = query.entity;
    const startDate = query.startDate;
    const endDate = query.endDate;
    const sortKey = query.sortKey;
    const sortValue = (query.sortValue).toUpperCase();
    const pageIndex = Number(query.pageIndex);
    const pageSize = Number(query.pageSize);

    // 0.通过 主账号 去 relationship表 查询 该主账号的path
    const sql0StartTime = moment().valueOf();
    const sql0 = `SELECT path
                  FROM ${this.relationshipDbName}.relationship
                  WHERE node_id = ${accountNumber}`;
    let accountInfo = await this.relationshipRepository.query(sql0);
    const sql0EndTime = moment().valueOf();
    console.log('sql0开始:', sql0StartTime);
    console.log('sql0结束:', sql0EndTime);
    console.log('sql0耗时:', sql0EndTime - sql0StartTime);
    accountInfo = JSON.parse(JSON.stringify(accountInfo))[0];
    const path = accountInfo.path;
    // console.log('path：', path);
    // 1.通过条件找到该代理下的所有TD和所属的主账号
    const sql1StartTime = moment().valueOf();
    let where1 = ` acc_type = 'TD' AND td_type = '${accType}'
                  AND entity = '${entity}' AND path LIKE '${path}/%'`;
    if (searchValue) {
      where1 += ` AND (node_id = ${searchValue} OR parent_id = ${searchValue})`;
    }
    const sql1 = `SELECT master_account_number AS belongTo, node_id, trade_system
                 FROM ${this.relationshipDbName}.relationship
                 WHERE ${where1}`;
    let allTradeAccounts = await this.relationshipRepository.query(sql1);
    const sql1EndTime = moment().valueOf();
    console.log('sql1开始:', sql1StartTime);
    console.log('sql1结束:', sql1EndTime);
    console.log('sql1耗时:', sql1EndTime - sql1StartTime);
    allTradeAccounts = JSON.parse(JSON.stringify(allTradeAccounts));
    console.log(1);
    console.log(11);
    console.log(111);
    console.log(allTradeAccounts);
    // 2.交易账号按 归属主账号belongTo 和 trade_system 分组
    let returnData = [];
    if (allTradeAccounts.length) {
      const tradeAccountGroupByBelong = {};
      const tradeAccountGroupByMt = {};
      for (const tradeAccount of allTradeAccounts) {
        const belongTo = Number(tradeAccount.belongTo);
        const nodeId = Number(tradeAccount.node_id);
        if (!tradeAccountGroupByBelong[belongTo]) {
          tradeAccountGroupByBelong[belongTo] = [];
        }
        tradeAccountGroupByBelong[belongTo].push(nodeId);

        if (!tradeAccountGroupByMt[tradeAccount.trade_system]) {
          tradeAccountGroupByMt[tradeAccount.trade_system] = [];
        }
        tradeAccountGroupByMt[tradeAccount.trade_system].push(nodeId);
      }
      console.log(222);
      console.log(tradeAccountGroupByBelong);
      console.log(333);
      console.log(tradeAccountGroupByMt);
      // 3.通过归属主账号找到parent_id
      const sql2StartTime = moment().valueOf();
      const belongToIdArr = Object.keys(tradeAccountGroupByBelong);
      const sql2 = `SELECT node_id, parent_id
                    FROM ${this.relationshipDbName}.relationship
                    WHERE node_id IN (${belongToIdArr.join(',')})`;
      let parentIds = await this.relationshipRepository.query(sql2);
      const sql2EndTime = moment().valueOf();
      console.log('sql2开始:', sql2StartTime);
      console.log('sql2结束:', sql2EndTime);
      console.log('sql2耗时:', sql2EndTime - sql2StartTime);
      parentIds = JSON.parse(JSON.stringify(parentIds));
      const parentIdObj = {};
      for (const parentId of parentIds) {
        parentIdObj[parentId.node_id] = parentId.parent_id;
      }
      console.log('parentIdObj:', parentIdObj);
      // console.log('tradeAccountGroupByMt：', tradeAccountGroupByMt);
      // 4.查出各个 trade_system 的 入金deposit、出金withdrawal、转入transferIn、代理佣金rebate、订单order、交易账号users 资料
      const tableObj = { // 要进行查询的表名和对应的字段
        mt4_sync_deposit: "'' AS Volume, '' AS Commission, '' AS Commission_Agent, '' AS Swaps, Profit, Login",
        mt4_sync_withdrawal: "'' AS Volume, '' AS Commission, '' AS Commission_Agent, '' AS Swaps, Profit, Login",
        mt4_sync_transfer_in: "'' AS Volume, '' AS Commission, '' AS Commission_Agent, '' AS Swaps, Profit, Login",
        mt4_sync_rebate: "'' AS Volume, '' AS Commission, '' AS Commission_Agent, '' AS Swaps, Profit, Login",
        mt4_sync_order: 'Volume, Commission, Commission_Agent, Swaps, Profit, Login',
      };
      let tradeAccountTradeCounts = []; // 交易账号 交易数据 统计
      let tradeAccountInfoCounts = []; // 交易账号 个人数据 统计
      const sql3StartTime = moment().valueOf();
      for (const key in tradeAccountGroupByMt) {
        if (tradeAccountGroupByMt.hasOwnProperty(key)) {
          const tradeAccountArr = tradeAccountGroupByMt[key]; // 交易账号数组
          const tradeSystem = key.toLowerCase(); // trade_system
          // where
          let where = '1 = 1';
          // 日期
          if (startDate && endDate) {
            where += ` AND Close_Time >= '${moment(startDate).format('YYYY-MM-DD')}'
                      AND Close_Time < '${moment(endDate).add(1, 'day').format('YYYY-MM-DD')}'`;
          }
          // Login
          if (tradeAccountArr.length) {
            where += ` AND Login IN (${tradeAccountArr.join(',')})`;
          }
          // tableObj
          const subSql = [];
          for (const tableName in tableObj) {
            if (tableObj.hasOwnProperty(tableName)) {
              subSql.push(` ( SELECT ${tableObj[tableName]}, '${tableName}' AS Type
                              FROM ${tableName}
                              WHERE ${where} ) `);
            }
          }

          if (subSql.length && tradeSystem) {
            const sql3 = ` SELECT SUM(Volume) AS Volume, SUM(Commission) AS Commission,
                                SUM(Commission_Agent) AS Commission_Agent, SUM(Swaps) AS Swaps,
                                SUM(Profit) AS Profit, Type, Login
                          FROM (${subSql.join('UNION ALL')}) AS subResult
                          GROUP BY Login, Type`;
            let listResult = await this[`${tradeSystem}Repository`].query(sql3);
            listResult = JSON.parse(JSON.stringify(listResult));
            tradeAccountTradeCounts = tradeAccountTradeCounts.concat(listResult);
          }

          // 通过 交易账号 去 users表 找到交易账户资料
          const sql4 = `SELECT LOGIN, BALANCE, CURRENCY, EQUITY
                        FROM mt4_users
                        WHERE LOGIN IN (${tradeAccountArr.join(',')})`;
          let tradeAccountInfo = await this[`${tradeSystem}Repository`].query(sql4);
          tradeAccountInfo = JSON.parse(JSON.stringify(tradeAccountInfo));
          tradeAccountInfoCounts = tradeAccountInfoCounts.concat(tradeAccountInfo);
        }
      }
      const sql3EndTime = moment().valueOf();
      console.log('sql3开始:', sql3StartTime);
      console.log('sql3结束:', sql3EndTime);
      console.log('sql3耗时:', sql3EndTime - sql3StartTime);
      console.log('Sub');
      console.log('tradeAccountTradeCounts: ', tradeAccountTradeCounts);
      console.log('tradeAccountInfoCounts：', tradeAccountInfoCounts);
      // 5.整合数据
      const sql4StartTime = moment().valueOf();
      for (const belongTo in tradeAccountGroupByBelong) {
        if (tradeAccountGroupByBelong.hasOwnProperty(belongTo)) {
          const loginArr = tradeAccountGroupByBelong[belongTo];
          const doneParentIdArr = returnData.map(x => x.node_id); // 已统计完成的数据列表中的主账号
          if (!doneParentIdArr.includes(belongTo)) { // 如果没有此归属账号,开始组装数据
            // 交易账号 交易数据 统计
            let depositUSD = 0; // 入金
            let withdrawalUSD = 0; // 出金
            let netDepositUSD = 0; // 净入金
            let transferInUSD = 0; // 转入金
            let volume = 0; // 交易量
            let commissionUSD = 0; // 佣金
            let commissionAgentUSD = 0; // 代理佣金
            let swapsUSD = 0; // 利息
            let profitUSD = 0; // 盈亏
            const tempTATC = [];
            for (const tATC of tradeAccountTradeCounts) {
              const tATCLogin = Number(tATC.Login);
              if (loginArr.includes(tATCLogin)) {
                tempTATC.push(tATC);
              }
            }
            if (tempTATC.length) {
              const tradeCountGroupByType = {}; // 不同交易类型的统计记录
              for (const tradeCount of tempTATC) {
                if (!tradeCountGroupByType[tradeCount.Type]) {
                  tradeCountGroupByType[tradeCount.Type] = [];
                }
                tradeCountGroupByType[tradeCount.Type].push(tradeCount);
              }
              // 入金
              if (tradeCountGroupByType['mt4_sync_deposit']) {
                const depositProfitArr = tradeCountGroupByType['mt4_sync_deposit'].map(x => x.Profit);
                depositUSD = depositProfitArr.reduce((acc, cur) => acc + cur, 0);
              }
              // 出金
              if (tradeCountGroupByType['mt4_sync_withdrawal']) {
                const withdrawalProfitArr = tradeCountGroupByType['mt4_sync_withdrawal'].map(x => x.Profit);
                withdrawalUSD = withdrawalProfitArr.reduce((acc, cur) => acc + cur, 0);
              }
              // 净入金
              netDepositUSD = depositUSD + withdrawalUSD;
              // 转入金
              if (tradeCountGroupByType['mt4_sync_transfer_in']) {
                const transferInProfitArr = tradeCountGroupByType['mt4_sync_transfer_in'].map(x => x.Profit);
                transferInUSD = transferInProfitArr.reduce((acc, cur) => acc + cur, 0);
              }
              // 代理佣金
              if (tradeCountGroupByType['mt4_sync_rebate']) {
                const rebateProfitArr = tradeCountGroupByType['mt4_sync_rebate'].map(x => x.Profit);
                commissionAgentUSD = rebateProfitArr.reduce((acc, cur) => acc + cur, 0);
              }
              if (tradeCountGroupByType['mt4_sync_order']) {
                // 交易量
                const orderVolumeArr = tradeCountGroupByType['mt4_sync_order'].map(x => x.Volume);
                volume = orderVolumeArr.reduce((acc, cur) => acc + cur, 0);
                // 佣金
                const orderCommissionArr = tradeCountGroupByType['mt4_sync_order'].map(x => x.Commission);
                commissionUSD = orderCommissionArr.reduce((acc, cur) => acc + cur, 0);
                // 利息
                const orderSwapsArr = tradeCountGroupByType['mt4_sync_order'].map(x => x.Swaps);
                swapsUSD = orderSwapsArr.reduce((acc, cur) => acc + cur, 0);
                // 盈亏
                const orderProfitArr = tradeCountGroupByType['mt4_sync_order'].map(x => x.Profit);
                profitUSD = orderProfitArr.reduce((acc, cur) => acc + cur, 0);
              }
            }
            // 交易账号 个人数据 统计
            let balanceUSD = 0; // 余额
            let equityUSD = 0; // 净值
            const tempTAIC = [];
            for (const tAIC of tradeAccountInfoCounts) {
              const tAICLogin = Number(tAIC.LOGIN);
              if (loginArr.includes(tAICLogin)) {
                tempTAIC.push(tAIC);
              }
            }
            if (tempTAIC.length) {
              // 余额
              const userBalanceArr = tempTAIC.map(x => x.BALANCE);
              balanceUSD = userBalanceArr.reduce((acc, cur) => acc + cur, 0);
              // 净值
              const userEquityArr = tempTAIC.map(x => x.EQUITY);
              equityUSD = userEquityArr.reduce((acc, cur) => acc + cur, 0);
            }
            const tempData = {
              parent_id: parentIdObj[belongTo], // 上级主账号
              node_id: belongTo, // 本级主账号
              depositUSD,
              withdrawalUSD,
              netDepositUSD,
              transferInUSD,
              Volume: (volume / 100).toFixed(2),
              commissionUSD,
              commissionAgentUSD,
              SwapsUSD: swapsUSD,
              profitUSD,
              balanceUSD,
              equityUSD,
            };
            returnData.push(tempData);
          }
        }
      }
      const sql4EndTime = moment().valueOf();
      console.log('数据整合开始:', sql4StartTime);
      console.log('数据整合结束:', sql4EndTime);
      console.log('数据整合耗时:', sql4EndTime - sql4StartTime);
    }
    const totalCount = returnData.length;
    // 根据sortKey字段对[{}, {}]进行排序
    if (sortValue === 'DESC') {
      returnData = returnData.sort(function (a, b) {
        return (b[sortKey] - a[sortKey]);
      });
    } else if (sortValue === 'ASC') {
      returnData = returnData.sort(function (a, b) {
        return (a[sortKey] - b[sortKey]);
      });
    }
    // 根据pageIndex、pageSize，利用slice()手动分页
    returnData = returnData.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
    return { data: returnData, totalCount };
  }

  /**
   * @name 倉位總結資料IB代理/CL客戶
   * @author rex.hong 2019-12-16
   * @param {number} nodeId 主帳號 必填
   * @param {number} searchValue 主帳號或上級帳號
   * @param {string} accType CL/IB 必填
   * @param {string} entity 牌照 必填
   * @param {Date} startDate 查詢日期(起) 必填
   * @param {Date} endDate  查詢日期(迄) 必填
   * @param {string} sortKey 排序欄位 必填
   * @param {string} sortValue 排序值 DESC/ASC 必填
   * @param {number} pageIndex 分頁 必填
   * @param {number} pageSize 分頁數 必填
   */
  async getSubPositionDataOld(query: SubPositionsDto) {
    let sqlCommand = `
      #刪除暫存表
      DROP TEMPORARY TABLE IF EXISTS \`temp_master\`;
      DROP TEMPORARY TABLE IF EXISTS \`temp_tradeAccount_mt4\`;
      DROP TEMPORARY TABLE IF EXISTS \`temp_tradeAccount_mt5\`;
      DROP TEMPORARY TABLE IF EXISTS \`temp_deposit\`;
      DROP TEMPORARY TABLE IF EXISTS \`temp_withdrawal\`;
      DROP TEMPORARY TABLE IF EXISTS \`temp_transferIn\`;
      DROP TEMPORARY TABLE IF EXISTS \`temp_rebate\`;
      DROP TEMPORARY TABLE IF EXISTS \`temp_order\`;
      DROP TEMPORARY TABLE IF EXISTS \`temp_users\`;

      #查詢參數
      SET @nodeId = ?;
      SET @entity = ?;
      SET @accType = ?;
      SET @searchValue = ?;
      SET @startDate = ?;
      SET @endDate = ?;
      SET @path = (SELECT path
          FROM ${this.relationshipDbName}.relationship
          WHERE node_id = @nodeId); `;

    let where = '';
    if (query.searchValue) {
      where += ' AND (m1.node_id = @searchValue OR m1.parent_id = @searchValue) ';
    }

    sqlCommand += `
    #取得目前登入帳號下所有樹狀子節點的relationship資料,並新增至tempMaster
    CREATE TEMPORARY TABLE temp_master(
      SELECT m1.node_id,m1.parent_id,m1.path,m1.acc_type ,m1.node_id AS belongTo
      FROM ${this.relationshipDbName}.relationship as m1
      WHERE acc_Type = @accType and path LIKE CONCAT(@path,'/%')
      ${where}
    );

    #取得自己底下MT4所有交易帳號
    CREATE TEMPORARY TABLE temp_tradeAccount_mt4(
      SELECT temp_master.belongTo, m1.*
      FROM ${this.relationshipDbName}.relationship AS m1
      INNER JOIN temp_master ON m1.path LIKE CONCAT(temp_master.path ,'/%')
      WHERE m1.acc_type = 'TD' and m1.trade_system = 'mt4' AND m1.entity = @entity
    );
    #取得自己底下MT5所有交易帳號
	  CREATE TEMPORARY TABLE temp_tradeAccount_mt5(
      SELECT temp_master.belongTo, m1.*
      FROM ${this.relationshipDbName}.relationship AS m1
      INNER JOIN temp_master ON m1.path LIKE CONCAT(temp_master.path ,'/%')
      WHERE m1.acc_type = 'TD' and m1.trade_system = 'mt5' AND m1.entity = @entity
    );

    #取得入金資料
    CREATE TEMPORARY TABLE temp_deposit
    (
      SELECT belongTo,sum(profit) as Profit
      FROM (
        SELECT tradeAccount.belongTo, deposit.profit
        FROM ${this.mt4DbName}.mt4_sync_deposit AS deposit
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON deposit.Login = tradeAccount.node_id
        WHERE deposit.Close_Time >= @startDate AND deposit.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, deposit.profit
        FROM ${this.mt5DbName}.mt4_sync_deposit AS deposit
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON deposit.Login = tradeAccount.node_id
        WHERE deposit.Close_Time >= @startDate AND deposit.Close_Time < @endDate
      ) AS result
      GROUP BY belongTo
    );
    #取得出金資料
    CREATE TEMPORARY TABLE temp_withdrawal
    (
      SELECT belongTo,sum(profit) as profit
      FROM (
        SELECT tradeAccount.belongTo, withdrawal.profit
        FROM ${this.mt4DbName}.mt4_sync_withdrawal AS withdrawal
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON withdrawal.Login = tradeAccount.node_id
        WHERE withdrawal.Close_Time >= @startDate AND withdrawal.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, withdrawal.profit
        FROM ${this.mt5DbName}.mt4_sync_withdrawal AS withdrawal
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON withdrawal.Login = tradeAccount.node_id
        WHERE withdrawal.Close_Time >= @startDate AND withdrawal.Close_Time < @endDate
      ) AS Result
      GROUP BY belongTo
    );
    #取得轉入金資料
    CREATE TEMPORARY TABLE temp_transferIn
    (
      SELECT belongTo,SUM(profit) AS profit
      FROM (
        SELECT tradeAccount.belongTo, transferIn.profit
        FROM ${this.mt4DbName}.mt4_sync_transfer_in AS transferIn
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON transferIn.Login = tradeAccount.node_id
        WHERE transferIn.Close_Time >= @startDate AND transferIn.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, transferIn.profit
        FROM ${this.mt5DbName}.mt4_sync_transfer_in AS transferIn
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON transferIn.Login = tradeAccount.node_id
        WHERE transferIn.Close_Time >= @startDate AND transferIn.Close_Time < @endDate
      ) AS Result
      GROUP BY belongTo
    );
    #取得代理傭金資料
    CREATE TEMPORARY TABLE temp_rebate
    (
      SELECT belongTo,SUM(profit) AS profit
      FROM (
        SELECT tradeAccount.belongTo, rebate.Profit
        FROM ${this.mt4DbName}.mt4_sync_rebate AS rebate
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON rebate.Login = tradeAccount.node_id
        WHERE rebate.Close_Time >= @startDate AND rebate.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, rebate.Profit
        FROM ${this.mt5DbName}.mt4_sync_rebate AS rebate
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON rebate.Login = tradeAccount.node_id
        WHERE rebate.Close_Time >= @startDate AND rebate.Close_Time < @endDate
      ) AS Result
      GROUP BY belongTo
    );
    #取得交易資料
    CREATE TEMPORARY TABLE temp_order
    (
      SELECT belongTo,SUM(volume) AS volume,SUM(Commission) AS Commission
        ,SUM(commission_Agent) as commission_Agent,SUM(Swaps) as Swaps
        ,SUM(profit) as profit
      FROM (
        SELECT tradeAccount.belongTo, orderData.volume,orderData.Commission
          ,orderData.commission_Agent,orderData.Swaps ,orderData.profit
        FROM ${this.mt4DbName}.mt4_sync_order AS orderData
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON orderData.Login = tradeAccount.node_id
        WHERE orderData.Close_Time >= @startDate AND orderData.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, orderData.volume,orderData.Commission
          ,orderData.commission_Agent,orderData.Swaps ,orderData.profit
        FROM ${this.mt5DbName}.mt4_sync_order AS orderData
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON orderData.Login = tradeAccount.node_id
        WHERE orderData.Close_Time >= @startDate AND orderData.Close_Time < @endDate
      ) AS Result
      GROUP BY belongTo
    );
    #取得交易帳戶資料
    CREATE TEMPORARY TABLE temp_users
    (
      SELECT belongTo,CURRENCY,SUM(BALANCE) AS BALANCE,SUM(EQUITY) AS EQUITY
      FROM (
        SELECT tradeAccount.belongTo,userData.BALANCE,userData.CURRENCY,userData.EQUITY
        FROM ${this.mt4DbName}.mt4_users AS userData
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON userData.Login = tradeAccount.node_id
        UNION ALL
        SELECT tradeAccount.belongTo,userData.BALANCE,userData.CURRENCY,userData.EQUITY
        FROM ${this.mt5DbName}.mt4_users AS userData
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON userData.Login = tradeAccount.node_id
      ) AS Result
      GROUP BY belongTo,CURRENCY
    );
    #整合資料
    SELECT * FROM (
      SELECT main.belongTo as node_id,main.parent_id
        # 入金
        ,IFNULL(deposit.Profit,0)  AS depositUSD
        # 出金
        ,IFNULL(withdrawal.Profit,0) AS withdrawalUSD
        # 淨入金
        ,IFNULL(deposit.Profit,0) + IFNULL(withdrawal.Profit,0) AS netDepositUSD
        # 轉入金
        ,IFNULL(transferIn.Profit,0) AS transferInUSD
        # 交易量
        ,format(IFNULL(orders.Volume,0) /100,2) AS Volume
        # 傭金
        ,IFNULL(orders.Commission,0) AS commissionUSD
        # 代理傭金
        ,IFNULL(rebate.Profit,0) AS commissionAgentUSD
        # 利息
        ,IFNULL(orders.Swaps,0) AS SwapsUSD
        # 盈亏
        ,IFNULL(orders.profit,0) AS profitUSD
        # 餘額
        ,IFNULL(users.balance,0) AS balanceUSD
        # 淨值
        ,IFNULL(users.EQUITY,0) AS equityUSD
      FROM temp_master AS main
        LEFT JOIN temp_deposit AS deposit ON main.belongTo = deposit.belongTo
        LEFT JOIN temp_withdrawal AS withdrawal ON main.belongTo = withdrawal.belongTo
        LEFT JOIN temp_transferIn AS transferIn ON main.belongTo = transferIn.belongTo
        LEFT JOIN temp_order AS orders ON main.belongTo = orders.belongTo
        LEFT JOIN temp_rebate AS rebate ON main.belongTo = rebate.belongTo
        LEFT JOIN temp_users AS users ON main.belongTo = users.belongTo
      ) AS result
      ORDER BY ${query.sortKey} ${query.sortValue}
      LIMIT ${query.pageSize}
      OFFSET ${query.pageIndex * query.pageSize} ;

      SELECT count(*) AS totalCount FROM temp_master; `;

    const sqlParams = [
      query.accountNumber,
      query.entity,
      query.accType,
      query.searchValue || '',
      moment(query.startDate).format('YYYY-MM-DD'),
      moment(query.endDate).add(1, 'day').format('YYYY-MM-DD'),
    ];

    const result = await this.relationshipRepository.query(sqlCommand, sqlParams);
    const data = result[result.length - 2];
    const totalCount: number = parseInt(result[result.length - 1][0]['totalCount'], 10) || 0;

    return { data, totalCount };
  }

  /**
   * 仓位总结交易账号明细
   * @param {number} nodeId 主账号
   * @param {string} entity 牌照
   * @param {Date} startDate 查詢日期(起)
   * @param {Date} endDate 查詢日期(迄)
   */
  async getTradeAccountPositionData(nodeId: number, entity: string, startDate: Date, endDate: Date) {
    // 1.通过 master_account_number 去 relationship表 查询 所有交易账号
    const sql1 = `SELECT node_id, trade_system
                  FROM ${this.relationshipDbName}.relationship
                  WHERE master_account_number='${nodeId}' AND acc_type='TD' AND entity='${entity}'`;
    let allTradeAccounts = await this.relationshipRepository.query(sql1);
    allTradeAccounts = JSON.parse(JSON.stringify(allTradeAccounts));
    // 2.交易账号按 trade_system 分组
    const tradeAccountGroupByMt = {};
    for (const tradeAccount of allTradeAccounts) {
      const nodeId = Number(tradeAccount.node_id);
      if (!tradeAccountGroupByMt[tradeAccount.trade_system]) {
        tradeAccountGroupByMt[tradeAccount.trade_system] = [];
      }
      tradeAccountGroupByMt[tradeAccount.trade_system].push(nodeId);
    }
    // console.log('tradeAccountGroupByMt：', tradeAccountGroupByMt);
    // 4.查出各个 trade_system 的 入金deposit、出金withdrawal、转入transferIn、代理佣金rebate、订单order、交易账号users 资料
    const tableObj = { // 要进行查询的表名和对应的字段
      mt4_sync_deposit: "'' AS Volume, '' AS Commission, '' AS Commission_Agent, '' AS Swaps, Profit, Login",
      mt4_sync_withdrawal: "'' AS Volume, '' AS Commission, '' AS Commission_Agent, '' AS Swaps, Profit, Login",
      mt4_sync_transfer_in: "'' AS Volume, '' AS Commission, '' AS Commission_Agent, '' AS Swaps, Profit, Login",
      mt4_sync_rebate: "'' AS Volume, '' AS Commission, '' AS Commission_Agent, '' AS Swaps, Profit, Login",
      mt4_sync_order: 'Volume, Commission, Commission_Agent, Swaps, Profit, Login',
    };
    let tradeAccountTradeCounts = []; // 交易账号 交易数据 统计
    let tradeAccountInfoCounts = []; // 交易账号 个人数据 统计
    for (const key in tradeAccountGroupByMt) {
      if (tradeAccountGroupByMt.hasOwnProperty(key)) {
        const tradeAccountArr = tradeAccountGroupByMt[key]; // 交易账号数组
        const tradeSystem = key.toLowerCase(); // trade_system
        // where
        let where = '1 = 1';
        // 日期
        if (startDate && endDate) {
          where += ` AND Close_Time >= '${moment(startDate).format('YYYY-MM-DD')}'
                     AND Close_Time < '${moment(endDate).add(1, 'day').format('YYYY-MM-DD')}'`;
        }
        // Login
        if (tradeAccountArr.length) {
          where += ` AND Login IN (${tradeAccountArr.join(',')})`;
        }
        // tableObj
        const subSql = [];
        for (const tableName in tableObj) {
          if (tableObj.hasOwnProperty(tableName)) {
            subSql.push(` ( SELECT ${tableObj[tableName]}, '${tableName}' AS Type
                            FROM ${tableName}
                            WHERE ${where} ) `);
          }
        }

        if (subSql.length && tradeSystem) {
          const sql = ` SELECT SUM(Volume) AS Volume, SUM(Commission) AS Commission,
                               SUM(Commission_Agent) AS Commission_Agent, SUM(Swaps) AS Swaps,
                               SUM(Profit) AS Profit, Type, Login
                        FROM (${subSql.join('UNION ALL')}) AS subResult
                        GROUP BY Login, Type`;
          let listResult = await this[`${tradeSystem}Repository`].query(sql);
          listResult = JSON.parse(JSON.stringify(listResult));
          tradeAccountTradeCounts = tradeAccountTradeCounts.concat(listResult);
        }

        // 通过 交易账号 去 users表 找到交易账户资料
        const sql9 = `SELECT LOGIN, BALANCE, CURRENCY, EQUITY
                      FROM mt4_users
                      WHERE LOGIN IN (${tradeAccountArr.join(',')})`;
        let tradeAccountInfo = await this[`${tradeSystem}Repository`].query(sql9);
        tradeAccountInfo = JSON.parse(JSON.stringify(tradeAccountInfo));
        tradeAccountInfoCounts = tradeAccountInfoCounts.concat(tradeAccountInfo);
      }
    }
    // console.log('TradeAccount');
    // console.log('tradeAccountTradeCounts: ', tradeAccountTradeCounts);
    // console.log('tradeAccountInfoCounts：', tradeAccountInfoCounts);

    // 5.整合数据
    const returnData = [];
    for (const tradeAccount of allTradeAccounts) {
      const login = Number(tradeAccount.node_id); // 交易账号
      const tradeSystem = tradeAccount.trade_system; // trade_system
      const doneLoginArr = returnData.map(x => x.node_id); // 已统计完成的数据列表中的交易账号
      if (!doneLoginArr.includes(login)) { // 如果没有此交易账号,开始组装数据
        // 交易账号 交易数据 统计
        let depositUSD = 0; // 入金
        let withdrawalUSD = 0; // 出金
        let netDepositUSD = 0; // 净入金
        let transferInUSD = 0; // 转入金
        let volume = 0; // 交易量
        let commissionUSD = 0; // 佣金
        let commissionAgentUSD = 0; // 代理佣金
        let swapsUSD = 0; // 利息
        let profitUSD = 0; // 盈亏
        const tempTATC = [];
        for (const tATC of tradeAccountTradeCounts) {
          const tATCLogin = Number(tATC.Login);
          if (tATCLogin === login) {
            tempTATC.push(tATC);
          }
        }
        if (tempTATC.length) {
          const tradeCountGroupByType = {}; // 不同交易类型的统计记录
          for (const tradeCount of tempTATC) {
            if (!tradeCountGroupByType[tradeCount.Type]) {
              tradeCountGroupByType[tradeCount.Type] = [];
            }
            tradeCountGroupByType[tradeCount.Type].push(tradeCount);
          }
          // 入金
          if (tradeCountGroupByType['mt4_sync_deposit']) {
            const depositProfitArr = tradeCountGroupByType['mt4_sync_deposit'].map(x => x.Profit);
            depositUSD = depositProfitArr.reduce((acc, cur) => acc + cur, 0);
          }
          // 出金
          if (tradeCountGroupByType['mt4_sync_withdrawal']) {
            const withdrawalProfitArr = tradeCountGroupByType['mt4_sync_withdrawal'].map(x => x.Profit);
            withdrawalUSD = withdrawalProfitArr.reduce((acc, cur) => acc + cur, 0);
          }
          // 净入金
          netDepositUSD = depositUSD + withdrawalUSD;
          // 转入金
          if (tradeCountGroupByType['mt4_sync_transfer_in']) {
            const transferInProfitArr = tradeCountGroupByType['mt4_sync_transfer_in'].map(x => x.Profit);
            transferInUSD = transferInProfitArr.reduce((acc, cur) => acc + cur, 0);
          }
          // 代理佣金
          if (tradeCountGroupByType['mt4_sync_rebate']) {
            const rebateProfitArr = tradeCountGroupByType['mt4_sync_rebate'].map(x => x.Profit);
            commissionAgentUSD = rebateProfitArr.reduce((acc, cur) => acc + cur, 0);
          }
          if (tradeCountGroupByType['mt4_sync_order']) {
            // 交易量
            const orderVolumeArr = tradeCountGroupByType['mt4_sync_order'].map(x => x.Volume);
            volume = orderVolumeArr.reduce((acc, cur) => acc + cur, 0);
            // 佣金
            const orderCommissionArr = tradeCountGroupByType['mt4_sync_order'].map(x => x.Commission);
            commissionUSD = orderCommissionArr.reduce((acc, cur) => acc + cur, 0);
            // 利息
            const orderSwapsArr = tradeCountGroupByType['mt4_sync_order'].map(x => x.Swaps);
            swapsUSD = orderSwapsArr.reduce((acc, cur) => acc + cur, 0);
            // 盈亏
            const orderProfitArr = tradeCountGroupByType['mt4_sync_order'].map(x => x.Profit);
            profitUSD = orderProfitArr.reduce((acc, cur) => acc + cur, 0);
          }
        }
        // 交易账号 个人数据 统计
        let balanceUSD = 0; // 余额
        let equityUSD = 0; // 净值
        let currency = ''; // 币种
        let tempTAIC: any = '';
        for (const tAIC of tradeAccountInfoCounts) {
          const tAICLogin = Number(tAIC.LOGIN);
          if (tAICLogin === login) {
            tempTAIC = tAIC;
          }
        }
        if (tempTAIC) {
          // 余额
          balanceUSD = tempTAIC.BALANCE;
          // 净值
          equityUSD = tempTAIC.EQUITY;
          // 币种
          currency = tempTAIC.CURRENCY;
        }

        const tempData = {
          parent_id: nodeId, // 主账号
          node_id: login, // 交易账号
          depositUSD,
          withdrawalUSD,
          netDepositUSD,
          transferInUSD,
          Volume: (volume / 100).toFixed(2),
          commissionUSD,
          commissionAgentUSD,
          SwapsUSD: swapsUSD,
          profitUSD,
          balanceUSD,
          equityUSD,
          CURRENCY: currency,
          trade_system: tradeSystem,
        };
        returnData.push(tempData);
      }
    }

    return returnData;
  }

  /**
   * 倉位總結交易帳號明細
   * @param {number} nodeId 主帳號
   * @param {string} entity 牌照
   * @param {Date} startDate 查詢日期(起)
   * @param {Date} endDate 查詢日期(迄)
   */
  async getTradeAccountPositionDataOld(nodeId: number, entity: string, startDate: Date, endDate: Date) {
    let sqlCommand = `
    #刪除暫存表
    DROP TEMPORARY TABLE IF EXISTS \`temp_master\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_tradeAccount_mt4\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_tradeAccount_mt5\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_deposit\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_withdrawal\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_transferIn\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_rebate\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_order\`;
    DROP TEMPORARY TABLE IF EXISTS \`temp_users\`;

    #查詢參數
    SET @nodeId = ?;
    SET @entity = ?;
    SET @startDate = ?;
    SET @endDate = ?;`;

    sqlCommand += `
    #取得目前登入帳號下所有樹狀子節點的relationship資料,並新增至tempMaster
    CREATE TEMPORARY TABLE temp_master(
      SELECT m1.node_id as belongTo, m1.*
      FROM ${this.relationshipDbName}.relationship AS m1
      WHERE master_account_number = @nodeId
        and m1.acc_type = 'TD'
        and trade_system in ('mt4','mt5')
    );
    #取得自己底下MT4所有交易帳號
    CREATE TEMPORARY TABLE temp_tradeAccount_mt4(
      SELECT * FROM temp_master WHERE trade_system = 'mt4'
    );

    #取得自己底下MT5所有交易帳號
    CREATE TEMPORARY TABLE temp_tradeAccount_mt5(
      SELECT * FROM temp_master WHERE trade_system = 'mt5'
    );

    #取得入金資料
    CREATE TEMPORARY TABLE temp_deposit
    (
      SELECT belongTo,sum(profit) as Profit
      FROM (
        SELECT tradeAccount.belongTo, deposit.profit
        FROM ${this.mt4DbName}.mt4_sync_deposit AS deposit
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON deposit.Login = tradeAccount.node_id
        WHERE deposit.Close_Time >= @startDate AND deposit.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, deposit.profit
        FROM ${this.mt5DbName}.mt4_sync_deposit AS deposit
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON deposit.Login = tradeAccount.node_id
        WHERE deposit.Close_Time >= @startDate AND deposit.Close_Time < @endDate
      ) AS result
      GROUP BY belongTo
    );

    #取得出金資料
    CREATE TEMPORARY TABLE temp_withdrawal
    (
      SELECT belongTo,sum(profit) as profit
      FROM (
        SELECT tradeAccount.belongTo, withdrawal.profit
        FROM ${this.mt4DbName}.mt4_sync_withdrawal AS withdrawal
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON withdrawal.Login = tradeAccount.node_id
        WHERE withdrawal.Close_Time >= @startDate AND withdrawal.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, withdrawal.profit
        FROM ${this.mt5DbName}.mt4_sync_withdrawal AS withdrawal
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON withdrawal.Login = tradeAccount.node_id
        WHERE withdrawal.Close_Time >= @startDate AND withdrawal.Close_Time < @endDate
      ) AS Result
      GROUP BY belongTo
    );

    #取得轉入金資料
    CREATE TEMPORARY TABLE temp_transferIn
    (
      SELECT belongTo,sum(profit) as Profit
      FROM (
        SELECT tradeAccount.belongTo, transferIn.profit
        FROM ${this.mt4DbName}.mt4_sync_transfer_in AS transferIn
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON transferIn.Login = tradeAccount.node_id
        WHERE transferIn.Close_Time >= @startDate AND transferIn.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, transferIn.profit
        FROM ${this.mt5DbName}.mt4_sync_transfer_in AS transferIn
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON transferIn.Login = tradeAccount.node_id
        WHERE transferIn.Close_Time >= @startDate AND transferIn.Close_Time < @endDate
      ) AS Result
      GROUP BY belongTo
    );

    #取得代理傭金資料
    CREATE TEMPORARY TABLE temp_rebate
    (
      SELECT belongTo,SUM(profit) AS profit
      FROM (
        SELECT tradeAccount.belongTo, rebate.Profit
        FROM ${this.mt4DbName}.mt4_sync_rebate AS rebate
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON rebate.Login = tradeAccount.node_id
        WHERE rebate.Close_Time >= @startDate AND rebate.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, rebate.Profit
        FROM ${this.mt5DbName}.mt4_sync_rebate AS rebate
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON rebate.Login = tradeAccount.node_id
        WHERE rebate.Close_Time >= @startDate AND rebate.Close_Time < @endDate
      ) AS Result
      GROUP BY belongTo
    );

    #取得交易資料
    CREATE TEMPORARY TABLE temp_order
    (
      SELECT belongTo,SUM(volume) AS volume,SUM(Commission) AS Commission
        ,SUM(commission_Agent) as commission_Agent,SUM(Swaps) as Swaps
        ,SUM(profit) as profit
      FROM (
        SELECT tradeAccount.belongTo, orderData.volume,orderData.Commission
          ,orderData.commission_Agent,orderData.Swaps ,orderData.profit
        FROM ${this.mt4DbName}.mt4_sync_order AS orderData
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON orderData.Login = tradeAccount.node_id
        WHERE orderData.Close_Time >= @startDate AND orderData.Close_Time < @endDate
        UNION ALL
        SELECT tradeAccount.belongTo, orderData.volume,orderData.Commission
          ,orderData.commission_Agent,orderData.Swaps ,orderData.profit
        FROM ${this.mt5DbName}.mt4_sync_order AS orderData
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON orderData.Login = tradeAccount.node_id
        WHERE orderData.Close_Time >= @startDate AND orderData.Close_Time < @endDate
      ) AS Result
      GROUP BY belongTo
    );

    #取得交易帳戶資料
    CREATE TEMPORARY TABLE temp_users
    (
      SELECT belongTo,CURRENCY,SUM(BALANCE) AS BALANCE,SUM(EQUITY) AS EQUITY
      FROM (
        SELECT tradeAccount.belongTo, userData.BALANCE,userData.CURRENCY,userData.EQUITY
        FROM ${this.mt4DbName}.mt4_users AS userData
        INNER JOIN temp_tradeAccount_mt4 AS tradeAccount ON userData.Login = tradeAccount.node_id
        UNION ALL
        SELECT tradeAccount.belongTo, userData.BALANCE,userData.CURRENCY,userData.EQUITY
        FROM ${this.mt5DbName}.mt4_users AS userData
        INNER JOIN temp_tradeAccount_mt5 AS tradeAccount ON userData.Login = tradeAccount.node_id
      ) AS Result
      GROUP BY belongTo,CURRENCY
    );

    #整合資料
      SELECT main.belongTo as node_id, main.parent_id, main.trade_system
        # 入金
        ,IFNULL(deposit.Profit,0)  AS depositUSD
        # 出金
        ,IFNULL(withdrawal.Profit,0) AS withdrawalUSD
        # 淨入金
        ,IFNULL(deposit.Profit,0) + IFNULL(withdrawal.Profit,0) AS netDepositUSD
        # 轉入金
        ,IFNULL(transferIn.Profit,0) AS transferInUSD
        # 交易量
        ,format(IFNULL(orders.Volume,0) /100,2) AS Volume
        # 傭金
        ,IFNULL(orders.Commission,0) AS commissionUSD
        # 代理傭金
        ,IFNULL(rebate.Profit,0) AS commissionAgentUSD
        # 利息
        ,IFNULL(orders.Swaps,0) AS SwapsUSD
        # 盈亏
        ,IFNULL(orders.profit,0) AS profitUSD
        # 餘額
        ,IFNULL(users.balance,0) AS balanceUSD
        # 淨值
        ,IFNULL(users.EQUITY,0) AS equityUSD
        # 幣種
        ,users.CURRENCY as CURRENCY
      FROM temp_master AS main
        LEFT JOIN temp_deposit AS deposit ON main.belongTo = deposit.belongTo
        LEFT JOIN temp_withdrawal AS withdrawal ON main.belongTo = withdrawal.belongTo
        LEFT JOIN temp_transferIn AS transferIn ON main.belongTo = transferIn.belongTo
        LEFT JOIN temp_order AS orders ON main.belongTo = orders.belongTo
        LEFT JOIN temp_rebate AS rebate ON main.belongTo = rebate.belongTo
        INNER JOIN temp_users AS users ON main.belongTo = users.belongTo ;`;

    const params = [
      nodeId,
      entity,
      moment(startDate).format('YYYY-MM-DD'),
      moment(endDate).add(1, 'day').format('YYYY-MM-DD'),
    ];

    const data = await this.relationshipRepository
      .query(sqlCommand, params) || [];
    return data[data.length - 1];
  }

}
