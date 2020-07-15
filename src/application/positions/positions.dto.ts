/** 倉位總結查詢欄位 */
export class PositionsDto {
  /** 查詢主帳號 */
  accountNumber: number;
  /** 查詢主帳號(getSubPosition API Only) */
  entity: string;
  /** 查詢日期(起) */
  startDate: Date;
  /** 查詢日期(迄) */
  endDate: Date;
}
