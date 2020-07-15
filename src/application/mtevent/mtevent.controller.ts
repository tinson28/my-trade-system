import { Controller, Post, Body, Res, Param, Get } from '@nestjs/common';
import { MtEventService } from './mtevent.service';
import { PureController } from '../../@nt';

@Controller('mtevent')
export class MtEventController extends PureController {
  constructor(
    protected readonly service: MtEventService,
  ) {
    super(service);
  }

  /**
   * @author Grant.Zheng 2019-10-08
   * @api {post} /mtevent/findAccount 获取账户信息
   * @apiName findAccount
   * @apiGroup mtevent
   *
   * @apiParam {String="mt4","mt4_demo","mt5","mt5_demo", "mt4_s02"} mtName mt名称
   * @apiParam {Number} login 交易账号
   *
   * @apiSuccess {Object} Account信息
   * @apiError (500) {String="code [-1]"} messgae MT4服务器关闭、账号不存在、账号不在api经理权限范围
   */
  @Post('findAccount')
  async findAccount(@Body() body, @Res() res) {
    let r = await this.service.findAccount(body);
    res.status(200).json(r);
  }

  /**
   * @author Grant.Zheng 2019-11-05
   * @api {post} /mtevent/acquireLogin 获取可用交易账号
   * @apiName findAccount
   * @apiGroup mtevent
   *
   * @apiParam {String="mt4","mt4_demo","mt5","mt5_demo", "mt4_s02"} mtName mt名称
   * @apiParam {Number} begin 账号开头前缀
   * @apiParam {Number} length 除开头的账号长度
   *
   * @apiSuccess {Number} login 交易账号
   *
   * @apiError (200) {Number="0","2","3","6"} error_code 0没有可用账号 3账号总长度大于10、length小于3、begin小于1 3获取异常 6MT4服务器关闭
   */
  @Post('acquireLogin')
  async acquireLogin(@Body() body, @Res() res) {
    let result = await this.service.acquireLogin(body);
    res.status(200).json(result);
  }

  /**
   * groupList  获取组别
   * @author Grant.Zheng
   * @api {post}  /mtevent/groupList 获取组别
   * @apiGroup mtevent
   * @apiName groupList
   *
   * @apiSuccess [ { "group": "manager" },... ]
   * @apiError (500) {String="code [-1]"} messgae MT4服务器关闭
   */
  @Post('groupList')
  async groupList(@Body() body) {
    let r = await this.service.groupList(body);
    if (r.status !== 200) return [];
    return r.data;
  }

  /**
   * groupList  获取组别
   * @author Grant.Zheng
   * @api {post}  /mtevent/groupList 获取组别
   * @apiGroup mtevent
   * @apiName groupList
   *
   * @apiSuccess [ { "group": "manager" },... ]
   * @apiError (500) {String="code [-1]"} messgae MT4服务器关闭
   */
  @Post('groupInfos')
  async groupInfos(@Body() body, @Res() res) {
    let r = await this.service.groupInfos(body);
    res.status(200).json(r);
  }

  /**
   * @author Grant.Zheng 2019-08-28
   * @api {post}  /mtevent/creditInOut 资金调整(Promotion  credit)
   * @apiName creditInOut
   * @apiGroup mtevent
   *
   * @apiParam {String="mt4","mt4_demo","mt5","mt5_demo", "mt4_s02"} mtName mt名称
   * @apiParam {Number} login 交易账号
   * @apiParam {Number} credit 调整金额 增加为正数 | 扣除为负数
   * @apiParam {String="Credit-In", "Credit-Out"} comment 调整类型
   * @apiParam {Number} expiration 有效期 时间必须大于当前mt时间 例：20190828101010
   *
   * @apiSuccess {Number=1001,2001} code 成功或失败得code
   * @apiSuccess {Number} data 订单号
   * @apiSuccess {String="success","错误信息"} message 返回详情
   * @apiError (200) {Number="2","3","6","134"} error_code 2账号不存在且金额为负数 3账号不存在且金额为负数 6MT4服务器关闭 134Credit不足
   */
  @Post('creditInOut')
  async creditInOut(@Body() body, @Res() res) {
    let r = await this.service.creditInOut(body);
    res.status(200).json(r);
  }

  /**
   * @author Grant.Zheng 2019-08-28
   * @api {post} /mtevent/fundAdjust 余额调整
   * @apiName fundAdjust
   * @apiGroup mtevent
   *
   * @apiParam {String="mt4","mt4_demo","mt5","mt5_demo", "mt4_s02"} mtName mt名称
   * @apiParam {Number} login 交易账号
   * @apiParam {Number} money 调整金额 入金为正数 | 出金为负数
   * @apiParam {String="Deposit-入金参考号",
   *                   "Withdrawal-申请编号",
   *                   "Deposit-Fee-入金参考号",
   *                   "Transfer-to-交易账号-申请编号",
   *                   "Transfer-from%23-交易账号-申请编号",
   *                   "Deposit-Cancelled-入金申请编号ID",
   *                   "Withdrawal-Cancelled-出金申请编号ID"} comment 备注   Deposit-Cancelled 入金扣除 Withdrawal-Cancelled 出金撤回
   *
   * @apiSuccess {Number=1001,2001} code 成功或失败得code
   * @apiSuccess {String="success","错误信息"} message 返回详情
   * @apiError (200) {Number="2","3","6","134"} error_code 2账号不存在且金额为负数 3账号不存在且金额为负数 6MT4服务器关闭 134余额不足
   */
  @Post('fundAdjust')
  async fundAdjust(@Body() body, @Res() res) {
    let r = await this.service.fundAdjust(body);
    res.status(200).json(r);
  }

