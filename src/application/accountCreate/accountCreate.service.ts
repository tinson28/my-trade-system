import { Injectable, HttpException, HttpStatus, HttpService } from '@nestjs/common';
import { ConfigService, LoggerService } from '../../@nt';
import { map } from 'rxjs/operators';
import * as qs from 'querystring';
import { InjectRepository } from '@nestjs/typeorm';
import { mt4_users } from '../../module/mt4/mt4_users';
import { Repository } from 'typeorm';

@Injectable()
export class AccountCreateService {

  constructor(
    protected readonly httpService: HttpService,
    protected readonly config: ConfigService,
    private readonly logger: LoggerService,

    @InjectRepository(mt4_users, 'mt5to4report')
    private mt5usersRepository: Repository<mt4_users>,
    @InjectRepository(mt4_users, 'mt4report')
    private mt4usersRepository: Repository<mt4_users>,
    @InjectRepository(mt4_users, 'mt5to4report_demo')
    private mt5demousersRepository: Repository<mt4_users>,
    @InjectRepository(mt4_users, 'mt4report_demo')
    private mt4demousersRepository: Repository<mt4_users>,
  ) { }

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async accountCreateRandom(body: any) {
    try {
      this.logger.log('===== MT Random API =====', AccountCreateService.name);
      this.logger.log(body.login, '-->Login');
      this.logger.log(body.tradeAccountType, '-->TradeAccountType');
      const mtUrl = this.getMtUrl(body.tradeAccountType) + '/Accounts/Register';
      delete body.tradeAccountType;
      delete body.upperBound;
      delete body.lowerBound;

      this.logger.log(mtUrl, AccountCreateService.name);

      const result = await this.httpService.post(mtUrl, qs.stringify(body), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      }).pipe(map(response => response.data)).toPromise();
      this.logger.log(JSON.stringify(result), AccountCreateService.name);
      return result;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  getMtUrl(tradeAccountType) {
    switch (tradeAccountType) {
      case 'mt4':
        return `${this.config.get('MT4_MAN2JSON_API_ENDPOINT')}`;
      case 'mt4_demo':
        return `${this.config.get('MT4DEMO_MAN2JSON_API_ENDPOINT')}`;
      case 'mt5':
        return `${this.config.get('MT5_MAN2JSON_API_ENDPOINT')}`;
      case 'mt5_demo':
        return `${this.config.get('MT5DEMO_MAN2JSON_API_ENDPOINT')}`;
    }
  }

  /**
   * @author AndyLiao 2019-10-17
   * @param login                       交易帳號
   * @param tradeAccountType            交易帳號類型
   * @description 檢驗交易帳號是否已存在
   */
  async checkLogin(login, tradeAccountType) {
    return await this.getUsers(tradeAccountType).createQueryBuilder('users')
      .where('users.login = :login', { login })
      .getCount() > 0;
  }

  getUsers(tradeAccountType) {
    switch (tradeAccountType) {
      case 'mt5':
        return this.mt5usersRepository;
      case 'mt4':
        return this.mt4usersRepository;
      case 'mt5_demo':
        return this.mt5demousersRepository;
      case 'mt4_demo':
        return this.mt4demousersRepository;
    }
  }
}
