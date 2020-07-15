import { Controller, Get, Param, Query, Post, Body, Res } from '@nestjs/common';
import { TransactionListService } from './transactionList.service';
import { PureController, HttpStatusCode } from '../../@nt';

@Controller('transactionList')
export class TransactionListController extends PureController {
  constructor(protected readonly service: TransactionListService) {
    super(service);
  }

  /**
   * @author Zachary 2019/11/28
   * @api {get} /v1/transactionList/:accountNumber 取得一個主帳號底下所有的IB, CL(不包含自己)
   * @apiVersion 0.1.0
   * @apiName getAllIBAndCLChildren
   * @apiGroup transactionList
   * @param {Number} accountNumber
   * @param {String} entity(UK/GM/UAE/MU/KY)
   * @param {String} sortKey
   * @param {String} sortVal
   * @param {String} searchVal
   * @param {Number} offset
   * @param {Number} limit
   * @return {Object} {totalCounts: number, children: [{ node_id: XXXXXX, ... },{ node_id: YYYYYY, ... }]} 
   * @example http://127.0.0.1:3006/v1/transactionList/100000?entity=KY&limit=10&offset=0&sortKey=node_id&sortVal=DESC
   */
  @Get(':accountNumber')
  async getAllIBAndCLChildren(@Param('accountNumber') accountNumber, @Query() query, @Res() res) {
    try {
      if (!this.checkEntity(query.entity)) {
        res.json({ code: 2015, message: '参数错误', data: 'entity incorrect!!' });
      }
      console.log(query);
      const result = await this.service
      .getAllIBAndCLChildren(accountNumber, query.entity, query.sortKey, query.sortVal, query.searchVal, query.limit, query.offset);
      res.json({ code: 1004, message: '数据查询成功', data: result });
      return result;
    } catch (err) {
      console.log(err);
      res.json({ code: 2019, message: '请求失败', data: err.message });
    }
  }
  /**
   * @author Zachary 2019/11/28
   * @api {get} /v1/transactionList/self/:accountNumber 取得一個主帳號的relationship資料
   * @apiVersion 0.1.0
   * @apiName getSelf
   * @apiGroup transactionList
   * @param {Number} accountNumber
   * @param {String} entity(UK/GM/UAE/MU/KY)
   * @return {Object} { node_id: accountNumber, ... }
   * @example http://127.0.0.1:3006/v1/transactionList/self/100000?entity=KY
   */
  @Get('self/:accountNumber')
  async getSelf(@Param('accountNumber') accountNumber, @Query() query, @Res() res) {
    try {
      if (!this.checkEntity(query.entity)) {
        res.json({ code: 2015, message: '参数错误', data: 'entity incorrect!!' });
      }
      const result = await this.service.getSelf(accountNumber, query.entity);
      res.json({ code: 1004, message: '数据查询成功', data: result });
      return result;
    } catch (err) {
      console.log(err);
      res.json({ code: 2019, message: '请求失败', data: err.message });
    }
  }
}
