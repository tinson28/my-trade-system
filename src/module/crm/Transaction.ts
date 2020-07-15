import { Column, Entity, Index } from 'typeorm';

@Index('INDEX_MT4', ['mt4Account'], {})
@Index('Index_CloseDate', ['closeDate'], {})
@Index('Index_Type', ['type'], {})
@Index('Index_SF', ['insertSynStatus', 'updateSynStatus', 'closeDate'], {})
@Index('Index_IS', ['insertSynStatus'], {})
@Index('Index_US', ['updateSynStatus'], {})
@Index('Index_CURRENCY', ['currency'], {})
@Index('Index_SFID', ['saleforceId'], {})
@Index('Index_DStage', ['dailyStage'], {})
@Index('Index_MStage', ['monthlyStage'], {})
@Index('Index_DS', ['deleteSynStatus'], {})
@Index('Index_BOS', ['lastUpdate'], {})
@Index('Index_BOS_INPUT_DATE', ['inputDate'], {})
@Index('Index_Apply', ['isBos'], {})
@Entity('transaction')
export class Transaction {
  @Column('bigint', { primary: true, name: 'id' })
  id: string;

  @Column('varchar', { primary: true, name: 'Ticket_No', length: 45 })
  ticketNo: string;

  @Column('int', { name: 'ATNumber', nullable: true })
  atNumber: number | null;

  @Column('varchar', { name: 'TYPE', nullable: true, length: 20 })
  type: string | null;

  @Column('varchar', { name: 'Amount', nullable: true, length: 30 })
  amount: string | null;

  @Column('datetime', { name: 'Close_Date', nullable: true })
  closeDate: Date | null;

  @Column('int', { name: 'MT4_Account', nullable: true })
  mt4Account: number | null;

  @Column('varchar', { name: 'COMMENT', nullable: true, length: 40 })
  comment: string | null;

