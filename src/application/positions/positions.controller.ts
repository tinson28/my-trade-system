import { Controller, Get, Query } from '@nestjs/common';
import { PureController, LoggerService, HttpStatusCode } from '../../@nt';
import { PositionsService } from './positions.service';
import { PositionsDto } from './positions.dto';
import { SubPositionsDto } from './subPositions.dto';
import moment = require('moment');

@Controller('positions')
export class PositionsController extends PureController {
  constructor(
    protected readonly positionService: PositionsService,
    protected readonly loggerService: LoggerService) {
    super(positionService);
  }

  /**
   * @name 倉位總結資料
   * @author rex.hong 2019-12-16
   * @param {number} accountNumber 主帳號 必填
   * @param {string} entity 牌照 必填
   * @param {Date} startDate date 查詢日期(起) 必填
   * @param {Date} endDate date 查詢日期(迄) 必填
   */
  @Get('getOwnPosition')
  async getOwnPosition(@Query() query: PositionsDto) {
    try {
      // 檢查參數
      if (!query.accountNumber || !query.entity || !query.startDate || !query.endDate) {
        return this.returnJson(HttpStatusCode.PARAMETER_EMPTY, JSON.stringify(query));
      }
      // 檢查牌照
      if (!this.checkEntity(query.entity)) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'entity');
      }
      // 檢查查詢日期(起)
      if (!query.startDate || !moment(query.startDate).isValid()) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'startDate');
      }
      // 檢查查詢日期(迄)
      if (!query.endDate || !moment(query.endDate).isValid()) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'endDate');
      }

      const data = await this.positionService.getOwnPositionData(
        query.accountNumber,
        query.entity,
        query.startDate,
        query.endDate,
      );
      return this.returnJson(HttpStatusCode.DATA_QUERY_SUCCESS, data);
    } catch (err) {
      this.loggerService.error(err.message, err.stack, 'getOwnPosition');
      return this.returnJson(HttpStatusCode.DATA_QUERY_FAILED, err.message);
    }
  }

  /**
   * @name 倉位總結資料IB代理/CL客戶
   * @author rex.hong 2019-12-16
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
  @Get('getSubPosition')
  async getSubPosition(@Query() query: SubPositionsDto) {
    try {
      const startTime = moment().valueOf();
      // 檢查參數
      if (!query.accountNumber || !query.startDate || !query.endDate) {
        return this.returnJson(HttpStatusCode.PARAMETER_EMPTY, JSON.stringify(query));
      }
      // 檢查帳號類別
      if (!this.checkAccType(query.accType)) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'accType');
      }
      // 檢查牌照
      if (!this.checkEntity(query.entity)) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'entity');
      }
      // 檢查查詢日期(起)
      if (!query.startDate || !moment(query.startDate).isValid()) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'startDate');
      }
      // 檢查查詢日期(迄)
      if (!query.endDate || !moment(query.endDate).isValid()) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'endDate');
      }
      // 檢查排序欄位
      const allowSortKey = ['node_id', 'netDepositUSD', 'volume',
        'commissionUSD', 'commissionAgentUSD', 'profitUSD'];
      if (!allowSortKey.map(x => x.toLowerCase()).includes(query.sortKey.toLowerCase())) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'sortKey');
      }
      // 檢查排序遞增增減
      if (!['desc', 'asc'].includes(query.sortValue.toLowerCase())) {
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

      const data = await this.positionService.getSubPositionData(query);
      console.log('请求开始:', startTime);
      const endTime = moment().valueOf();
      console.log('请求结束:', endTime);
      console.log('请求耗时:', endTime - startTime);
      return this.returnJson(HttpStatusCode.DATA_QUERY_SUCCESS, data);
    } catch (err) {
      this.loggerService.error(err.message, err.stack, 'getSubPositionData');
      return this.returnJson(HttpStatusCode.DATA_QUERY_FAILED, err.message);
    }
  }

  /**
   * 倉位總結交易帳號明細
   * @param {number} accountNumber 主帳號
   * @param {string} entity 牌照
   * @param {Date} startDate 查詢日期(起)
   * @param {Date} endDate 查詢日期(迄)
   */
  @Get('getTradeAccountPosition')
  async getTradeAccountPosition(@Query() query: PositionsDto) {
    try {
      // 檢查參數
      if (!query.accountNumber || !query.entity || !query.startDate || !query.endDate) {
        return this.returnJson(HttpStatusCode.PARAMETER_EMPTY, JSON.stringify(query));
      }
      // 檢查牌照
      if (!this.checkEntity(query.entity)) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'entity');
      }
      // 檢查查詢日期(起)
      if (!query.startDate || !moment(query.startDate).isValid()) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'startDate');
      }
      // 檢查查詢日期(迄)
      if (!query.endDate || !moment(query.endDate).isValid()) {
        return this.returnJson(HttpStatusCode.PARAMETER_INVALID, 'endDate');
      }

      const data = await this.positionService.getTradeAccountPositionData(
        query.accountNumber,
        query.entity,
        query.startDate,
        query.endDate,
      );
      return this.returnJson(HttpStatusCode.DATA_QUERY_SUCCESS, data);
    } catch (err) {
      this.loggerService.error(err.message, err.stack, 'getTradeAccountPositionData');
      return this.returnJson(HttpStatusCode.DATA_QUERY_FAILED, err.message);
    }
  }
}
