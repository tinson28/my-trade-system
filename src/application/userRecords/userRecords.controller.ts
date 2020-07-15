import { Controller, Get, Query, Logger, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UserRecordsService } from './userRecords.service';
import { PureController } from '../../@nt';

@Controller('userRecords')
export class UserRecordsController extends PureController {
  constructor(protected readonly service: UserRecordsService) {
    super(service);
  }

  /**
   * @apiName query user's fund records
   * @author eric.du@newtype.io
   * @api {Post} /fundRecords/userFundRecords
   * @param mtType  mt4/mt5
   * @param tradeType 交易类型 {array} 交易类型
   * @param tradeAccount 交易账号 {array} 不填查所有
   * @param startDate 起始时间
   * @param endDate 结束时间
   * @param limit
   * @param offset
   * @param sortKey
   * @param sortVal
   * @Return {data, code, message}
   */
  @Get('userFundRecords')
  async userFundRecords(@Query() query, @Res() res) {
    await this.service.userFundRecords(query);
    // await this.service.userFundRecords(query).then((result) => {
    //   return res.status(HttpStatus.OK).json({
    //     code: 1004,
    //     message: 'query success',
    //     data: result,
    //   });
    // }).catch((err) => {
    //   console.log(err);
    //   return res.status(HttpStatus.REQUEST_TIMEOUT).json({
    //     code: 2004,
    //     message: 'connect timeout',
    //     data: [],
    //   });
    // });
  }

  @Get('userTradeRecords')
  async userTradeRecords(@Query() query, @Res() res) {
    const result = await this.service.userTradeRecords(query);
    return res.status(HttpStatus.OK).json({
      code: result.code,
      message: result.message,
      data: result.data,
    });
  }
}
