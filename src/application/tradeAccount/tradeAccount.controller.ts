import { Controller, Post, Body } from '@nestjs/common';
import { TradeAccountService } from './tradeAccount.service';

@Controller('tradeAccount')
export class TradeAccountController {

  constructor(
    protected readonly service: TradeAccountService,
  ) { }

  /**
   * @author Grant.Zheng 2019-10-30
   * @api {post} /tradeAccount/getMaxTradeAccount 获取最大交易账号（生成交易账号使用）
   * @apiName getMaxTradeAccount
   * @apiGroup tradeAccount
   *
   * @apiParam {String="ky","uk","uae","gm","mu"} [entity]="ky" 区域
   * @apiParam {String="mt4","mt4_demo","mt5","mt5_demo"} [mttype]="mt4" 账户类型
   * @apiParam {Number} prefix 交易账户前缀
   * @apiParam {Number} accountLength 交易账户总长度
   * @apiParam {Number} [targetBaseId] 指定交易账号
   *
   * @apiSuccess {Number=1004,2004} code 请求状态码
   * @apiSuccess {String} message 请求状态提示语
   * @apiSuccess {String} data 生成的交易账号
   */
  @Post('getMaxTradeAccount')
  async getMaxTradeAccount(@Body() body) {
    const r = await this.service.getMaxTradeAccount(body);
    let rm = {
      code: 1004,
      message: 'Success!',
      data: '',
    };

    if (r.message === 'ok') {
      rm.data = r.tradeAccount;
    } else {
      rm.message = r.message;
    }

    return rm;
  }

  /**
   * @author Terence.Sun 2019-12-02
   * @api {post} /tradeAccount/checkTradeAccountActive 查询交易账号是否启用
   * @apiName checkTradeAccountActive
   * @apiGroup tradeAccount
   *
   * @apiParam {Array} body.queryList [Object] { type: 'mt4/mt5', 'id': xxxx } 查询的数组
   *
   * @apiSuccess {Number=1004} code 请求状态码
   * @apiSuccess {String} message 请求状态提示语
   * @apiSuccess {String} data 查询结果
   */
  @Post('checkTradeAccountActive')
  async checkTradeAccountActive(@Body() body) {
    return await this.service.checkTradeAccountActive(body);
  }

  /**
   * @author Grant.Zheng
   * @api {post} /tradeAccount/updateManyMtTradeAccount 批量更新mt详情
   * @apiName updateManyMtTradeAccount
   * @apiGroup tradeAccount
   * 
   * @apiParam {Array} body
   */
  @Post('updateManyMtTradeAccount')
  async updateManyMtTradeAccount(@Body() body) {
    const r = this.service.updateManyMtTradeAccount(body);
    
  }
}
