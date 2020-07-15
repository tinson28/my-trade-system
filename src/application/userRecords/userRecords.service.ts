import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import moment = require('moment');
import { Config } from 'nestjs-async-config';

import { mt4_sync_transfer_in } from '../../module/mt4/mt4_sync_transfer_in';
import { mt4_sync_transfer_out } from '../../module/mt4/mt4_sync_transfer_out';
import { mt4_sync_credit } from '../../module/mt4/mt4_sync_credit';
import { mt4_sync_deposit } from '../../module/mt4/mt4_sync_deposit';
import { mt4_sync_withdrawal } from '../../module/mt4/mt4_sync_withdrawal';
import { mt4_sync_order } from '../../module/mt4/mt4_sync_order';



@Injectable()
export class UserRecordsService {

  constructor(

    @InjectRepository(mt4_sync_deposit, 'mt4report') private mt4DepositRepository: Repository<mt4_sync_deposit>,
    @InjectRepository(mt4_sync_deposit, 'mt4report_demo') private mt4_demoDepositRepository: Repository<mt4_sync_deposit>,
    @InjectRepository(mt4_sync_deposit, 'mt5to4report') private mt5DepositRepository: Repository<mt4_sync_deposit>,
    @InjectRepository(mt4_sync_deposit, 'mt5to4report_demo') private mt5_demoDepositRepository: Repository<mt4_sync_deposit>,
    @InjectRepository(mt4_sync_deposit, 'mt4_s02') private mt4_s02DepositRepository: Repository<mt4_sync_deposit>,
    @InjectRepository(mt4_sync_deposit, 'mt4_s03') private mt4_s03DepositRepository: Repository<mt4_sync_deposit>,

    @InjectRepository(mt4_sync_withdrawal, 'mt4report') private mt4WithdrawalRepository: Repository<mt4_sync_withdrawal>,
    @InjectRepository(mt4_sync_withdrawal, 'mt4report_demo') private mt4_demoWithdrawalRepository: Repository<mt4_sync_withdrawal>,
    @InjectRepository(mt4_sync_withdrawal, 'mt5to4report') private mt5WithdrawalRepository: Repository<mt4_sync_withdrawal>,
    @InjectRepository(mt4_sync_withdrawal, 'mt5to4report_demo') private mt5_demoWithdrawalRepository: Repository<mt4_sync_withdrawal>,
    @InjectRepository(mt4_sync_withdrawal, 'mt4_s02') private mt4_s02WithdrawalRepository: Repository<mt4_sync_withdrawal>,
    @InjectRepository(mt4_sync_withdrawal, 'mt4_s03') private mt4_s03WithdrawalRepository: Repository<mt4_sync_withdrawal>,

    @InjectRepository(mt4_sync_transfer_in, 'mt4report') private mt4TransferInRepository: Repository<mt4_sync_transfer_in>,
    @InjectRepository(mt4_sync_transfer_in, 'mt4report_demo') private mt4_demoTransferInRepository: Repository<mt4_sync_transfer_in>,
    @InjectRepository(mt4_sync_transfer_in, 'mt5to4report') private mt5TransferInRepository: Repository<mt4_sync_transfer_in>,
    @InjectRepository(mt4_sync_transfer_in, 'mt5to4report_demo') private mt5_demoTransferInRepository: Repository<mt4_sync_transfer_in>,
    @InjectRepository(mt4_sync_transfer_in, 'mt4_s02') private mt4_s02TransferInRepository: Repository<mt4_sync_transfer_in>,
    @InjectRepository(mt4_sync_transfer_in, 'mt4_s03') private mt4_s03TransferInRepository: Repository<mt4_sync_transfer_in>,

    @InjectRepository(mt4_sync_transfer_out, 'mt4report') private mt4TransferOutRepository: Repository<mt4_sync_transfer_out>,
    @InjectRepository(mt4_sync_transfer_out, 'mt4report_demo') private mt4_demoTransferOutRepository: Repository<mt4_sync_transfer_out>,
    @InjectRepository(mt4_sync_transfer_out, 'mt5to4report') private mt5TransferOutRepository: Repository<mt4_sync_transfer_out>,
    @InjectRepository(mt4_sync_transfer_out, 'mt5to4report_demo') private mt5_demoTransferOutRepository: Repository<mt4_sync_transfer_out>,
    @InjectRepository(mt4_sync_transfer_out, 'mt4_s02') private mt4_s02TransferOutRepository: Repository<mt4_sync_transfer_out>,
    @InjectRepository(mt4_sync_transfer_out, 'mt4_s03') private mt4_s03TransferOutRepository: Repository<mt4_sync_transfer_out>,

    @InjectRepository(mt4_sync_credit, 'mt4report') private mt4CreditRepository: Repository<mt4_sync_credit>,
    @InjectRepository(mt4_sync_credit, 'mt4report_demo') private mt4_demoCreditRepository: Repository<mt4_sync_credit>,
    @InjectRepository(mt4_sync_credit, 'mt5to4report') private mt5CreditRepository: Repository<mt4_sync_credit>,
    @InjectRepository(mt4_sync_credit, 'mt5to4report_demo') private mt5_demoCreditRepository: Repository<mt4_sync_credit>,
    @InjectRepository(mt4_sync_credit, 'mt4_s02') private mt4_s02CreditRepository: Repository<mt4_sync_credit>,
    @InjectRepository(mt4_sync_credit, 'mt4_s03') private mt4_s03CreditRepository: Repository<mt4_sync_credit>,

    @InjectRepository(mt4_sync_order, 'mt4report') private mt4OrderRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4report_demo') private mt4_demoOrderRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt5to4report') private mt5OrderRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt5to4report_demo') private mt5_demoOrderRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4_s02') private mt4_s02OrderRepository: Repository<mt4_sync_order>,
    @InjectRepository(mt4_sync_order, 'mt4_s03') private mt4_s03OrderRepository: Repository<mt4_sync_order>,

    @Inject(Config) readonly config: Config,

  ) { }

  async userFundRecords(query: any) {
    const mtType = query.mtType || 'mt4';
    const tradeType = query.tradeType;
    const startDate = query.startDate || moment().startOf('day');
    const endDate = query.endDate || moment().endOf('day');
    const tradeAccount: any = query.tradeAccount;
    const limit = query.limit || 10;
    const offset = query.offset || 0;
    const sortKey = query.sortKey || 'Modify_Time';
    const sortVal = query.sortVal || 'DESC';
    let sWhere = '1 = 1';
    if (tradeAccount) {
      sWhere += ` and Login in (${tradeAccount.join(',')}) `;
    }
    if (startDate && endDate) {
      sWhere += ` and Modify_Time BETWEEN '${moment(startDate).format('YYYY-MM-DD HH:mm:ss')}'
       AND '${moment(endDate).format('YYYY-MM-DD HH:mm:ss')}' `;
    }
    const recordsPro = [];
    for (const ty of tradeType) {
      if (ty === 'deposit') {
        const depositPro = this[`${mtType}DepositRepository`].createQueryBuilder('depositOrder')
          .where(sWhere)
          .orderBy(sortKey, sortVal)
          .getMany();
        recordsPro.push(depositPro);
      } else if (ty === 'withdrawal') {
        const withPro = this[`${mtType}WithdrawalRepository`].createQueryBuilder('withdrawalOrder')
          .where(sWhere)
          .orderBy(sortKey, sortVal)
          .getMany();
        recordsPro.push(withPro);
      } else if (ty === 'crrdit') {
        const creditPro = this[`${mtType}CreditRepository`].createQueryBuilder('creditOrder')
          .where(sWhere)
          .orderBy(sortKey, sortVal)
          .getMany();
        recordsPro.push(creditPro);
      } else if (ty === 'transfer') {
        const transferInPro = this[`${mtType}TransferInRepository`].createQueryBuilder('transferIn')
          .where(sWhere)
          .orderBy(sortKey, sortVal)
          .getMany();
        const transferOutPro = this[`${mtType}TransferOutRepository`].createQueryBuilder('transferOut')
          .where(sWhere)
          .orderBy(sortKey, sortVal)
          .getMany();
        recordsPro.push(transferInPro, transferOutPro);
      }
    }
    return new Promise((resolve, reject) => {
      Promise.all(recordsPro).then((res) => {
        const finalRes = [];
        for (const row of res) {
          if (Boolean(row[0])) {
            for (const item of row) {
              finalRes.push(item);
            }
          }
        }
        resolve(finalRes);
      }).then((err) => {
        reject(err);
      });
    });
  }

  async userTradeRecords(query: any) {
    const mtType = query.mtType ? query.mtType.toLowerCase() : 'mt4';
    const startDate = query.startDate || '';
    const endDate = query.endDate || '';
    const searchKey = query.searchKey;
    const searchVal = query.searchVal || '';
    const limit = query.limit || 10;
    const offset = query.offset || 0;
    const sortKey = query.sortKey || 'Modify_Time';
    const sortVal = query.sortVal || 'DESC';
    const regex = query.regex;
    let sWhere = '1 = 1';
    if (searchVal) {
      if (searchKey === 'tradeAccount') {
        sWhere += regex === 'true' ? ` AND Login REGEXP ${searchVal} ` : ` AND Login = ${searchVal} `;
      } else if (searchKey === 'deal') {
        sWhere += regex === 'true' ? ` AND Login Ticket ${searchVal} ` : ` AND Ticket = ${searchVal} `;
      }
    }
    if (startDate && endDate) {
      sWhere += ` AND Modify_Time BETWEEN '${moment(parseInt(startDate)).format('YYYY-MM-DD HH:mm:ss')}'
      AND '${moment(parseInt(endDate)).format('YYYY-MM-DD HH:mm:ss')}' `;
    }
    try {
      const tradeRecords = await this[`${mtType}OrderRepository`].createQueryBuilder('order')
        .where(sWhere)
        .orderBy(sortKey, sortVal)
        .addOrderBy('Ticket', sortVal)
        .offset(offset)
        .limit(limit)
        .getMany();
      const recordCounts = await this[`${mtType}OrderRepository`].createQueryBuilder('order')
        .where(sWhere)
        .getCount();
      return { code: 1004, message: 'success', data: { tradeRecords, recordCounts } };
    } catch (error) {
      console.log(error);
      return { code: 2004, message: 'NetWork Error!', data: '' };
    }
  }


}
