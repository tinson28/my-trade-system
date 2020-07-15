import { Column, Entity } from 'typeorm';

@Entity('lead_prd')
export class LEADPRD {

  @Column('integer', {
    generated: true,
    nullable: false,
    primary: true,
    name: 'id',
  })
  ID: number;

  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 40,
    name: 'first_name',
  })
  FIRSTNAME: string;

  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 40,
    name: 'last_name',
  })
  LASTNAME: string;

  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 80,
    name: 'email',
  })
  EMAIL: string;

  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 40,
    name: 'Demo_Account_Leverage__c',
  })
  DEMO_ACCOUNT_LEVERAGE__C: string;

  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 5,
    name: 'Entity',
  })
  ENTITY: string;

  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 80,
    name: 'full_name',
  })
  FULLNAME: string;

  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 40,
    name: 'Trading_Account_Number',
  })
  TRADING_ACCOUNT_NUMBER: string;

  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 30,
    name: 'phone',
  })
  PHONE: string;

  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 40,
    name: 'country',
  })
  COUNTRY: string;

  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 40,
    name: 'Demo_Account_Type__c',
  })
  DEMO_ACCOUNT_TYPE__C: string;

  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 40,
    name: 'Demo_Account_Currency__c',
  })
  DEMO_ACCOUNT_CURRENCY__C: string;

  @Column('datetime', {
    nullable: false,
    name: 'Create_Time',
  })
  CREATE_TIME: Date;

  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 15,
    name: 'Email_language_lead__c',
  })
  EMAIL_LANGUAGE_LEAD__C: string;

}
