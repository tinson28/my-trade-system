export enum HttpStatusCode {
  /** 登录成功 */
  LOGIN_SUCCESS = 1000,
  /** 数据写入成功 */
  DATA_WRITE_SUCCESS = 1001,
  /** 数据更新成功 */
  DATA_UPDATE_SUCCESS = 1002,
  /** 数据删除成功 */
  DATA_DELETE_SUCCESS = 1003,
  /** 数据查询成功 */
  DATA_QUERY_SUCCESS = 1004,
  /** 上传成功 */
  UPLOAD_SUCCESS = 1005,
  /** 请求成功 */
  REQUEST_SUCCESS = 1006,
  /** 验证成功 */
  VERIFICATION_SUCCESS = 1007,
  /** 登录失败 */
  LOGIN_FAILED = 2000,
  /** 数据写入失败 */
  DATA_WRITE_FAILED = 2001,
  /** 数据更新失败 */
  DATA_UPDATE_FAILED = 2002,
  /** 数据删除失败 */
  DATA_DELETE_FAILED = 2003,
  /** 数据查询失败 */
  DATA_QUERY_FAILED = 2004,
  /** 账号错误 */
  ACCOUNT_ERROR = 2005,
  /** 密码错误 */
  PASSWORD_ERROR = 2006,
  /** 账号或密码错误 */
  ACCOUNT_OR_PASSWORD_ERROR = 2007,
  /** 验证码错误 */
  VERIFICATION_CODE_ERROR = 2008,
  /** 非法登录 */
  ILLEGAL_LOGIN = 2009,
  /** 获取token错误，token无效 */
  TOKEN_INVALID = 2010,
  /** 不合法的参数 */
  PARAMETER_INVALID = 2011,
  /** 不合法的请求格式 */
  REQUEST_INVALID = 2012,
  /** 需要 GET 请求 */
  NEED_GET = 2013,
  /** 需要 POST 请求 */
  NEED_POST = 2014,
  /** 参数错误 */
  PARAMETER_ERROR = 2015,
  /** 日期格式错误 */
  DATE_FORMAT_ERROR = 2016,
  /** 部分参数为空 */
  PARAMETER_EMPTY = 2017,
  /** 上传失败 */
  UPLOAD_FAILED = 2018,
  /** 请求失败 */
  REQUEST_FAILED = 2019,
  /** 验证失败 */
  VERIFICATION_FAILED = 2020,
  /** 获取access_token错误，access_token无效 */
  ACCESS_TOKEN_INVALID = 2021,
  /** 不合法url地址 */
  URL_ERROR = 2022,
  /** 密码不合法 */
  PASSWORD_FORMAT_ERROR = 2023,
  /** 字段格式有误 */
  FIELD_FORMAT_ERROR = 2024,
  /** token或access_token过期 */
  TOKEN_EXPIRED = 2025,
  /** 系统繁忙 */
  SYSTEM_BUSY = 3000,
  /** 系统错误 */
  SYSTEM_ERROR = 3001,
}