  /**
   * @author Grant.Zheng 2019-09-11
   * @api {post} /mtevent/accountRegister MT账号注册
   * @apiName accountRegister
   * @apiGroup mtevent
   *
   * @apiParam {String="mt4","mt4_demo","mt5","mt5_demo", "mt4_s02"} mtName mt名称
   * @apiParam {Number} login 交易账号
   * @apiParam {String} [password] 主密码
   * @apiParam {String} [passwordInvestor] 投资密码
   * @apiParam {String} name 名称
   * @apiParam {Number} [balance] 余额
   * @apiParam {String} group 组别
   * @apiParam {String} leverage 杠杆倍数
   * @apiParam {String} comment 备注
   * @apiParam {String} [address] 地址
   * @apiParam {String} [city] 城市
   * @apiParam {String} [country] 国家
   * @apiParam {String} email 邮箱
   * @apiParam {Number=0,1} isEnabled 是否启用 0. 停用 1. [启用, 暂停]
   * @apiParam {Number=0,1} isEnabledChangePassword=1 是否可以修改密码
   * @apiParam {Number=0,1} isReadOnly 是否只读 0 NO 1 YES
   * @apiParam {String} [colorBlue] 蓝色-默认空
   * @apiParam {String} [colorGreen] 绿色-默认空
   * @apiParam {String} [colorRed] 红色-默认空
   * @apiParam {String} agentAccount 代理账号
   * @apiParam {String} [phone] 电话
   * @apiParam {String} [phonePassword] 电话密码-默认空
   * @apiParam {Number0,1} [sendReports=1] 发送报告 0.不发送 1.发送
   * @apiParam {String} [state] 州
   * @apiParam {String} [status] 状态     RE
   * @apiParam {String} [zipCode] 邮编
   * @apiParam {String} [id] ID号码
   *
   * @apiSuccess {Number=1001,2001} code 成功或失败得code
   * @apiSuccess {String="success","错误信息"} message 返回详情
   * @apiError (500) {String="code [-1]"} message MT4服务器关闭、账户已存在、必填参数没填、组别不存在、密码不是数字字母组合
   */
  @Post('accountRegister')
  async accountRegister(@Body() body, @Res() res) {
    const r = await this.service.accountRegister(body);
    res.status(200).json(r);
  }

  /**
   * @author Grant.Zheng 2019-09-11
   * @api {post} /mtevent/accountModify MT账号信息修改
   * @apiName accountModify
   * @apiGroup mtevent
   *
   * @apiParam {String="mt4","mt4_demo","mt5","mt5_demo", "mt4_s02"} mtName mt名称
   * @apiParam {String} login 交易账号
   * @apiParam {String} [name] 名称
   * @apiParam {String} [group] 组别
   * @apiParam {String} [leverage] 交易倍数(杠杆)
   * @apiParam {String} [comment] 备注
   * @apiParam {String} [address] 地址
   * @apiParam {String} [city] 城市
   * @apiParam {String} [country] 国家
   * @apiParam {String} [email] 邮箱
   * @apiParam {String=0,1} [isEnabled] 是否启用 0. 停用 1. [启用, 暂停]
   * @apiParam {String=0,1} [isEnabledChangePassword] 是否启动更改密码 0 || 1
   * @apiParam {String=0,1} [isReadOnly] 是否只读 0. [启用, 停用] 1. 暂停
   * @apiParam {String} [colorBlue] 蓝色-默认空
   * @apiParam {String} [colorGreen] 绿色-默认空
   * @apiParam {String} [colorRed] 红色-默认空
   * @apiParam {String} [agentAccount] 代理账号
   * @apiParam {String} [phone] 电话
   * @apiParam {String} [phonePassword] 电话密码-默认空
   * @apiParam {String=0,1} [sendReports] 发送报告 0.不发送 1.发送
   * @apiParam {String} [state]              州/省
   * @apiParam {String} [status]             状态
   * @apiParam {String} [zipCode]            邮编
   * @apiParam {String} [id]                 ID号码
   * @apiParam {String} [password]           主密码
   * @apiParam {String} [passwordInvestor]   投资密码
   *
   * @apiSuccess {Number=1002,2002} code 成功或失败得code
   * @apiSuccess {String="success","{错误信息}"} message 返回详情
   * @apiError (500) {String="code [-1]"} message MT4服务器关闭、参数只有login、组别有误
   */
  @Post('accountModify')
  async accountModify(@Body() body, @Res() res) {
    const r = await this.service.accountModify(body);
    res.status(200).json(r);
  }

  /**
   * @author Michael 2020-04-24
   * @api 批量激活交易账号
   * @apiName multipleAcitvateTd
   * @apiParam {Object} tradeAccountList {mt4: [tradeAccount], mt5: [tradeAccount]}
   */
  @Post('multipleAcitvateTd')
  async multipleAcitvateTd(@Body() body, @Res() res) {
    const r = await this.service.multipleAcitvateTd(body);
    res.status(200).json(r);
  }

  /**
   * @author Ben.Zhu 2020-01-10
   * @api {post} /mtevent/getMtTimezone 去Man2json获取MT当前时区
   * @apiName getMtTimezone
   * @apiGroup mtevent
   */
  @Get('getMtTimezone')
  async getMtTimezone(@Res() res) {
    const r = await this.service.getMtTimezone();
    res.status(200).json(r);
  }

  @Post('accountChangePassword')
  async accountChangePassword(@Body() body, @Res() res) {
    const r = await this.service.accountChangePassword(body);
    res.status(200).json(r);
  }
}
