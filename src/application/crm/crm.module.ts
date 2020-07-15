import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmService } from './crm.service';
import { CrmController } from './crm.controller';

import { Account } from '../../module/crm/Account';
import { AccountAuditInfo } from '../../module/crm/AccountAuditInfo';
import { AccountBankInfo } from '../../module/crm/AccountBankInfo';
import { TradeAccount } from '../../module/crm/TradeAccount';
import { Transaction } from '../../module/crm/Transaction';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      AccountAuditInfo,
      AccountBankInfo,
      TradeAccount,
      Transaction,
    ],                       'crm'),
  ],
  providers: [CrmService],
  controllers: [CrmController],
})
export class CrmModule {

}
