import { Column, Entity } from 'typeorm';

@Entity('account')
export class Account {
  @Column('int', { primary: true, name: 'ATNumber' })
  atNumber: number;

  @Column('varchar', { name: 'LeadId', nullable: true, length: 45 })
  leadId: string | null;

  @Column('varchar', { name: 'AccountId', nullable: true, length: 45 })
  accountId: string | null;

  @Column('varchar', { name: 'Email', nullable: true, length: 80 })
  email: string | null;

  @Column('varchar', { name: 'Phone', nullable: true, length: 30 })
  phone: string | null;

  @Column('varchar', { name: 'Addr', nullable: true, length: 200 })
  addr: string | null;

  @Column('varchar', { name: 'Entity', nullable: true, length: 45 })
  entity: string | null;

  @Column('varchar', { name: 'KycStatus', nullable: true, length: 45 })
  kycStatus: string | null;

  @Column('varchar', { name: 'FirstName', nullable: true, length: 45 })
  firstName: string | null;

  @Column('varchar', { name: 'LastName', nullable: true, length: 45 })
  lastName: string | null;

  @Column('datetime', { name: 'Create_Date', nullable: true })
  createDate: Date | null;

  @Column('datetime', { name: 'Modify_Date', nullable: true })
  modifyDate: Date | null;

  @Column('int', { name: 'Agent', nullable: true })
  agent: number | null;

  @Column('varchar', { name: 'Gender', nullable: true, length: 1 })
  gender: string | null;

  @Column('datetime', { name: 'Birth_Date', nullable: true })
  birthDate: Date | null;

  @Column('varchar', { name: 'AA_Number', nullable: true, length: 30 })
  aaNumber: string | null;

  @Column('varchar', { name: 'AFF_ID', nullable: true, length: 45 })
  affId: string | null;

  @Column('varchar', { name: 'CXD_token', nullable: true, length: 256 })
  cxdToken: string | null;

  @Column('varchar', { name: 'Email_language', nullable: true, length: 15 })
  emailLanguage: string | null;

  @Column('varchar', { name: 'Browser', nullable: true, length: 45 })
  browser: string | null;

  @Column('varchar', { name: 'Brower_Language', nullable: true, length: 45 })
  browerLanguage: string | null;

  @Column('varchar', { name: 'Landing_Page', nullable: true, length: 45 })
  landingPage: string | null;

  @Column('varchar', {
    name: 'Landing_Page_Language',
    nullable: true,
    length: 45,
  })
  landingPageLanguage: string | null;

  @Column('varchar', { name: 'Account_Type', nullable: true, length: 10 })
  accountType: string | null;

  @Column('varchar', { name: 'LeadSource', nullable: true, length: 255 })
  leadSource: string | null;

  @Column('varchar', { name: 'Company', nullable: true, length: 45 })
  company: string | null;

  @Column('varchar', { name: 'Country_Code', nullable: true, length: 10 })
  countryCode: string | null;

  @Column('varchar', { name: 'CountryOfResidence', nullable: true, length: 45 })
  countryOfResidence: string | null;

  @Column('varchar', { name: 'DocIssuingCountry', nullable: true, length: 45 })
  docIssuingCountry: string | null;

  @Column('varchar', { name: 'City', nullable: true, length: 45 })
  city: string | null;

  @Column('varchar', { name: 'Sales', nullable: true, length: 45 })
  sales: string | null;

  @Column('int', { name: 'SalesNumber', nullable: true })
  salesNumber: number | null;

  @Column('varchar', { name: 'Cln_Name', nullable: true, length: 45 })
  clnName: string | null;

  @Column('datetime', { name: 'Activated_Date', nullable: true })
  activatedDate: Date | null;

  @Column('datetime', { name: 'Apply_CreateDate', nullable: true })
  applyCreateDate: Date | null;

  @Column('varchar', { name: 'Area_Code', nullable: true, length: 45 })
  areaCode: string | null;

  @Column('varchar', { name: 'Area_Name', nullable: true, length: 45 })
  areaName: string | null;

  @Column('varchar', { name: 'Currency', nullable: true, length: 10 })
  currency: string | null;

  @Column('varchar', { name: 'Doc_No', nullable: true, length: 30 })
  docNo: string | null;

