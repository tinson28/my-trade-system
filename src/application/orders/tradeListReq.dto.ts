export class TradeListReqDto {
  /** 查詢主帳號 */
  accountNumber: number;
  /** 已平倉或未平倉 */
  openOrClosePosition: string;
  /** 牌照 */
  entity: string;
  /** 買/賣 */
  tradeType: string;
  /** 查詢交易帳號 */
  tradeAccount: string;
  /** 商品名稱 */
  symbol: string;
  /** 查詢日期(起) */
  startDate: Date;
  /** 查詢日期(迄) */
  endDate: Date;
  /** 排序欄位 */
  sortKey: string;
  /** 遞增遞減 */
  sortValue: string;
  /** 分頁筆數 */
  pageSize?: number;
  /** 分頁數 */
  pageIndex?: number;
}
