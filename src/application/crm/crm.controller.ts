import { Controller, Post, Body, Res, Param } from '@nestjs/common';
import { PureController } from '../../@nt';
import { CrmService } from './crm.service';

@Controller('crm')
export class CrmController extends PureController {
  constructor(
      protected readonly service: CrmService,
  ) {
    super(service);
  }

  /**
   * @author Grant.Zheng 2019-09-11
   * @api {post} /crm/createCrmAccount crm Account 创建
   * @apiName createCrmAccount
   * @apiGroup crm
   * @apiParam
   * @apiParam {String} ATNumber 主账号
   * @apiParam {String} [LeadId]
   * @apiParam {String} [AccountId]  主账号ID
   * @apiParam {String} [Email]  邮箱
   * @apiParam {String} [Phone]  电话
   * @apiParam {String} [PrefixPhone]  电话区号
   * @apiParam {String} [Addr] 地址
   * @apiParam {String} [Entity]
   * @apiParam {String} [KycStatus]  kyc认证状态
   * @apiParam {String} [FirstName]  名字
   * @apiParam {String} [LastName]  姓
   * @apiParam {String} [Create_Date]  创建时间
   * @apiParam {String} [Modify_Date] 修改时间
   * @apiParam {String} [Agent]  上级代理人
   * @apiParam {String} [Gender]  性别
   * @apiParam {String} [Birth_Date]  生日
   * @apiParam {String} [AA_Number]
   * @apiParam {String} [AFF_ID]
   * @apiParam {String} [CXD_token]
   * @apiParam {String} [Email_language]  邮箱语言
   * @apiParam {String} [Browser]  浏览器
   * @apiParam {String} [Brower_Language]  浏览器语言
   * @apiParam {String} [Landing_Page]  登陆页面
   * @apiParam {String} [Landing_Page_Language]  登录页语言
   * @apiParam {String} [Account_Type]  账户类型 CL/IB
   * @apiParam {String} [LeadSource]  潜在客户来源
   * @apiParam {String} [Company]  公司
   * @apiParam {String} [Country_Code]  国家码
   * @apiParam {String} [CountryOfResidence]  居住国家
   * @apiParam {String} [City]  市
   * @apiParam {String} [Sales]  销售
   * @apiParam {String} [SalesNumber]  销售编号
   * @apiParam {String} [Cln_Name]  客户姓名
   * @apiParam {String} [Activated_Date]  激活时间
   * @apiParam {String} [Apply_CreateDate]  申请时间
   * @apiParam {String} [AreaCode]  地区码
   * @apiParam {String} [AreaName]  地区名称
   * @apiParam {String} [Currency]  货币
   * @apiParam {String} [Doc_No]  证件号
   * @apiParam {String} [Doc_Type]  证件类型
   * @apiParam {String} [Doc_Expiry_Date]  证件到期时间
   * @apiParam {String} [Doc_Front_Img]  证件正面
   * @apiParam {String} [Doc_Back_Img]  证件背面
   * @apiParam {String} [Referrer_Code]  推荐人代码
   * @apiParam {String} [Referrer_Group]  推荐人组别
   * @apiParam {String} [Referrer_Type]  推荐人类型
   * @apiParam {String} [Registered_IP]  推荐人IP
   * @apiParam {String} [Registered_Country]  推荐人币种
   * @apiParam {String} [Registered_City]  推荐人城市
   * @apiParam {String} [Check_By]  审核人
   * @apiParam {String} [Process_By]  处理人
   * @apiParam {String} [UTM_Campaign]
   * @apiParam {String} [UTM_Content]
   * @apiParam {String} [UTM_Medium]
   * @apiParam {String} [UTM_Source]
   * @apiParam {String} [UTM_Term]
   * @apiParam {String} [IB_Code]  IB CODE
   * @apiParam {Number} [IB_Link]  IB Link
   * @apiParam {String} [Parent_IB_Code]  父级IBCode
   * @apiParam {Number} [Parent_Cln_ID]  父级主账号
   * @apiParam {String} [Has_Trading_Experience]  是否有交易经验
   * @apiParam {String} [Is_BlackList]  是否为黑名单
   * @apiParam {String} [Beneficiary_Name] 收款人姓名
   * @apiParam {String} [DemoSpreadType]  Demo点差类型
   * @apiParam {String} [InsertSynStatus]  插入同步状态
   * @apiParam {String} [UpdateSynStatus]  更新同步状态
   * @apiParam {Number} [Balance]  余额
   * @apiParam {Number} [Equity]  净值
   * @apiParam {Number} [SumCloseOrder]  关闭订单总和
   * @apiParam {String} [RiskLevel]  风险等级
   * @apiParam {String} [FirstCreateDateLive]  第一个交易账号得时间
   * @apiParam {String} [FirstCreateDateDemo]  第一个demo账号得时间
   * @apiParam {String} [FirstCommRevedDate]  第一次返佣时间
   * @apiParam {String} [FirstDepositDate]  第一次入金时间
   * @apiParam {String} [FirstTradeDate]  首次交易时间
   */
  @Post('createCrmAccount')
  async createCrmAccount(@Body() body, @Res() res) {
    const r = await this.service.createCrmAccount(body);
    res.status(200).json(r);
  }