  @Column('tinyint', {
    name: 'InsertSynStatus',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  insertSynStatus: boolean | null;

  @Column('tinyint', {
    name: 'UpdateSynStatus',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  updateSynStatus: boolean | null;

  @Column('varchar', { name: 'SaleforceId', nullable: true, length: 20 })
  saleforceId: string | null;

  @Column('varchar', { name: 'Daily_Stage', nullable: true, length: 30 })
  dailyStage: string | null;

  @Column('varchar', { name: 'Monthly_Stage', nullable: true, length: 30 })
  monthlyStage: string | null;

  @Column('varchar', { name: 'Currency', nullable: true, length: 30 })
  currency: string | null;

  @Column('double', { name: 'Exchange_Rate', nullable: true, precision: 22 })
  exchangeRate: number | null;

  @Column('varchar', { name: 'USD_Amount', nullable: true, length: 30 })
  usdAmount: string | null;

  @Column('tinyint', {
    name: 'DeleteSynStatus',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  deleteSynStatus: boolean | null;

  @Column('double', { name: 'To_Amt', nullable: true, precision: 22 })
  toAmt: number | null;

  @Column('varchar', { name: 'Bank_Ref_No', nullable: true, length: 30 })
  bankRefNo: string | null;

  @Column('int', { name: 'MT4_Ref_No', nullable: true })
  mt4RefNo: number | null;

  @Column('datetime', { name: 'Input_Date', nullable: true })
  inputDate: Date | null;

  @Column('char', { name: 'Curr_Status', nullable: true, length: 10 })
  currStatus: string | null;

  @Column('tinyint', { name: 'Reason', nullable: true })
  reason: number | null;

  @Column('char', { name: 'From_Ccy', nullable: true, length: 3 })
  fromCcy: string | null;

  @Column('decimal', {
    name: 'From_Amt',
    nullable: true,
    precision: 15,
    scale: 6,
  })
  fromAmt: string | null;

  @Column('decimal', { name: 'Rate', nullable: true, precision: 20, scale: 12 })
  rate: string | null;

  @Column('varchar', { name: 'Channel', nullable: true, length: 60 })
  channel: string | null;

  @Column('varchar', { name: 'Remark', nullable: true, length: 100 })
  remark: string | null;

  @Column('datetime', { name: 'Last_Update', nullable: true })
  lastUpdate: Date | null;

  @Column('varchar', { name: 'Process_By', nullable: true, length: 20 })
  processBy: string | null;

  @Column('decimal', {
    name: 'Fee',
    nullable: true,
    precision: 15,
    scale: 6,
    default: () => "'0.000000'",
  })
  fee: string | null;

  @Column('decimal', {
    name: 'Charge',
    nullable: true,
    precision: 15,
    scale: 6,
    default: () => "'0.000000'",
  })
  charge: string | null;

  @Column('char', { name: 'To_Ccy', nullable: true, length: 3 })
  toCcy: string | null;

  @Column('varchar', { name: 'Bank_Card_No', nullable: true, length: 30 })
  bankCardNo: string | null;

  @Column('varchar', { name: 'Beneficiary_Name', nullable: true, length: 60 })
  beneficiaryName: string | null;

  @Column('varchar', { name: 'Bank', nullable: true, length: 200 })
  bank: string | null;

  @Column('varchar', { name: 'SWIFT_Code', nullable: true, length: 30 })
  swiftCode: string | null;

  @Column('varchar', { name: 'Bank_Addr', nullable: true, length: 200 })
  bankAddr: string | null;

  @Column('varchar', { name: 'Withdrawal_Reason', nullable: true, length: 100 })
  withdrawalReason: string | null;

  @Column('varchar', { name: 'withdrawBy', nullable: true, length: 255 })
  withdrawBy: string | null;

  @Column('varchar', { name: 'Fee_Ind_min', nullable: true, length: 2 })
  feeIndMin: string | null;

  @Column('char', { name: 'Fee_Ind_order', nullable: true, length: 10 })
  feeIndOrder: string | null;

  @Column('varchar', { name: 'Approve_By', nullable: true, length: 20 })
  approveBy: string | null;

  @Column('decimal', {
    name: 'Mark_Up',
    nullable: true,
    precision: 15,
    scale: 6,
    default: () => "'0.000000'",
  })
  markUp: string | null;

  @Column('varchar', { name: 'Neteller_Email', nullable: true, length: 60 })
  netellerEmail: string | null;

  @Column('varchar', { name: 'Skrill_Email', nullable: true, length: 60 })
  skrillEmail: string | null;

  @Column('varchar', { name: 'NLWallet_Email', nullable: true, length: 60 })
  nlWalletEmail: string | null;

  @Column('varchar', { name: 'IBAN', nullable: true, length: 45 })
  iban: string | null;

  @Column('varchar', {
    name: 'Beneficiary_Address',
    nullable: true,
    length: 150,
  })
  beneficiaryAddress: string | null;

  @Column('varchar', { name: 'MPesa_Mobile', nullable: true, length: 45 })
  mPesaMobile: string | null;

  @Column('varchar', { name: 'CashU_Email', nullable: true, length: 60 })
  cashUEmail: string | null;

  @Column('tinyint', {
    name: 'Is_BOS',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  isBos: boolean | null;

  @Column('varchar', { name: 'SalesNumber', nullable: true, length: 45 })
  salesNumber: string | null;

  @Column('varchar', { name: 'Deposit_Type', nullable: true, length: 45 })
  depositType: string | null;

  @Column('varchar', { name: 'Cln_Name', nullable: true, length: 45 })
  clnName: string | null;

  @Column('datetime', { name: 'Create_Date', nullable: true })
  createDate: Date | null;

  @Column('varchar', { name: 'UpdateBy', nullable: true, length: 45 })
  updateBy: string | null;

  @Column('varchar', { name: 'CreateBy', nullable: true, length: 45 })
  createBy: string | null;

  @Column('varchar', { name: 'Country', nullable: true, length: 45 })
  country: string | null;

  @Column('varchar', { name: 'PspId', nullable: true, length: 45 })
  pspId: string | null;

  @Column('double', { name: 'Margin', nullable: true, precision: 22 })
  margin: number | null;

  @Column('double', { name: 'MarginFree', nullable: true, precision: 22 })
  marginFree: number | null;

  @Column('double', { name: 'MarginLevel', nullable: true, precision: 22 })
  marginLevel: number | null;

  @Column('varchar', { name: 'Source', nullable: true, length: 45 })
  source: string | null;

  @Column('double', { name: 'ReferRate', nullable: true, precision: 22 })
  referRate: number | null;

  @Column('varchar', { name: 'OpenOrders', nullable: true, length: 10 })
  openOrders: string | null;

  @Column('datetime', { name: 'Data_Date', nullable: true })
  dataDate: Date | null;

  @Column('varchar', { name: 'Entity', nullable: true, length: 45 })
  entity: string | null;

  @Column('varchar', { name: 'Agent', nullable: true, length: 45 })
  agent: string | null;
}
