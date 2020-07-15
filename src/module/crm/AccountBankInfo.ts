import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('account_bank_info')
export class AccountBankInfo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'ObjectID', nullable: true, length: 100 })
  objectId: string | null;

  @Column('int', { name: 'ATNumber', nullable: true })
  atNumber: number | null;

  @Column('int', { name: 'Ranking', nullable: true })
  ranking: number | null;

  @Column('varchar', { name: 'SaleforceID', nullable: true, length: 45 })
  saleforceId: string | null;

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

  @Column('varchar', { name: 'Type', nullable: true, length: 45 })
  type: string | null;

  @Column('varchar', { name: 'BeneficiaryName', nullable: true, length: 100 })
  beneficiaryName: string | null;

  @Column('varchar', { name: 'Bank', nullable: true, length: 100 })
  bank: string | null;

  @Column('varchar', { name: 'BankCardType', nullable: true, length: 45 })
  bankCardType: string | null;

  @Column('varchar', { name: 'BankCardNo', nullable: true, length: 45 })
  bankCardNo: string | null;

  @Column('varchar', { name: 'BankAccountNo', nullable: true, length: 45 })
  bankAccountNo: string | null;

  @Column('varchar', { name: 'BranchName', nullable: true, length: 45 })
  branchName: string | null;

  @Column('varchar', { name: 'BranchProvince', nullable: true, length: 45 })
  branchProvince: string | null;

  @Column('varchar', { name: 'BranchCity', nullable: true, length: 45 })
  branchCity: string | null;

  @Column('varchar', { name: 'BankCardImg', nullable: true, length: 200 })
  bankCardImg: string | null;

  @Column('varchar', { name: 'Channel', nullable: true, length: 45 })
  channel: string | null;

  @Column('varchar', { name: 'Channel_Type', nullable: true, length: 45 })
  channelType: string | null;

  @Column('varchar', { name: 'PayAccount', nullable: true, length: 45 })
  payAccount: string | null;

  @Column('varchar', { name: 'IdNumber', nullable: true, length: 45 })
  idNumber: string | null;

  @Column('varchar', { name: 'CountryCode', nullable: true, length: 45 })
  countryCode: string | null;

  @Column('varchar', { name: 'BeneficiaryAddress', nullable: true, length: 45 })
  beneficiaryAddress: string | null;

  @Column('varchar', { name: 'IBAN', nullable: true, length: 45 })
  iban: string | null;

  @Column('varchar', { name: 'SWIFTCode', nullable: true, length: 45 })
  swiftCode: string | null;

  @Column('int', { name: 'IsDelete', nullable: true, default: () => "'0'" })
  isDelete: number | null;
}
