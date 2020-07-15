import { Controller, Get, Query } from '@nestjs/common';
import { PureController } from '../../@nt';
import { AffService } from './aff.service';

@Controller('aff')
export class AffController extends PureController {
	constructor(
		protected readonly service: AffService,
	) {
		super(service);
	}

	/**
	 * @description 出入金记录
	 * @param query Object
	 * @query fromdate 开始日期
	 * @query todate 结束日期
	 * @query tradeAccount 按照mt服务器分组好的交易账号
   	 * @api {get} /v1/aff/getMoneyRecord
	 * @return
	 */
	@Get('getMoneyRecord')
	async getUserTransactions(@Query() query) {
		return this.service.getMoneyRecord(query);
	}

	/**
	 * @description 交易记录
	 * @param query Object
	 * @query fromdate 开始日期
	 * @query todate 结束日期
	 * @query tradeAccount 按照mt服务器分组好的交易账号
	 * @api {get} /v1/aff/getTradeRecord
	 * @return
	 */
	@Get('getTradeRecord')
	getTradeRecord(@Query() query) {
		return this.service.getTradeRecord(query);
	}
}