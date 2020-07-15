import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConfigService, LoggerService } from '../../@nt';
import { Injectable, Param, Query } from '@nestjs/common';
import { LEADPRD } from '../../module/crm/leadPrd';

@Injectable()
export class LeadPrdService {

  constructor(
    private readonly logger: LoggerService,

    @InjectRepository(LEADPRD, 'crm')
    private leadPrd: Repository<LEADPRD>,
  ) { }

  async createLeadPrd(body) {
    return await this.leadPrd.createQueryBuilder()
      .insert()
      .values([
        {
          FIRSTNAME: body.firstName,
          LASTNAME: body.lastName,
          FULLNAME: body.firstName + body.lastName,
          EMAIL: body.email,
          ENTITY: body.entity,
          PHONE: body.phone,
          COUNTRY: body.country,
          CREATE_TIME: new Date(),
          EMAIL_LANGUAGE_LEAD__C: body.language,
        },
      ])
      .execute();
  }

  async updateLeadPrd(leadId, updateObj) {
    return await this.leadPrd.createQueryBuilder()
      .update()
      .set(updateObj)
      .where('id = :id', { id: leadId })
      .execute();
  }

  async constructLeadPrdObj(body) {
    const data = {};
    let needUpdate = false;
    if (body.firstName && body.lastName) {
      data['FIRSTNAME'] = body.firstName;
      data['LASTNAME'] = body.lastName;
      data['FULLNAME'] = body.firstName + body.lastName;
      needUpdate = true;
    }
    if (body.email) {
      data['EMAIL'] = body.email;
      needUpdate = true;
    }
    if (body.leverage) {
      data['DEMO_ACCOUNT_LEVERAGE__C'] = body.leverage;
      needUpdate = true;
    }
    if (body.login) {
      data['TRADING_ACCOUNT_NUMBER'] = body.login;
      needUpdate = true;
    }
    if (body.phoneAreaCode && body.phone) {
      data['PHONE'] = body.phoneAreaCode + body.phone;
      needUpdate = true;
    }
    if (body.currency) {
      data['DEMO_ACCOUNT_CURRENCY__C'] = body.currency;
      needUpdate = true;
    }
    if (body.tradeAccountType) {
      data['DEMO_ACCOUNT_TYPE__C'] = body.tradeAccountType;
      needUpdate = true;
    }
    if (body.lang) {
      data['EMAIL_LANGUAGE_LEAD__C'] = body.lang;
      needUpdate = true;
    }
    return { data, needUpdate };
  }
}