  @Column('varchar', { name: 'Doc_Type', nullable: true, length: 3 })
  docType: string | null;

  @Column('datetime', { name: 'Doc_Expiry_Date', nullable: true })
  docExpiryDate: Date | null;

  @Column('varchar', { name: 'Doc_Front_Img', nullable: true, length: 100 })
  docFrontImg: string | null;

  @Column('varchar', { name: 'Doc_Back_Img', nullable: true, length: 100 })
  docBackImg: string | null;

  @Column('varchar', { name: 'Referrer_Code', nullable: true, length: 45 })
  referrerCode: string | null;

  @Column('varchar', { name: 'Referrer_Group', nullable: true, length: 10 })
  referrerGroup: string | null;

  @Column('varchar', { name: 'Referrer_Type', nullable: true, length: 10 })
  referrerType: string | null;

  @Column('varchar', { name: 'Registered_IP', nullable: true, length: 45 })
  registeredIp: string | null;

  @Column('varchar', { name: 'Registered_Country', nullable: true, length: 45 })
  registeredCountry: string | null;

  @Column('varchar', { name: 'Registered_City', nullable: true, length: 45 })
  registeredCity: string | null;

  @Column('varchar', { name: 'Check_By', nullable: true, length: 45 })
  checkBy: string | null;

  @Column('varchar', { name: 'Process_By', nullable: true, length: 45 })
  processBy: string | null;

  @Column('varchar', { name: 'UTM_Campaign', nullable: true, length: 100 })
  utmCampaign: string | null;

  @Column('varchar', { name: 'UTM_Content', nullable: true, length: 45 })
  utmContent: string | null;

  @Column('varchar', { name: 'UTM_Medium', nullable: true, length: 45 })
  utmMedium: string | null;

  @Column('varchar', { name: 'UTM_Source', nullable: true, length: 45 })
  utmSource: string | null;

  @Column('varchar', { name: 'UTM_Term', nullable: true, length: 45 })
  utmTerm: string | null;

  @Column('int', { name: 'IB_Code', nullable: true })
  ibCode: number | null;

  @Column('varchar', { name: 'IB_Link', nullable: true, length: 100 })
  ibLink: string | null;

  @Column('varchar', { name: 'Parent_IB_Code', nullable: true, length: 45 })
  parentIbCode: string | null;

  @Column('int', { name: 'Parent_Cln_ID', nullable: true })
  parentClnId: number | null;

  @Column('varchar', {
    name: 'Has_Trading_Experience',
    nullable: true,
    length: 5,
  })
  hasTradingExperience: string | null;

  @Column('varchar', { name: 'Is_BlackList', nullable: true, length: 5 })
  isBlackList: string | null;

  @Column('varchar', { name: 'Beneficiary_Name', nullable: true, length: 45 })
  beneficiaryName: string | null;

  @Column('varchar', { name: 'DemoSpreadType', nullable: true, length: 45 })
  demoSpreadType: string | null;

  @Column('tinyint', { name: 'InsertSynStatus', nullable: true })
  insertSynStatus: number | null;

  @Column('tinyint', { name: 'UpdateSynStatus', nullable: true })
  updateSynStatus: number | null;

  @Column('decimal', {
    name: 'Balance',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  balance: string | null;

  @Column('decimal', {
    name: 'Equity',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  equity: string | null;

  @Column('int', { name: 'SumCloseOrder', nullable: true })
  sumCloseOrder: number | null;

  @Column('varchar', { name: 'RiskLevel', nullable: true, length: 45 })
  riskLevel: string | null;

  @Column('datetime', { name: 'FirstCreateDateLive', nullable: true })
  firstCreateDateLive: Date | null;

  @Column('datetime', { name: 'FirstCreateDateDemo', nullable: true })
  firstCreateDateDemo: Date | null;

  @Column('datetime', { name: 'FirstCommRevedDate', nullable: true })
  firstCommRevedDate: Date | null;

  @Column('datetime', { name: 'FirstDepositDate', nullable: true })
  firstDepositDate: Date | null;

  @Column('datetime', { name: 'FirstTradeDate', nullable: true })
  firstTradeDate: Date | null;

  @Column('varchar', { name: 'PrefixPhone', nullable: true, length: 10 })
  prefixPhone: string | null;
}
