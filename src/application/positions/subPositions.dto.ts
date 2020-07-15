/** 倉位總結查詢欄位 */
export class SubPositionsDto {
  /** 查詢主帳號 */
  accountNumber: number;
  /** 查詢上級帳號或主帳號 */
  searchValue: number;
  /** 查詢類別 IB/CL */
  accType: string;
  /** 查詢牌照 */
  entity: string;
  /** 查詢日期(起) */
  startDate: Date;
  /** 查詢日期(迄) */
  endDate: Date;

  /** 排序欄位 */
  sortKey: string;
  /** 遞增遞減 */
  sortValue: string;
  /** 分頁筆數 */
  pageSize: number;
  /** 分頁數 */
  pageIndex: number;
}
