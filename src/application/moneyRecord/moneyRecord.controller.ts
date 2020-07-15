import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { MoneyRecordService } from './moneyRecord.service';
import { PureController } from '../../@nt';

@Controller('moneyRecord')
export class MoneyRecordController extends PureController {
  constructor(protected readonly service: MoneyRecordService) {
    super(service);
  }

  /**
   * getMoneyRecord
   */
  @Get('getMoneyRecord')
  getMoneyRecord(@Query() query) {
    return this.service.getMoneyRecord(query);
  }

}
