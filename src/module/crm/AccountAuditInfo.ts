import { Column, Entity } from 'typeorm';

@Entity('account_audit_info')
export class AccountAuditInfo {
  @Column('varchar', { primary: true, name: 'ATNumber', length: 30 })
  atNumber: string;

  @Column('datetime', { name: 'ID1_UploadDate', nullable: true })
  id1UploadDate: Date | null;

  @Column('varchar', { name: 'ID1_Status', nullable: true, length: 45 })
  id1Status: string | null;

  @Column('datetime', { name: 'ID1_StatusDate', nullable: true })
  id1StatusDate: Date | null;

  @Column('varchar', { name: 'ID1_FirststAppBy', nullable: true, length: 45 })
  id1FirststAppBy: string | null;

  @Column('varchar', { name: 'ID1_SecondAppBy', nullable: true, length: 45 })
  id1SecondAppBy: string | null;

  @Column('varchar', { name: 'ID1_Remark', nullable: true, length: 200 })
  id1Remark: string | null;

  @Column('datetime', { name: 'IDExpiry', nullable: true })
  idExpiry: Date | null;

  @Column('varchar', { name: 'ID1_URL', nullable: true, length: 200 })
  id1Url: string | null;

  @Column('datetime', { name: 'ID2_UploadDate', nullable: true })
  id2UploadDate: Date | null;

  @Column('varchar', { name: 'ID2_Status', nullable: true, length: 45 })
  id2Status: string | null;

  @Column('datetime', { name: 'ID2_StatusDate', nullable: true })
  id2StatusDate: Date | null;

  @Column('varchar', { name: 'ID2_FirstAppBy', nullable: true, length: 45 })
  id2FirstAppBy: string | null;

  @Column('varchar', { name: 'ID2_SecondAppBy', nullable: true, length: 45 })
  id2SecondAppBy: string | null;

  @Column('varchar', { name: 'ID2_Remark', nullable: true, length: 200 })
  id2Remark: string | null;

  @Column('varchar', { name: 'ID2_URL', nullable: true, length: 200 })
  id2Url: string | null;

  @Column('datetime', { name: 'ID3_UploadDate', nullable: true })
  id3UploadDate: Date | null;

  @Column('varchar', { name: 'ID3_Status', nullable: true, length: 45 })
  id3Status: string | null;

  @Column('datetime', { name: 'ID3_StatusDate', nullable: true })
  id3StatusDate: Date | null;

  @Column('varchar', { name: 'ID3_FirstAppBy', nullable: true, length: 45 })
  id3FirstAppBy: string | null;

  @Column('varchar', { name: 'ID3_SecondAppBy', nullable: true, length: 45 })
  id3SecondAppBy: string | null;

  @Column('varchar', { name: 'ID3_Remark', nullable: true, length: 200 })
  id3Remark: string | null;

  @Column('varchar', { name: 'ID3_URL', nullable: true, length: 200 })
  id3Url: string | null;

  @Column('datetime', { name: 'Address1_UpdateDate', nullable: true })
  address1UpdateDate: Date | null;

  @Column('varchar', { name: 'Address1_Status', nullable: true, length: 45 })
  address1Status: string | null;

  @Column('datetime', { name: 'Address1_StatusDate', nullable: true })
  address1StatusDate: Date | null;

  @Column('varchar', { name: 'Address1_FirstBy', nullable: true, length: 45 })
  address1FirstBy: string | null;

  @Column('varchar', { name: 'Address1_SecondBy', nullable: true, length: 45 })
  address1SecondBy: string | null;

  @Column('varchar', { name: 'Address1_Remark', nullable: true, length: 200 })
  address1Remark: string | null;

  @Column('varchar', { name: 'Address1_URL', nullable: true, length: 200 })
  address1Url: string | null;

  @Column('datetime', { name: 'Address2_UpdateDate', nullable: true })
  address2UpdateDate: Date | null;

  @Column('varchar', { name: 'Address2_Status', nullable: true, length: 45 })
  address2Status: string | null;

  @Column('datetime', { name: 'Address2_StatusDate', nullable: true })
  address2StatusDate: Date | null;

  @Column('varchar', { name: 'Address2_FirstBy', nullable: true, length: 45 })
  address2FirstBy: string | null;

  @Column('varchar', { name: 'Address2_SecondBy', nullable: true, length: 45 })
  address2SecondBy: string | null;

  @Column('varchar', { name: 'Address2_Remark', nullable: true, length: 200 })
  address2Remark: string | null;

  @Column('varchar', { name: 'Address2_URL', nullable: true, length: 200 })
  address2Url: string | null;

  @Column('datetime', { name: 'Address3_UpdateDate', nullable: true })
  address3UpdateDate: Date | null;

