import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like, Between } from 'typeorm';

import { Account } from '../../module/crm/Account';
import { AccountAuditInfo } from '../../module/crm/AccountAuditInfo';
import { TradeAccount } from '../../module/crm/TradeAccount';
import { Transaction } from '../../module/crm/Transaction';
import { AccountBankInfo } from '../../module/crm/AccountBankInfo';
@Injectable()
export class CrmService {

  constructor(
    @InjectRepository(Account, 'crm') private crmAccount: Repository<Account>,
    // tslint:disable-next-line: max-line-length
    @InjectRepository(AccountAuditInfo, 'crm') private crmAccountInfo: Repository<AccountAuditInfo>,
    @InjectRepository(AccountBankInfo, 'crm')
    private crmAccountBankInfo: Repository<AccountBankInfo>,
    @InjectRepository(TradeAccount, 'crm') private crmTradeAccount: Repository<TradeAccount>,
    @InjectRepository(Transaction, 'crm') private crmTransaction: Repository<Transaction>,
  ) { }

  resJson(code, data = '', message?) {
    return { code, data, message };
  }

  async createCrmAccount(body: any) {
    try {
      const rowKeys = Object.keys(body);
      await this.crmAccount.createQueryBuilder()
                           .insert()
                           .into(Account, rowKeys)
                           .values([body])
                           .execute();
      return this.resJson(1001, '', 'account insert success');
    } catch (error) {
      console.log('service function: createCrmAccount', error);
      return this.resJson(2001, error, 'account insert error');
    }
  }

  async updateCrmAccount(accountNumber, entity, body) {
    try {
      await this.crmAccount.createQueryBuilder()
                           .update()
                           .set(body)
                           .where('ATNumber = :ATNumber and Entity = :Entity',
                                  { ATNumber: accountNumber, Entity: entity })
                           .execute();
      return this.resJson(1001, '', 'account update success');
    } catch (error) {
      console.log('service function: updateCrmAccount', error);
      return this.resJson(2001, error, 'account update error');
    }
  }

  async createCrmAccountBankInfo(body: any) {
    try {
      const rowKeys = Object.keys(body);
      await this.crmAccountBankInfo.createQueryBuilder()
                                .insert()
                                .into(AccountBankInfo, rowKeys)
                                .values([body])
                                .execute();
      return this.resJson(1001, '', 'account info insert success');
    } catch (error) {
      console.log('service function: createCrmAccountBankInfo', error);
      return this.resJson(2001, error, 'account info insert error');
    }
  }

  async createCrmTradeAccount(body: any) {
    try {
      const rowKeys = Object.keys(body);
      await this.crmTradeAccount.createQueryBuilder()
                                .insert()
                                .into(TradeAccount, rowKeys)
                                .values([body])
                                .execute();
      return this.resJson(1001, '', 'trade account insert success');
    } catch (error) {
      console.log('service function: createCrmTradeAccount', error);
      return this.resJson(2001, error, 'trade account insert error');
    }
  }

  async createCrmTransaction(body: any) {
    try {
      const rowKeys = Object.keys(body);
      await this.crmTransaction.createQueryBuilder()
                               .insert()
                               .into(Transaction, rowKeys)
                               .values([body])
                               .execute();
      return this.resJson(1001, '', 'transaction insert success');
    } catch (error) {
      console.log('service function: createCrmTransaction', error);
      return this.resJson(2001, error, 'transaction insert error');
    }
  }

  async updateCrmTransaction(body: any) {
    try {
      const opt = 'type = :type and bankRefNo = :bankRefNo';
      await this.crmTransaction.createQueryBuilder().update().set(body)
      .where(opt, { type: body.type, bankRefNo: body.bankRefNo }).execute();
      return this.resJson(1001, '', 'Transaction update success');
    } catch (error) {
      console.log('service function: updateTransaction', error);
      return this.resJson(2001, error, 'Transaction update error');
    }
  }

  async updateCrmData(body: any) {
    try {
      const model = this[`${body.modelName}`];
      let opt = null;
      let where = { };
      if (body.modelName === 'crmAccount') { // 更新主账号
        opt = 'ATNumber = :atNumber and entity = :entity';
        where = {
          atNumber: body.atNumber,
          entity: body.entity,
        };
      } else if (body.modelName === 'crmTradeAccount') { // 更新交易账户
        opt = 'ATNumber = :atNumber and entity = :entity and Cln_ID = :TradeAccount';
        where = {
          atNumber: body.atNumber,
          entity: body.entity,
          TradeAccount: body.tradeAccount,
        };
      } else if (body.modelName === 'crmAccountBankInfo') { // 更新银行账户
        opt = 'ATNumber = :atNumber and objectId = :objectId';
        where = {
          atNumber: body.atNumber,
          objectId: body.objectId,
        };
      }
      await model.createQueryBuilder().update().set(body.updateInfo).where(opt, where).execute();
      return this.resJson(1001, '', 'account update success');
    } catch (error) {
      console.log('service function: updateCrmAccount', error);
      return this.resJson(2001, error, 'account update error');
    }
  }
}
