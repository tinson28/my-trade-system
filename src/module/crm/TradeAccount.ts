import { Column, Entity } from 'typeorm';

@Entity('tradeAccount')
export class TradeAccount {
  @Column('int', { primary: true, name: 'Cln_ID' })
  clnId: number;

  @Column('int', { name: 'ATNumber', nullable: true })
  atNumber: number | null;

  @Column('varchar', { name: 'SaleforceId', nullable: true, length: 45 })
  saleforceId: string | null;

  @Column('varchar', { name: 'Entity', nullable: true, length: 10 })
  entity: string | null;

  @Column('varchar', { name: 'MtServer', nullable: true, length: 45 })
  mtServer: string | null;

  @Column('varchar', { name: 'MtAccType', nullable: true, length: 45 })
  mtAccType: string | null;

  @Column('varchar', { name: 'MtType', nullable: true, length: 10 })
  mtType: string | null;

  @Column('varchar', { name: 'MTGroup', nullable: true, length: 45 })
  mtGroup: string | null;

  @Column('varchar', { name: 'MtStatus', nullable: true, length: 45 })
  mtStatus: string | null;

  @Column('varchar', { name: 'MtCurrency', nullable: true, length: 10 })
  mtCurrency: string | null;

  @Column('varchar', { name: 'Agent', nullable: true, length: 45 })
  agent: string | null;

  @Column('varchar', { name: 'MtRemark', nullable: true, length: 100 })
  mtRemark: string | null;

  @Column('int', { name: 'Enable', nullable: true })
  enable: number | null;

  @Column('int', { name: 'Enable_ReadOnly', nullable: true })
  enableReadOnly: number | null;

  @Column('varchar', { name: 'UpdateBy', nullable: true, length: 45 })
  updateBy: string | null;

  @Column('int', { name: 'IsDeleted', nullable: true, default: () => '0' })
  isDeleted: number | null;

  @Column('varchar', { name: 'SalesNumber', nullable: true, length: 45 })
  salesNumber: string | null;

  @Column('varchar', { name: 'Depositlnd', nullable: true, length: 45 })
  depositlnd: string | null;

  @Column('varchar', { name: 'WithdrawalInd', nullable: true, length: 45 })
  withdrawalInd: string | null;

  @Column('varchar', { name: 'FundTransferInd', nullable: true, length: 45 })
  fundTransferInd: string | null;

  @Column('datetime', { name: 'FirstCommRevedDate', nullable: true })
  firstCommRevedDate: Date | null;

  @Column('datetime', { name: 'FirstDepositDate', nullable: true })
  firstDepositDate: Date | null;

  @Column('datetime', { name: 'FirstTradeDate', nullable: true })
  firstTradeDate: Date | null;

  @Column('datetime', { name: 'LastPositionDateTime', nullable: true })
  lastPositionDateTime: Date | null;

  @Column('double', { name: 'Balance', nullable: true, precision: 22 })
  balance: number | null;

  @Column('double', { name: 'Equity', nullable: true, precision: 22 })
  equity: number | null;

  @Column('double', { name: 'PL', nullable: true, precision: 22 })
  pl: number | null;

  @Column('int', { name: 'No_Of_Open_Position', nullable: true })
  noOfOpenPosition: number | null;

  @Column('double', {
    name: 'Lots_Of_Open_Position',
    nullable: true,
    precision: 22,
  })
  lotsOfOpenPosition: number | null;

  @Column('int', { name: 'No_Of_Close_Order', nullable: true })
  noOfCloseOrder: number | null;

  @Column('double', {
    name: 'Lots_Of_Close_Order',
    nullable: true,
    precision: 22,
  })
  lotsOfCloseOrder: number | null;

  @Column('tinyint', {
    name: 'InsertSynStatus',
    nullable: true,
    width: 1,
    default: () => '0',
  })
  insertSynStatus: boolean | null;

  @Column('tinyint', {
    name: 'UpdateSynStatus',
    nullable: true,
    width: 1,
    default: () => '0',
  })
  updateSynStatus: boolean | null;

  @Column('datetime', { name: 'Create_Date', nullable: true })
  createDate: Date | null;

  @Column('datetime', { name: 'Update_Date', nullable: true })
  updateDate: Date | null;

  @Column('varchar', { name: 'SpreadType', nullable: true, length: 45 })
  spreadType: string | null;

  @Column('int', { name: 'Leverage', nullable: true })
  leverage: number | null;

  @Column('varchar', { name: 'Area', nullable: true, length: 45 })
  area: string | null;

  @Column('varchar', { name: 'DemoInvestmentAmount', nullable: true, length: 45 })
  demoInvestmentAmount: string | null;
}
