import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { relationship } from '../../module/relationship/relationship';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../@nt';

const config = new ConfigService();
const dbName = {
  mt4: config.get('MT4_DB_NAME'),
  mt4_demo: config.get('MT4_DEMO_DB_NAME'),
  mt5: config.get('DB_NAME'),
  mt5_demo: config.get('MT5_DEMO_DB_NAME'),
};

@Injectable()
export class TransactionListService {

  constructor(
    @InjectRepository(relationship, 'relationship')
    private relationshipRepository: Repository<relationship>,
  ) { }

  // 取得主帳號底下所有的IB, CL(不包含自己)
  async getAllIBAndCLChildren(accountNumber: number, entity: string, sortKey: string, sortVal: any, searchVal: string, limit: number, offset: number) {
    try {
      // 統一條件
      let sql = await this.relationshipRepository.createQueryBuilder('relationship')
      .select('relationship.*')
      .where({ entity })
      .andWhere('relationship.path REGEXP :path', { path: `(\/)${accountNumber}(\/)` })
      .andWhere(new Brackets(qb => {
        qb.where('relationship.acc_type = :ib', { ib: 'IB' })
          .orWhere('relationship.acc_type = :cl', { cl: 'CL' });
      }));
      // 加入搜尋條件
      if (searchVal) {
        sql = await sql.andWhere(new Brackets(qb => {
          qb.where('relationship.node_id = :node_id', { node_id: searchVal })
            .orWhere('relationship.parent_id = :parent_id', { parent_id: searchVal });
        }));
      }
      // 計算總數
      const totalCounts = await sql.getCount();
      // console.log('totalCounts: ', totalCounts);
      // 根據分頁回傳所有IB, CL且不包含自己(若無分頁參數則全部撈出)
      // 預設排序為主帳號遞增排序
      const [orderKey, orderVal] = sortKey && sortVal ? [sortKey, sortVal] : ['node_id', 'ASC'];
      const children = await sql.limit(limit).offset(offset).orderBy(orderKey, orderVal).execute();
      // console.log('children: ', children);
      return { totalCounts,  children };
    } catch (err) {
      throw new Error('tradeSystem getAllIBAndCLChildren: ' + err.message);
    }
  }
  // 取得自己的relationship資料
  async getSelf(accountNumber: number, entity: string) {
    try {
      const result = await this.relationshipRepository.createQueryBuilder('relationship')
      .select('relationship.*')
      .where({ entity })
      .andWhere('relationship.node_id = :accountNumber', { accountNumber })
      .execute();
      return result;
    } catch (err) {
      throw new Error('tradeSystem getSelf: ' + err.message);
    }
  }
}
