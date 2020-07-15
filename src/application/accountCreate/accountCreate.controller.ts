import { Controller, Get, Query, Post, Body, HttpException, Logger } from '@nestjs/common';
import { AccountCreateService } from './accountCreate.service';
import { PureController } from '../../@nt';

@Controller('account_create')
export class AccountCreateController extends PureController {
  private readonly logger = new Logger(AccountCreateController.name);

  constructor(
    protected readonly service: AccountCreateService,
  ) {
    super(service);
  }

  /**
   * @api {post} /account_create
   * @apiVersion 0.1.0
   * @apiName redirect to MT to create the MT account
   * @apiGroup account_create
   *  Parameters:
   *      login: ,
   *      name: ,
   *      group: ,
   *      leverage: 20,
   *      // comment: '', // Optional
   *      address: ,
   *      // city: , // Optional
   *      country: ,
   *      email: ,
   *      isEnabled: true,
   *      isEnabledChangePassword: true,
   *      // isReadOly: , // Optional
   *      colorBlue: '16711680',
   *      colorGreen: '32768',
   *      colorRed: '255',
   *      agentAccount: ,
   *      phone: ,
   *      // phonePassword: , // Optional
   *      sendReports: true,
   *      // state: , // Optional
   *      status: ,
   *      // zipCode: , // Optional
   *      id: ,
   *      language: 4,
   *      // company: , //Optional
   *      // account: , //Optional
   *      // leadCampaign: , // Optional
   *      // leadSource: , // Optional
   *      // tradeDisable: , // Optional
   *      trailing: true, // Only MT5
   *      expert: true, // Only MT5
   *      webApi: true, // Only MT5
   *      resetPass: true, // Only MT5
   *      otpEnable: true, // Only MT5
   *      password: ,
   *      passwordInvestor: ,
   *      tradeAccountType: // mt4_demo || mt5_demo || mt4 || mt5
   */

  @Post()
  async create(@Body() body) {
    console.log('create ', body)
    this.logger.log(body);
    let count = 0;
    const maxCount = 1;
    const tradeAccountType = body.tradeAccountType;
    const lower = body.lowerBound || 800000000;
    const upper = body.upperBound || 900000000;

    const createMTAccount = async (params) => {
      const userLogin = this.service.getRandom(lower, upper - 1);
      body.login = userLogin;
      try {
        /** Create mt4 || mt5 account */
        return await this.service.accountCreateRandom(body);
      } catch (err) {
        count += 1;
        if (count < maxCount) {
          body.tradeAccountType = tradeAccountType;
          return await createMTAccount(params);
        }
        throw new HttpException(err.message.error, err.message.statusCode);
      }
    };
    return await createMTAccount(body);
  }

  /**
   * @author AndyLiao 2019-10-17
   * @param query.login                         交易帳號
   * @param query.tradeAccountType              交易帳號類型
   */
  @Get('checkLogin')
  checkLogin(@Query() query) {
    this.logger.log(query);
    return this.service.checkLogin(query.login, query.tradeAccountType);
  }
}