  // 更新主账号的数据
  @Post('updateCrmAccount/:accountNumber/:entity')
  async updateCrmAccount(@Param('accountNumber') accountNumber,
                         @Param('entity') entity,
                         @Body() body, @Res() res) {
    const r = await this.service.updateCrmAccount(accountNumber, entity, body);
    res.status(200).json(r);
  }

  /**
   * @api {post} /crm/createCrmAccountBankInfo crm AccountBankInfo 创建
   */
  @Post('createCrmAccountBankInfo')
  async createCrmAccountBankInfo(@Body() body, @Res() res) {
    const r = await this.service.createCrmAccountBankInfo(body);
    res.status(200).json(r);
  }

  /**
   * @author Grant.Zheng 2019-09-11
   * @api {post} /crm/createCrmAccount crm Account 创建
   * @apiName createCrmAccount
   * @apiGroup crm
   *
   * @apiParam {String} Cln_ID 交易账号
   * @apiParam {String} [SaleforceId] SFID
   * @apiParam {String} [Entity] Entity
   * @apiParam {String} [MtServer] mt服务器
   * @apiParam {String} [MtAccType] 账户类型CL/IB
   * @apiParam {String} [MtType] mtType
   * @apiParam {String} [MTGroup] 组别
   * @apiParam {String} [MtStatus] 状态
   * @apiParam {String} [MtCurrency] 币种
   * @apiParam {String} [Agent] 代理人
   * @apiParam {String} [MtRemark] 备注
   * @apiParam {String} [Enable] 账号是否启用 开启/关闭
   * @apiParam {String} [Enable_ReadOnly] 只读 开启/关闭
   * @apiParam {String} [UpdateBy] 更新操作人
   * @apiParam {String} [IsDeleted] 是否删除
   * @apiParam {String} [StaffID] StaffID
   * @apiParam {String} [Depositlnd] 入金是否开启
   * @apiParam {String} [WithdrawalInd] 出金是否开启
   * @apiParam {String} [FundTransferInd] 转账是否开启
   * @apiParam {String} [FirstCommRevedDate] 第一次返佣时间
   * @apiParam {String} [FirstDepositDate] 第一次入金时间
   * @apiParam {String} [FirstTradeDate] 第一次交易时间
   * @apiParam {String} [LastPositionDateTime] 最后一条订单时间
   * @apiParam {String} [Balance] 余额
   * @apiParam {String} [Equity] 净值
   * @apiParam {String} [PL] PL
   * @apiParam {String} [No_Of_Open_Position] 持仓订单数
   * @apiParam {String} [Lots_Of_Open_Position] 持仓手数
   * @apiParam {String} [No_Of_Close_Order] 平仓订单数
   * @apiParam {String} [Lots_Of_Close_Order] 平仓手数
   */

  @Post('createCrmTradeAccount')
  async createCrmTradeAccount(@Body() body, @Res() res) {
    const r = await this.service.createCrmTradeAccount(body);
    res.status(200).json(r);
  }

  /**
   * 创建交易记录
   * @author SaiLa 2020-03-30
   */
  @Post('createCrmTransaction')
  async createCrmTransaction(@Body() body, @Res() res) {
    const r = await this.service.createCrmTransaction(body);
    res.status(200).json(r);
  }

  /**
   * 修改交易记录
   * @author SaiLa 2020-03-30
   */
  @Post('updateCrmTransaction')
  async updateCrmTransaction(@Body() body, @Res() res) {
    const r = await this.service.updateCrmTransaction(body);
    res.status(200).json(r);
  }

  /**
   * 修改主账号/交易账户信息
   * @author SaiLa 2020-04-02
   */
  @Post('updateCrmData')
  async updateCrmData(@Body() body, @Res() res) {
    const r = await this.service.updateCrmData(body);
    res.status(200).json(r);
  }
}
