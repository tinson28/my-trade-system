import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('campaign_lead', { schema: 'datawarehouse_two' })
export class CampaignLead {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('text', { name: 'Name', nullable: true })
  name: string | null;

  @Column('varchar', { name: 'Apply_Country__c', nullable: true, length: 40 })
  applyCountryC: string | null;

  @Column('varchar', {
    name: 'Campaign_Purpose__c',
    nullable: true,
    length: 50,
  })
  campaignPurposeC: string | null;

  @Column('datetime', { name: 'StartDate', nullable: true })
  startDate: Date | null;

  @Column('datetime', { name: 'EndDate', nullable: true })
  endDate: Date | null;

  @Column('datetime', { name: 'Live_Date__c', nullable: true })
  liveDateC: Date | null;

  @Column('datetime', { name: 'Off_Shelf_Date__c', nullable: true })
  offShelfDateC: Date | null;

  @Column('varchar', {
    name: 'Marketing_Material_Languages__c',
    nullable: true,
    length: 30,
  })
  marketingMaterialLanguagesC: string | null;

  @Column('varchar', { name: 'Source__c', nullable: true, length: 50 })
  sourceC: string | null;

  @Column('varchar', { name: 'Medium__c', nullable: true, length: 50 })
  mediumC: string | null;

  @Column('varchar', { name: 'Term__c', nullable: true, length: 255 })
  termC: string | null;

  @Column('varchar', { name: 'Content__c', nullable: true, length: 255 })
  contentC: string | null;

  @Column('varchar', {
    name: 'Landing_Page_URL__c',
    nullable: true,
    length: 500,
  })
  landingPageUrlC: string | null;

  @Column('varchar', { name: 'Owner__c', nullable: true, length: 50 })
  ownerC: string | null;

  @Column('varchar', { name: 'Programe_Name__c', nullable: true, length: 100 })
  programeNameC: string | null;

  @Column('varchar', { name: 'Email__c', nullable: true, length: 80 })
  emailC: string | null;

  @Column('varchar', { name: 'Phone__c', nullable: true, length: 50 })
  phoneC: string | null;

  @Column('varchar', { name: 'ATFX_Country__c', nullable: true, length: 20 })
  atfxCountryC: string | null;

  @Column('varchar', {
    name: 'Registered_Country__c',
    nullable: true,
    length: 80,
  })
  registeredCountryC: string | null;

  @Column('varchar', {
    name: 'Registered_City__c',
    nullable: true,
    length: 255,
  })
  registeredCityC: string | null;

  @Column('varchar', { name: 'Registered_IP__c', nullable: true, length: 40 })
  registeredIpC: string | null;

  @Column('varchar', {
    name: 'Landing_Page_Id__c',
    nullable: true,
    length: 255,
  })
  landingPageIdC: string | null;

  @Column('varchar', { name: 'UTM_Campaign__c', nullable: true, length: 255 })
  utmCampaignC: string | null;

  @Column('varchar', { name: 'UTM_Source__c', nullable: true, length: 255 })
  utmSourceC: string | null;

  @Column('varchar', { name: 'UTM_Term__c', nullable: true, length: 255 })
  utmTermC: string | null;

  @Column('varchar', { name: 'UTM_Medium__c', nullable: true, length: 255 })
  utmMediumC: string | null;

  @Column('varchar', { name: 'UTM_Content__c', nullable: true, length: 255 })
  utmContentC: string | null;

  @Column('varchar', { name: 'AA_Number__c', nullable: true, length: 30 })
  aaNumberC: string | null;

  @Column('varchar', { name: 'Lead_ID__c', nullable: true, length: 20 })
  leadIdC: string | null;

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

