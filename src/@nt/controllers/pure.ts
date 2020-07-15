import { UseInterceptors } from '@nestjs/common';
import { DataInterceptor } from '../interceptors/data';

/**
 * 纯静 Controller 基类
 */
@UseInterceptors(DataInterceptor)
export class PureController {
  constructor(protected readonly service) { }

  /**
   * 统一格式输出
   * @author rex.hong@newtype.io 2019-08-14 17:50
   * @param code Number 代码code值 必填
   * @param data String|Array|Object 返回结果 非必填
   * @param message String 返回信息，默认为空 非必填
   * @return 格式输出 { code:1000, message:"", data:["xxx"] };
   */
  returnJson(code: number, data: any = null, message: string = '') {
    const outputMessage = message === '' ? this.getMessage(code) : message;
    return { code, message: outputMessage, data };
  }

  /**
   * 依據code取得已定義訊息
   * @author rex.hong@newtype.io 2019-08-14 17:50
   * @param code Number 代码code值 必填
   * @return 格式输出 String;
   */
  getMessage(code: number) {
    const value = {
      1000: '登录成功',
      1001: '数据写入成功',
      1002: '数据更新成功',
      1003: '数据删除成功',
      1004: '数据查询成功',
      1005: '上传成功',
      1006: '请求成功',
      1007: '验证成功',
      2000: '登录失败',
      2001: '数据写入失败',
      2002: '数据更新失败',
      2003: '数据删除失败',
      2004: '数据查询失败',
      2005: '账号错误',
      2006: '密码错误',
      2007: '账号或密码错误',
      2008: '验证码错误',
      2009: '非法登录',
      2010: '获取token错误，token无效',
      2011: '不合法的参数',
      2012: '不合法的请求格式',
      2013: '需要 GET 请求',
      2014: '需要 POST 请求',
      2015: '参数错误',
      2016: '日期格式错误',
      2017: '部分参数为空',
      2018: '上传失败',
      2019: '请求失败',
      2020: '验证失败',
      2021: '获取access_token错误，access_token无效',
      2022: '不合法url地址',
      2023: '密码不合法',
      2024: '字段格式有误',
      2025: 'token或access_token过期',
      3000: '系统繁忙',
      3001: '系统错误',
    };

    return value[code];
  }
  /**
   * 檢查牌照類型
   * @author Zachary 2019-12-02
   * @param {string} entity 牌照 必填
   * @return boolean
   */
  checkEntity(entity: string) {
    const entityArray = ['KY', 'GM', 'UK', 'UAE', 'MU'];
    return entityArray.includes(entity);
  }

  /**
   * @name 檢查主帳號類別
   * @author RexHong 2019-12-17
   * @param {string} accType 主帳號類別
   */
  checkAccType(accType: string) {
    const allowAccType = ['IB', 'CL'];
    return allowAccType.includes(accType);
  }
}
