import { Controller, Get, Param, Post, Body, Query, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PureController, HttpStatusCode } from '../../@nt';
import { TradeListReqDto } from './tradeListReq.dto';
import moment = require('moment');

@Controller('orders')
export class OrdersController extends PureController {
  constructor(protected readonly service: OrdersService) {
    super(service);
  }

  @Post()
  findOrder(@Body() body) {
    return this.service.findOrder(body);
  }

  /**
   * @api {get} /orders/getOrderList
   * @author RexHong 2019-12-02
   * @name 取得交易資料
   * @param {string} query.accountNumber (必填) 查詢主帳號
   * @param {string} query.openOrClosePosition (必填) 開倉/平倉 ['open','close']
   * @param {string} query.tradeType 交易類型(0買或1賣) ['0','1']
   * @param {string} query.entity 牌照 ['KY','GM','UK','MU','UAE']
   * @param {string} query.symbol 商品名稱
   * @param {object} query.tradeAccount 交易帳號
   * @param {date} query.startDate (必填) 查詢日期(起)
   * @param {date} query.endDate (必填) 查詢日期(迄)
   * @param {string} query.sortKey 排序欄位 ['open_time', 'close_time', 'profit', 'volume']
   * @param {string} query.sortValue 排序遞增/遞減 ['asc','desc']
   * @param {number} query.pageSize 分頁筆數
   * @param {number} query.pageIndex 分頁數
   */
  @Get('getOrderList')
  async  getOrderList(@Query() query: TradeListReqDto) {
    try {
      // 檢查必填主账号
      if (!query.accountNumber) {
        return this.returnJson(HttpStatusCode.PARAMETER_EMPTY, 'accountNumber');
      }
      // 檢查必填交易账号
      if (!query.tradeAccount) {
        return this.returnJson(HttpStatusCode.PARAMETER_EMPTY, 'tradeAccount');
      }
      // 檢查查詢日期(起)
      if (!query.startDate || !moment(query.startDate).isValid()) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'startDate');
      }
      // 檢查查詢日期(迄)
      if (!query.endDate || !moment(query.endDate).isValid()) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'endDate');
      }
      // 檢查查詢類型 已/未平倉
      if (query.openOrClosePosition !== 'open' && query.openOrClosePosition !== 'close') {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'openOrClosePosition');
      }
      // 檢查牌照
      if (!this.checkEntity(query.entity)) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'entity');
      }
      // 檢查交易類型 買/賣
      if (query.tradeType && query.tradeType !== '0' && query.tradeType !== '1') {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'tradeType');
      }
      // 檢查排序欄位
      const allowSortKey = ['open_time', 'close_time', 'profit', 'volume'];
      if (!allowSortKey.includes(query.sortKey.toLowerCase())) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'sortKey');
      }
      // 檢查排序遞增增減
      if (query.sortValue.toLowerCase() !== 'desc' &&
        query.sortValue.toLowerCase() !== 'asc') {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'sortValue');
      }
      // 檢查分頁數是否為數字
      if (query.pageIndex && isNaN(query.pageIndex)) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'pageIndex');
      }
      // 檢查分頁筆數是否為數字
      if (query.pageSize && isNaN(query.pageSize)) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'pageSize');
      }

      const result = await this.service.getOrderList(query);
      return this.returnJson(HttpStatusCode.DATA_QUERY_SUCCESS, result);
    } catch (err) {
      console.log('getOrderList controller error:' + err);
      return this.returnJson(HttpStatusCode.SYSTEM_ERROR, err.message);
    }
  }

  /**
   * @api {get} /orders/getSymbolList
   * @author RexHong 2019-12-03
   * @name 取得商品資料
   * @param {string} query.accountNumber (必填) 查詢主帳號
   * @param {string} query.entity (必填) 牌照
   */
  @Get('getSymbolList')
  async  getSymbolList(@Query() query: TradeListReqDto) {
    try {
      // 檢查必填欄位
      if (!query.accountNumber) {
        return this.returnJson(HttpStatusCode.PARAMETER_EMPTY, 'accountNumber');
      }
      // 檢查牌照
      if (!this.checkEntity(query.entity)) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'entity');
      }

      const result = await this.service.getSymbolList(query);
      return this.returnJson(HttpStatusCode.DATA_QUERY_SUCCESS, result);
    } catch (err) {
      console.log('getSymbolList controller error:' + err);
      return this.returnJson(HttpStatusCode.SYSTEM_ERROR, err.message);
    }
  }

  /**
   * @api {get} /orders/unClose/:accountNumber 檢查 accountNumber 是否有未平倉的部位
   * @apiVersion 0.1.0
   * @apiName GetOrder
   * @apiGroup Order
   * @Params accountNumber {Number}
   * @Query type
   */
  @Get('unClose/:accountNumber')
  async findUncloseOrder(@Query() query: { type: String }, @Param('accountNumber') accountNumber) {
    try {
      const result = await this.service.findUncloseOrder(query, accountNumber);
      if (result.status === 'success') {
        return this.returnJson(1004, result);
      }
      return this.returnJson(2004, result);
    } catch (err) {
      console.log(err.message);
      return this.returnJson(2004, err.message);
    }
  }

  /**
   * @author Andy.Liao 2019-12-23
   * @description 累計時間區間內交易帳號開倉幾次
   * @param query.tradeAccount
   * @param query.mtType
   * @param query.startDate
   * @param query.endDate
   * @return count
   */
  @Post('withdrawalCheck')
  async withdrawalCheck(@Body() body) {
    try {
      const result = await this.service.withdrawalCheck(body);
      return this.returnJson(1004, result);
    } catch (err) {
      return this.returnJson(2004, err.message);
    }
  }

  @Get('findLastOrderByLogin')
  async findLastOrderByLogin(@Query() query) {
    console.log(query);
    let data = await this.service.findLastOrderByLogin(query);
    return this.returnJson(1004, data);
  }

  /**
   * @author Ben.Zhu 2020-01-10
   * @description 根据条件计算出金手续费
   * @param query.tradeAccount 交易账号
   * @param query.mtName       账号mtName
   * @param query.amount       取款金额
   * @param query.country      居住国
   * @return data              手续费
   * 1.出金金额 <= 100  手续费固定5.00元
   * 2.出金金额 > 100 时：
   *   a.去MySQL sync_deposit找出最近一笔入金时间
   *   b.当前出金时间
   * 3.去MySQL sync_order表中查找时间Open_Time在a和b之间的订单
   *   a.若有记录：手续费为0.00元
   *   b.若无记录：手续费为 出金金额 * 5%
   */
  @Get('calculateWithdrawalCharge')
  async calculateWithdrawalCharge(@Query() query) {
    console.log(query);
    const data = await this.service.calculateWithdrawalCharge(query);
    return this.returnJson(1004, data);
  }

}
