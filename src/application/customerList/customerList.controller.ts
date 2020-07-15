import { Controller, Get, Param, Query, Post, Body, Res } from '@nestjs/common';
import { CustomerListService } from './customerList.service';
import { PureController } from '../../@nt';
import moment = require('moment');

@Controller('customerList')
export class CustomerListController extends PureController {
  constructor(protected readonly service: CustomerListService) {
    super(service);
  }

  /**
   * @author Andy.Liao 2019-12-03
   * @description 用主帳號查詢CL列表
   * @apiVersion 0.1.0
   * @param accountNumber   主帳號
   * @param entity          牌照
   * @param sortKey          根據什麼欄位排序 node_id, parent_id, EQUITY, BALANCE
   * @param sortVal         ASC, DESC
   * @param limit           limit
   * @param offset          offset
   * @return {othersAccount, totalPages}
   */
  @Get()
  async getMasterAccount(@Query() query) {
    const accountNumber = query.accountNumber;
    const entity = query.entity;
    const sortKey = query.sortKey;
    const sortVal = query.sortVal;
    const offset = query.offset;
    const limit = query.limit;

    try {
      const startTime = moment().valueOf();
      const nodesBeforeProcess = await this.service.getCLAndTD(accountNumber, entity);
      // console.log(nodesBeforeProcess)
      let clNodes = nodesBeforeProcess.filter(x => x.acc_type === 'CL');
      const totalPages = clNodes.length;
      clNodes.forEach((cl) => {
        const id = parseInt(cl.node_id, 10);
        const re = new RegExp(`\/${id}(\/+|$)`);

        nodesBeforeProcess.filter(node => node.node_id.toString() !== id.toString() && re.test(node.path))
          .map((item) => {
            if (item.acc_type === 'TD') {
              cl.EQUITY += item.EQUITY;
              cl.BALANCE += item.BALANCE;
            }
          });

        if (cl.EQUITY === null) {
          cl.EQUITY = 0;
        }
        if (cl.BALANCE === null) {
          cl.BALANCE = 0;
        }
      });

      clNodes.sort((a, b) => {
        if (parseInt(a.node_id, 10) === accountNumber) {
          return -1;
        }
        if (parseInt(b.node_id, 10) === accountNumber) {
          return 1;
        }
        if (sortVal === 'ASC') {
          if (parseInt(a[sortKey], 10) > parseInt(b[sortKey], 10)) {
            return 1;
          }
          if (parseInt(a[sortKey], 10) < parseInt(b[sortKey], 10)) {
            return -1;
          }
          return 0;
        }
        if (sortVal === 'DESC') {
          if (parseInt(a[sortKey], 10) > parseInt(b[sortKey], 10)) {
            return -1;
          }
          if (parseInt(a[sortKey], 10) < parseInt(b[sortKey], 10)) {
            return 1;
          }
          return 0;
        }
        return 0;
      });

      if (offset) {
        clNodes = clNodes.splice(offset);
      }
      if (limit) {
        clNodes = clNodes.splice(0, limit);
      }

      const result = clNodes.map((cl) => {
        return {
          node_id: cl.node_id,
          parent_id: cl.parent_id,
          BALANCE: cl.BALANCE.toFixed(2),
          EQUITY: cl.EQUITY.toFixed(2),
        };
      });
      console.log('getCustomerList.请求开始:', startTime);
      const endTime = moment().valueOf();
      console.log('getCustomerList.请求结束:', endTime);
      console.log('getCustomerList.请求耗时:', endTime - startTime);
      return this.returnJson(1006, { othersAccount: result, totalPages });
    } catch (err) {
      return this.returnJson(2019, err.message);
    }
  }

  /**
   * @author Andy.Liao 2019-12-03
   * @description 用主帳號查詢交易帳號
   * @apiVersion 0.1.0
   * @param accountNumber   主帳號
   * @param entity          牌照
   * @return {node_id, parent_id, equity}
   */
  @Get('tradeAccounts')
  async getTradeAccounts(@Query() query) {
    const startTime = moment().valueOf();
    const accountNumber = query.accountNumber;
    const entity = query.entity;

    try {
      const tdResult = await this.service.getTradeAccount(
        accountNumber, entity,
      );
      console.log('getTradeAccounts.请求开始:', startTime);
      const endTime = moment().valueOf();
      console.log('getTradeAccounts.请求结束:', endTime);
      console.log('getTradeAccounts.请求耗时:', endTime - startTime);
      return this.returnJson(1006, tdResult);
    } catch (err) {
      return this.returnJson(2019, err.message);
    }
  }

}
