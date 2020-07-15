import { Injectable, Inject, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as rp from 'request-promise';
import { ConfigService } from '../../@nt';
import { Config } from 'nestjs-async-config';

import { mt4_users } from '../../module/mt4/mt4_users';

@Injectable()
export class UsersService {

  private mturl;
  constructor(
    @InjectRepository(mt4_users, 'mt4report') private mt4Repository: Repository<mt4_users>,
    @InjectRepository(mt4_users, 'mt4report_demo') private mt4_demoRepository: Repository<mt4_users>,
    @InjectRepository(mt4_users, 'mt5to4report') private mt5Repository: Repository<mt4_users>,
    @InjectRepository(mt4_users, 'mt5to4report_demo') private mt5_demoRepository: Repository<mt4_users>,
    @InjectRepository(mt4_users, 'mt4_s02') private mt4_s02Repository: Repository<mt4_users>,
    @InjectRepository(mt4_users, 'mt4_s03') private mt4_s03Repository: Repository<mt4_users>,

    @Inject(Config) readonly config: Config,
    protected httpSerivce: HttpService,
    protected configService: ConfigService,
  ) {
    this.mturl = config.get('man2json');
  }

  async getUser(params, query) {
    return await this[`${query.mtName.toLowerCase()}Repository`].find({ LOGIN: params.id });
  }

  async findUsersByArr(body: any) {
    const { type, users } = body;
    return await this[`${type}Repository`].findAndCount({ LOGIN: In(users) });
  }

  async getUsersField(body) {
    try {
      const tradeAccountList = body.tradeAccountList;
      const select = body.field || '*';
      let list = [];
      if (typeof tradeAccountList === 'object') {
        for (const key in tradeAccountList) {
          const tradeAccountArr = tradeAccountList[key]; // 交易账号
          const result = await this[`${key.toLocaleLowerCase()}Repository`].find({ where: { LOGIN: In(tradeAccountArr) }, select });
          list = list.concat(result);
        }
      }
      return { code: 1001, data: list, message: 'Success!' };
    } catch (error) {
      console.log(error.message)
      return { code: 3001, message: error.message, data: '' };
    }
  }

  async getUserField(tradeAccount, query) {
    try {
      const mtName = query.mtName ?  query.mtName.toLowerCase() : 'mt4';
      const select = query.field || '*';

      const userField = await this[`${mtName}Repository`].findOne({ LOGIN: tradeAccount }, { select });
      return { code: 1001, data: userField, message: 'Success!' };
    } catch (error) {
      return { code: 3001, message: error.message, data: '' };
    }
  }

  async getSumBalance(dbName: string, nodeIds: string[]) {
    const result = await this[`${dbName}Repository`].createQueryBuilder()
      .select('SUM(Balance)', 'sum_balance')
      .where({ LOGIN: In(nodeIds) })
      .getRawOne();

    return result;
  }

  async changeForexPassword(body) {
    try {
      const changePasswordParams = {
        login: body.login,
        password: body.password,
      };

      const requestToMT5MAN2JSONAPISelect = {
        method: 'POST',
        uri: `${this.mturl[body.mtName]}/Accounts/ChangePassword`,
        body: changePasswordParams,
        json: true,
      };
      console.log('select', requestToMT5MAN2JSONAPISelect);
      const changeForexPasswordResponse = await rp(requestToMT5MAN2JSONAPISelect);
      console.log(changeForexPasswordResponse);
      if (changeForexPasswordResponse.status !== 0) {
        console.log('response.status', changeForexPasswordResponse.status);
        throw new Error('change forex password have some error');
      }
      return true;
    } catch (err) {
      console.log('>>>>>>>>>>>>changeForexPassword----err', err);
      throw new Error('some error');
    }
  }

  // 取得每個交易帳號加總的balance, equity
  async getTotal(params, query) {
    try {
      console.log(`${params.type} tradeAccount[]: ${query.tradeAccount}`);
      const total = await this[`${params.type}Repository`]
        .createQueryBuilder('mt4_users')
        .select('SUM(mt4_users.BALANCE) as totalBalance, SUM(mt4_users.EQUITY) as totalEquity')
        .where({ LOGIN: In(query.tradeAccount) })
        .execute();
      let result;
      console.log('total: ', total);
      if (total[0].totalBalance !== null && total[0].totalEquity !== null) {
        result = total[0];
      } else {
        console.log('these tradeAccounts does not exist in MySQL!');
        result = { totalBalance: 0, totalEquity: 0 };
      }
      return result;
    } catch (err) {
      throw new Error('tradeSystem getTotal: ' + err.message);
    }
  }

  // 取得每個交易帳號的balance, equity
  async getUserTradeAccountDetails(mtName, query) {
    try {
      console.log(`${mtName} tradeAccount[]: ${query.tradeAccount}`);
      const res = await this[`${mtName.toLowerCase()}Repository`]
        .createQueryBuilder('mt4_users')
        .select('mt4_users.LOGIN, mt4_users.BALANCE, mt4_users.EQUITY,mt4_users.CREDIT')
        .where({ LOGIN: In(query.tradeAccount) })
        .execute();
      return res;
    } catch (err) {
      throw new Error('tradeSystem getUserTradeAccountDetails: ' + err.message);
    }
  }

  /* 查询活动期间交易手数
   * 手数的时间范围和交易账号注册时间必须在活动期间
   * 交易账号的每笔订单时间必须在参加活动时间至活动结束时间范围内*/
  async lotsDuringPromotionService(params) {
    const { tradeAccount, startDate, endDate, enrollDate, mttype } = params;
    const result = await this[`${mttype}Repository`].createQueryBuilder('u')
      .innerJoinAndSelect(
        'mt4_sync_order',
        'o',
        `u.LOGIN = ${tradeAccount}
                AND o.Login = ${tradeAccount}
                AND o.Symbol NOT LIKE \'#%\'
                AND o.Symbol NOT LIKE \'%m\'
                AND u.REGDATE BETWEEN '${startDate}' AND '${endDate}'
                AND o.Symbol NOT in ('BTCUSD', 'ETHUSD', 'LTCUSD', 'DSHUSD')
                AND o.Close_Time > '${enrollDate}'
                AND o.Close_Time <
                if((SELECT TIMESTAMPDIFF(DAY,'${enrollDate}','${endDate}'))>30,'${endDate}',
                DATE_ADD('${enrollDate}', interval 1 month))`,
      )
      .select('sum(o.Volume) as lots')
      .execute();
    return result;
  }

  /**
   * 檢查帳號密碼
   * @param {string} login 交易帳號
   * @param {string} password 交易密碼
   * @param {string} mttype 交易帳號類別 mt4|mt4_demo|mt5|mt5_demo
   * @returns {boolean} true:密碼正確 false:密碼錯誤
   */
  async checkPassword(login: string, password: string, mttype: string) {
    try {
      const apiUrl = `${this.mturl[mttype]}/Accounts/checkPassword`;
      const data = { login, password };

      const resData = await this.httpSerivce.post(apiUrl, data).toPromise();
      return resData.data['status'];
    } catch (err) {
      console.log('checkPassword error:' + err);
      return false;
    }
  }
}
