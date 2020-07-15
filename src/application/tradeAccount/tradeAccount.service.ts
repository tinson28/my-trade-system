import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as _ from 'underscore';
import { mt4_users } from '../../module/mt4/mt4_users';
import { relationship } from '../../module/relationship/relationship';

import { MtEventService } from '../mtevent/mtevent.service';

@Injectable()
export class TradeAccountService {

  constructor(
    @InjectRepository(mt4_users, 'mt5to4report') private mt5Users: Repository<mt4_users>,
    @InjectRepository(mt4_users, 'mt4report') private mt4Users: Repository<mt4_users>,
    @InjectRepository(mt4_users, 'mt5to4report_demo') private mt5_deomUsers: Repository<mt4_users>,
    @InjectRepository(mt4_users, 'mt4report_demo') private mt4_demoUsers: Repository<mt4_users>,
    @InjectRepository(mt4_users, 'mt4_s02') private mt4_s02Users: Repository<mt4_users>,
    @InjectRepository(mt4_users, 'mt4_s03') private mt4_s03Users: Repository<mt4_users>,

    @InjectRepository(relationship, 'relationship') private relationshipModel: Repository<relationship>,

    private readonly mtservice: MtEventService,
  ) { }


  async getMaxTradeAccount(body) {

    try {
      let { entity, mtName, prefix, accountLength } = body;
      let tradeAccount: number = 0;
      let targetBaseId = parseInt(body.targetBaseId || 0, 10);

      mtName = mtName ? mtName.toLowerCase() : 'mt4';
      entity = entity || 'KY';

      // 获取指定前缀最大交易账号 并+1返回
      let maxNodeId = await this.relationshipModel.createQueryBuilder()
                                                    .select('MAX(node_id) + 1', 'maxTradeAccount')
                                                    .where('acc_type = "TD"')
                                                    .andWhere('node_id like :prefix', { prefix: `${prefix}%` })
                                                    .andWhere('length(node_id) = :accountLength', { accountLength })
                                                    .andWhere('entity = :entity', { entity })
                                                    .andWhere('node_id > :targetBaseId', { targetBaseId })
                                                    .getRawOne();
      // 不存在 创建为前缀加001的账号
      if (maxNodeId.maxTradeAccount === null && targetBaseId === 0) {

        let content = accountLength === 8 ? '00001' : '000001';
        tradeAccount = parseInt(`${prefix}${content}`, 10);

      } else if (maxNodeId.maxTradeAccount !== null) {
        tradeAccount = parseInt(maxNodeId.maxTradeAccount, 10);
      }

      // 手动输入
      if (targetBaseId !== 0) {
        tradeAccount = targetBaseId;
      }

      if (tradeAccount) {

        // 查询mt?users 是否存在生成后的账号
        let isSetTradeAccount = await this[`${mtName.toLowerCase()}Users`].findOne({
          select: ['LOGIN'],
          where: { LOGIN: tradeAccount },
        });

        // 存在重新生成交易账号
        if (typeof isSetTradeAccount !== 'undefined') {
          if (`${isSetTradeAccount.LOGIN}` === `${tradeAccount}`) {
            body.targetBaseId = tradeAccount + 1;
            return await this.getMaxTradeAccount(body);
          }
        }

      }

      return { message: 'ok', tradeAccount };

    } catch (error) {
      return { message: error };
    }
  }

  async checkTradeAccountActive(body) {
    try {
      let queryList = Object.create(null);
      let tradeMtList = Object.keys(_.groupBy(body.queryList, 'mtName'));

      for (const item of tradeMtList) {
        queryList[item] = [];
        for(let i of body.queryList) {
          if(i.mtName.toLowerCase() === item.toLowerCase()) {
            queryList[item].push(i.id);
          }
        }
      }
      let rets = Object.create(null);
      for(const itemb of tradeMtList) {
        rets[itemb] = await this[`${itemb}Users`].find({
          select: ['LOGIN', 'ENABLE_READONLY', 'ENABLE'],
          where: {
            LOGIN: In(queryList[itemb]),
          },
        });
        _.each(rets[itemb], (v) => {
          if (v['ENABLE'] === 1 && v['ENABLE_READONLY'] === 0) {
            v['active'] = true;
          } else {
            v['active'] = false;
          }

          _.map(body.queryList, (originalItem) => {
            if (originalItem.id === parseInt(v['LOGIN'], 0)) {
              originalItem.active = v['active'];
            }
          });
        });
      }
      return { code: 1004, message: 'Success!', ret: body.queryList };
    } catch (e) {
      return { code: 2004, message: e.message, data: '' };
    }
  }

  async updateManyMtTradeAccount(data) {
    try {
      for await(let item of data) {
        this.mtservice.accountModify(item);
      }
    } catch (error) {
      throw new Error(error);
    }

  }
}