  @Column('tinyint', {
    name: 'DeleteSynStatus',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  deleteSynStatus: boolean | null;

  @Column('varchar', {
    name: 'Application_Page__c',
    nullable: true,
    length: 255,
  })
  applicationPageC: string | null;

  @Column('varchar', { name: 'First_Name__c', nullable: true, length: 60 })
  firstNameC: string | null;

  @Column('varchar', { name: 'Last_Name__c', nullable: true, length: 60 })
  lastNameC: string | null;

  @Column('varchar', { name: 'SaleforceId', nullable: true, length: 20 })
  saleforceId: string | null;

  @Column('varchar', { name: 'Seminar_City__c', nullable: true, length: 100 })
  seminarCityC: string | null;

  @Column('varchar', { name: 'Campaign_Name__c', nullable: true, length: 255 })
  campaignNameC: string | null;

  @Column('datetime', { name: 'Registrant_Date__c', nullable: true })
  registrantDateC: Date | null;

  @Column('varchar', { name: 'Platform__c', nullable: true, length: 255 })
  platformC: string | null;

  @Column('varchar', { name: 'Entity__c', nullable: true, length: 60 })
  entityC: string | null;

  @Column('varchar', { name: 'AFF_ID__c', nullable: true, length: 60 })
  affIdC: string | null;

  @Column('varchar', { name: 'CXD_token__c', nullable: true, length: 60 })
  cxdTokenC: string | null;

  @Column('varchar', { name: 'lead_source__c', nullable: true, length: 100 })
  leadSourceC: string | null;

  @Column('varchar', { name: 'Referrer_Code__c', nullable: true, length: 50 })
  referrerCodeC: string | null;

  @Column('varchar', { name: 'Referrer_Type__c', nullable: true, length: 18 })
  referrerTypeC: string | null;

  @Column('varchar', { name: 'Referrer_Group__c', nullable: true, length: 18 })
  referrerGroupC: string | null;

  @Column('varchar', {
    name: 'Country_of_Residence_Lead__c',
    nullable: true,
    length: 30,
  })
  countryOfResidenceLeadC: string | null;

  @Column('varchar', {
    name: 'Browser_language_Lead__c',
    nullable: true,
    length: 30,
  })
  browserLanguageLeadC: string | null;

  @Column('varchar', {
    name: 'Email_language_lead__c',
    nullable: true,
    length: 18,
  })
  emailLanguageLeadC: string | null;

  @Column('varchar', {
    name: 'Refer_Friend_Account__c',
    nullable: true,
    length: 120,
  })
  referFriendAccountC: string | null;

  @Column('varchar', {
    name: 'Landing_Page_Language__c',
    nullable: true,
    length: 18,
  })
  landingPageLanguageC: string | null;

  @Column('bit', { name: 'Affiliate_Entity__c', nullable: true })
  affiliateEntityC: boolean | null;

  @Column('varchar', {
    name: 'Demo_Account_Balance__c',
    nullable: true,
    length: 18,
  })
  demoAccountBalanceC: string | null;

  @Column('varchar', {
    name: 'Demo_Account_Leverage__c',
    nullable: true,
    length: 18,
  })
  demoAccountLeverageC: string | null;

  @Column('varchar', {
    name: 'Demo_Account_Type__c',
    nullable: true,
    length: 18,
  })
  demoAccountTypeC: string | null;

  @Column('varchar', {
    name: 'Demo_Account_Currency__c',
    nullable: true,
    length: 18,
  })
  demoAccountCurrencyC: string | null;

  @Column('varchar', {
    name: 'Demo_Spread_Type__c',
    nullable: true,
    length: 18,
  })
  demoSpreadTypeC: string | null;

  @Column('varchar', {
    name: 'ATFX_Hidden_Country__c',
    nullable: true,
    length: 18,
  })
  atfxHiddenCountryC: string | null;

  @Column('datetime', { name: 'Create_Date__c', nullable: true })
  createDateC: Date | null;

  @Column('varchar', {
    name: 'gaconnector_Country__c',
    nullable: true,
    length: 60,
  })
  gaconnectorCountryC: string | null;

  @Column('varchar', {
    name: 'gaconnector_City__c',
    nullable: true,
    length: 60,
  })
  gaconnectorCityC: string | null;

  @Column('varchar', { name: 'Description__c', nullable: true, length: 200 })
  descriptionC: string | null;

  @Column('bit', { name: 'collaborating_with_booker__c', nullable: true })
  collaboratingWithBookerC: boolean | null;

  @Column('varchar', {
    name: 'potential_clients__c',
    nullable: true,
    length: 200,
  })
  potentialClientsC: string | null;

  @Column('varchar', {
    name: 'gaconnector_IP_Address__c',
    nullable: true,
    length: 30,
  })
  gaconnectorIpAddressC: string | null;

  @Column('bit', { name: 'Is_Duplicated_Lead__c', nullable: true })
  isDuplicatedLeadC: boolean | null;

  @Column('varchar', { name: 'Coaching_Date__c', nullable: true, length: 40 })
  coachingDateC: string | null;

  @Column('varchar', { name: 'Coaching_Time__c', nullable: true, length: 40 })
  coachingTimeC: string | null;
}