  @Column('varchar', { name: 'Address3_Status', nullable: true, length: 45 })
  address3Status: string | null;

  @Column('datetime', { name: 'Address3_StatusDate', nullable: true })
  address3StatusDate: Date | null;

  @Column('varchar', { name: 'Address3_FirstBy', nullable: true, length: 45 })
  address3FirstBy: string | null;

  @Column('varchar', { name: 'Address3_SecondBy', nullable: true, length: 45 })
  address3SecondBy: string | null;

  @Column('varchar', { name: 'Address3_Remark', nullable: true, length: 200 })
  address3Remark: string | null;

  @Column('varchar', { name: 'Address3_URL', nullable: true, length: 200 })
  address3Url: string | null;

  @Column('varchar', { name: 'Bank1_Name', nullable: true, length: 100 })
  bank1Name: string | null;

  @Column('varchar', { name: 'Bank1_Beneficiary', nullable: true, length: 100 })
  bank1Beneficiary: string | null;

  @Column('varchar', { name: 'Bank1_CardNo', nullable: true, length: 100 })
  bank1CardNo: string | null;

  @Column('varchar', { name: 'Bank1_CardType', nullable: true, length: 100 })
  bank1CardType: string | null;

  @Column('varchar', { name: 'Bank1_BranchName', nullable: true, length: 100 })
  bank1BranchName: string | null;

  @Column('varchar', {
    name: 'Bank1_BranchProvince',
    nullable: true,
    length: 100,
  })
  bank1BranchProvince: string | null;

  @Column('varchar', { name: 'Bank1_BranchCity', nullable: true, length: 100 })
  bank1BranchCity: string | null;

  @Column('varchar', { name: 'Bank1_URL', nullable: true, length: 100 })
  bank1Url: string | null;

  @Column('varchar', { name: 'Bank1_IBAN', nullable: true, length: 100 })
  bank1Iban: string | null;

  @Column('varchar', { name: 'Bank1_SwiftCode', nullable: true, length: 100 })
  bank1SwiftCode: string | null;

  @Column('varchar', { name: 'Bank2_Name', nullable: true, length: 100 })
  bank2Name: string | null;

  @Column('varchar', { name: 'Bank2_Beneficiary', nullable: true, length: 100 })
  bank2Beneficiary: string | null;

  @Column('varchar', { name: 'Bank2_CardNo', nullable: true, length: 100 })
  bank2CardNo: string | null;

  @Column('varchar', { name: 'Bank2_CardType', nullable: true, length: 100 })
  bank2CardType: string | null;

  @Column('varchar', { name: 'Bank2_BranchName', nullable: true, length: 100 })
  bank2BranchName: string | null;

  @Column('varchar', {
    name: 'Bank2_BranchProvince',
    nullable: true,
    length: 100,
  })
  bank2BranchProvince: string | null;

  @Column('varchar', { name: 'Bank2_BranchCity', nullable: true, length: 100 })
  bank2BranchCity: string | null;

  @Column('varchar', { name: 'Bank2_URL', nullable: true, length: 100 })
  bank2Url: string | null;

  @Column('varchar', { name: 'Bank2_IBAN', nullable: true, length: 100 })
  bank2Iban: string | null;

  @Column('varchar', { name: 'Bank2_SwiftCode', nullable: true, length: 100 })
  bank2SwiftCode: string | null;

  @Column('varchar', { name: 'Bank3_Name', nullable: true, length: 100 })
  bank3Name: string | null;

  @Column('varchar', { name: 'Bank3_Beneficiary', nullable: true, length: 100 })
  bank3Beneficiary: string | null;

  @Column('varchar', { name: 'Bank3_CardNo', nullable: true, length: 100 })
  bank3CardNo: string | null;

  @Column('varchar', { name: 'Bank3_CardType', nullable: true, length: 100 })
  bank3CardType: string | null;

  @Column('varchar', { name: 'Bank3_BranchName', nullable: true, length: 100 })
  bank3BranchName: string | null;

  @Column('varchar', {
    name: 'Bank3_BranchProvince',
    nullable: true,
    length: 100,
  })
  bank3BranchProvince: string | null;

  @Column('varchar', { name: 'Bank3_BranchCity', nullable: true, length: 100 })
  bank3BranchCity: string | null;

  @Column('varchar', { name: 'Bank3_URL', nullable: true, length: 100 })
  bank3Url: string | null;

  @Column('varchar', { name: 'Bank3_IBAN', nullable: true, length: 100 })
  bank3Iban: string | null;

  @Column('varchar', { name: 'Bank3_SwiftCode', nullable: true, length: 100 })
  bank3SwiftCode: string | null;
}
