import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { IbListService } from './ibList.service';
import { PureController } from '../../@nt';
import moment = require('moment');

@Controller('ibList')
export class IbListController extends PureController {
  constructor(protected readonly service: IbListService) {
    super(service);
  }

  /**
   * @author Ben.Zhu 2020-04-14
   * @apiVersion 0.1.0
   * @param accountNumber   主帳號
   * @param entity          牌照
   * @param sortKey         根據什麼欄位排序 node_id, parent_id, BALANCE, agentCount, EQUITY, clientCount
   * @param sortVal         ASC, DESC
   * @param limit           limit
   * @param offset          offset
   * @return {masterAccount, totalPages, data}
   */
  @Get()
  async getIbList(@Query() query) {
    try {
      const startTime = moment().valueOf();
      const ibList = await this.service.getIbList(query);
      console.log('getIbList.请求开始:', startTime);
      const endTime = moment().valueOf();
      console.log('getIbList.请求结束:', endTime);
      console.log('getIbList.请求耗时:', endTime - startTime);
      return this.returnJson(1006, ibList);
    } catch (err) {
      return this.returnJson(2019, err.message);
    }
  }

  /**
   * @author Andy.Liao 2019-12-03
   * @apiVersion 0.1.0
   * @param accountNumber   主帳號
   * @param entity          牌照
   * @param sortKey         根據什麼欄位排序 node_id, parent_id, BALANCE, agentCount, EQUITY, clientCount
   * @param sortVal         ASC, DESC
   * @param limit           limit
   * @param offset          offset
   * @return {masterAccount, totalPages, data}
   */
  @Get('getMasterAccount')
  async getMasterAccount(@Query() query) {
    const accountNumber = query.accountNumber;
    const entity = query.entity;
    const sortKey = query.sortKey;
    const sortVal = query.sortVal;
    const offset = query.offset;
    const limit = query.limit;

    try {
      const nodesBeforeProcess = await this.service.getIBAndCLAndTD(accountNumber, entity);
      console.log(nodesBeforeProcess)

      const ibNodes = nodesBeforeProcess.filter(x => x.acc_type === 'IB');
      ibNodes.forEach((ib) => {
        const id = parseInt(ib.node_id, 10);
        let agentCount = 0;
        let clientCount = 0;
        const re = new RegExp(`\/${id}(\/+|$)`);

        nodesBeforeProcess.filter(node => node.node_id.toString() !== id.toString() && re.test(node.path))
          .map((item) => {
            if (item.acc_type === 'TD') {
              ib.BALANCE += item.BALANCE;
              ib.EQUITY += item.EQUITY;
              ib.MARGIN_FREE += item.MARGIN_FREE;
            } else if (item.acc_type === 'IB') {
              agentCount += 1;
            } else if (item.acc_type === 'CL') {
              clientCount += 1;
            }
          });
        ib['agentCount'] = agentCount;
        ib['clientCount'] = clientCount;
      });

      const masterAccount = ibNodes.filter(x => x.node_id.toString() === accountNumber.toString());
      // console.log('masterAccount', masterAccount)
      let othersAccount = ibNodes.filter(x => x.node_id.toString() !== accountNumber.toString());
      const totalPages = othersAccount.length;
      // console.log('totalPages', totalPages);

      othersAccount.sort((a, b) => {
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
        othersAccount = othersAccount.splice(offset);
      }
      if (limit) {
        othersAccount = othersAccount.splice(0, limit);
      }

      const masterData = masterAccount.map((ib) => {
        return {
          node_id: ib.node_id,
          parent_id: ib.parent_id,
          agentCount: ib.agentCount,
          clientCount: ib.clientCount,
          BALANCE: ib.BALANCE.toFixed(2),
          EQUITY: ib.EQUITY.toFixed(2),
          MARGIN_FREE: ib.MARGIN_FREE.toFixed(2),
        };
      });

      const data = othersAccount.map((ib) => {
        return {
          node_id: ib.node_id,
          parent_id: ib.parent_id,
          agentCount: ib.agentCount,
          clientCount: ib.clientCount,
          BALANCE: ib.BALANCE.toFixed(2),
          EQUITY: ib.EQUITY.toFixed(2),
          MARGIN_FREE: ib.MARGIN_FREE.toFixed(2),
        };
      });
      // console.log(masterData);
      return this.returnJson(1006, { masterAccount: masterData, totalPages, othersAccount: data });
    } catch (err) {
      return this.returnJson(2019, err.message);
    }
  }

}
