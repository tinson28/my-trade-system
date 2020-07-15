import { Controller, Get, Param, Query, Post, Body, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { PureController, HttpStatusCode } from '../../@nt';

@Controller('users')
export class UsersController extends PureController {
  constructor(protected readonly service: UsersService) {
    super(service);
  }

  /**
   * @api {get} /sum_balance Get sum of Users in node_ids list
   * @apiVersion 0.1.0
   * @apiName GetUserSumBalance
   * @apiGroup User
   */
  @Get('sum_balance')
  getSumBalance(@Query() querys) {
    let { db_name, node_ids } = querys;

    if (!Array.isArray(node_ids)) {
      node_ids = [node_ids];
    }

    return this.service.getSumBalance(db_name, node_ids);
  }

  /**
   * @api {get} /user/:id Read data of a User
   * @apiVersion 0.1.0
   * @apiName GetUser
   * @apiGroup User
   */
  @Get(':id')
  get(@Param() params, @Query() query) {
    return this.service.getUser(params, query);
  }

  /**
   * @author Grant.Zheng
   * @api {get} /user/getUserField/:id Read data of a User
   * @apiVersion 0.1.0
   * @apiName getUserField
   * @apiGroup User
   *
   * @apiParam {number} id 交易账号
   * @apiParam {string="mt4","mt5","mt4_demo","mt5_demo", "mt4_s02"} [mtName] MT类型
   * @apiParam {array} [field] 需要查询得字段 一维数组
   *
   */
  @Get('/getUserField/:tradeAccount')
  async getUserField(@Param('tradeAccount') tradeAccount, @Query() query, @Res() res) {
    let result = await this.service.getUserField(tradeAccount, query);
    res.status(200).end(JSON.stringify(result));
  }

  /**
   * @author Ben.Zhu
   * @api {post} /user/getUsersField
   * @apiVersion 0.1.0
   * @apiName getUsersField
   * @apiGroup User
   *
   * @apiParam { mt4: [ '823592949'], mt5: [ '132548123', '1000000071' ] }
   * @apiParam {array} [field] 需要查询得字段 一维数组
   *
   */
  @Post('getUsersField')
  async getUsersField(@Body() body) {
    return await this.service.getUsersField(body);
  }

  /**
   * @author Ben wu 2019/09/11
   * @api {get} /user/detail/:type get user BALANCE and EQUITY
   * @apiVersion 0.1.0
   * @param {String} mtName (mt4/mt4_demo/mt5/mt5_demo)
   * @param {Array} tradeAccount
   * @apiName getUsertradeAccountDetails
   * @apiGroup User
   * @example http://localhost:3000/v1/users/detail/mt4?tradeAccount[]=1000015961&tradeAccount[]=1016&tradeAccount[]=11010&tradeAccount[]=20018
   */
  @Get('/detail/:mtName')
  async getUsertradeAccountDetails(@Param('mtName') mtName, @Query() query, @Res() res) {
    try {
      const result = await this.service.getUserTradeAccountDetails(mtName, query);
      res.status(200).json({ code: 1004, message: '数据查询成功', data: result });
    } catch (err) {
      res.status(200).json({ code: 2019, message: '请求失败', data: err.message });
    }
  }
  /**
   * @author Zachary 2019/11/18
   * @api {get} /user/total/:type get user total BALANCE and total EQUITY
   * @apiVersion 0.1.0
   * @apiName getTotal
   * @apiGroup User
   * @example http://localhost:3000/v1/users/total/mt4?tradeAccount[]=1000015961&tradeAccount[]=1016&tradeAccount[]=11010&tradeAccount[]=20018
   */
  @Get('/total/:type')
  async getTotal(@Param() params, @Query() query, @Res() res) {
    try {
      const result = await this.service.getTotal(params, query);
      res.json({ code: 1004, message: '数据查询成功', data: result });
      return result;
    } catch (err) {
      res.json({ code: 2019, message: '请求失败', data: err.message });
    }
  }
  /**
   * @api {Post}
   * @apiVersion 0.1.0
   * @apiName GetUser
   * @apiGroup User
   */
  @Post()
  findUsersByArr(@Body() body) {
    return this.service.findUsersByArr(body);
  }

  @Post('changeForex')
  async changeForexPassword(@Body() body) {
    console.log('changeForexPassword>>>>', body);
    return await this.service.changeForexPassword(body);
  }

  /**
   * 檢查交易帳號密碼
   * @author RexHong 2019-11-11
   * @api {post} /users/checkPassword
   * @param body.login 交易帳號
   * @param body.password 交易密碼
   * @param body.type 交易帳號類型: mt4|mt4_demo|mt5|mt5_demo+?...
   */
  @Post('checkPassword')
  async checkPassword(@Body() body: {
    login: string,
    password: string,
    type: string,
  }) {
    try {
      // 檢查參數
      if (!body.login || !body.password || !body.type) {
        return this.returnJson(HttpStatusCode.PARAMETER_EMPTY);
      }

      // 檢查交易帳號密碼
      const result = await this.service.checkPassword(body.login, body.password, body.type);
      return this.returnJson(HttpStatusCode.REQUEST_SUCCESS, result);
    } catch (err) {
      console.log('checkPassword error:' + err);
      return this.returnJson(HttpStatusCode.REQUEST_FAILED, false);
    }
  }

  /**
   * 方法名称：lotsDuringPromotion
   * @param tradeAccount(交易账号) 类型: Number 是否必填: 是
   * @param startDate(活动开始日期) 类型: String 是否必填: 是
   * @param endDate(活动结束日期) 类型: String 是否必填: 是
   * @param enrollDate(参加活动日期) 类型: String 是否必填: 是
   * @param mttype String mt类型
   * @return 返回交易账户在活动期间的交易总手数
   */
  @Get('findLots/:tradeAccount/:startDate/:endDate/:enrollDate')
  async lotsDuringPromotion(@Param() params) {
    return await this.service.lotsDuringPromotionService(params);
  }
}
