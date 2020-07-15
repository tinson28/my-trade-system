import { Controller, Get, Param, Query, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { LeadPrdService } from './leadPrd.service';
import { PureController, LoggerService } from '../../@nt';

@Controller('leadPrd')
export class LeadPrdController extends PureController {
  constructor(
    private readonly logger: LoggerService,
    protected readonly service: LeadPrdService,
  ) {
    super(service);
  }

  /**
   * @api {post} /lead_prd 開戶時將Demo用戶資料寫入lead_prd
   * @apiVersion 0.1.0
   * @apiName createLeadPrd
   * @apiGroup lead_prd
   * @apiParam firstName
   * @apiParam lastName
   * @apiParam email
   * @apiParam leverage
   * @apiParam entity
   * @apiParam login (Demo)
   * @apiParam phone
   * @apiParam country
   * @apiParam currency
   * @apiParam tradeAccountType (mt4_demo, mt5_demo)
   * @apiParam language
   */
  @Post('create')
  async createLeadPrd(@Body() body, @Res() res) {
    try {
      this.logger.log(JSON.stringify(body), LeadPrdController.name + '.createLeadPrd');
      const result = await this.service.createLeadPrd(body);
      this.logger.log(JSON.stringify(result), LeadPrdController.name + '.createLeadPrd');
      return res.status(HttpStatus.OK).json({
        code: 1001, message: '数据写入成功', data: result,
      });
    } catch (err) {
      return res.status(HttpStatus.OK).json({ code: 2001, message: '数据写入失败' });
    }
  }

  /**
   * @author Andy.Liao 2019-10-22
   * @param body.leadId                 // 必填
   * @param body.firstName
   * @param body.lastName
   * @param body.email
   * @param body.leverage
   * @param body.login
   * @param body.phoneAreaCode
   * @param body.phone
   * @param body.currency
   * @param body.tradeAccountType
   * @param body.lang
   * @description 參照constructLeadPrdObj
   * @description 以上參數為目前可能會更新的值
   */
  @Post('update')
  async updateLeadPrd(@Body() body, @Res() res) {
    try {
      const updateObj = await this.service.constructLeadPrdObj(body);
      this.logger.log(JSON.stringify(updateObj), LeadPrdController.name + '.updateObj');
      if (updateObj.needUpdate) {
        const result = await this.service.updateLeadPrd(body.leadId, updateObj.data);
        this.logger.log(JSON.stringify(result), LeadPrdController.name + '.updateResult');
        return res.status(HttpStatus.OK).json({
          code: 1001, message: '数据写入成功', data: result,
        });
      }
      return res.status(HttpStatus.OK).json({ code: 1001, message: '数据写入成功' });
    } catch (err) {
      return res.status(HttpStatus.OK).json({ code: 2001, message: '数据写入失败' });
    }
  }

}
