import { Column, Entity,  OneToOne } from 'typeorm';

import { ConfigService } from '../../@nt';
const relationshipTable =  new ConfigService().get('RELATIONSHIP_TABLE_NAME');

@Entity(relationshipTable)
export class relationship {

  @Column('bigint', {
    primary: true,
    name: 'node_id',
  })
  node_id: number;

  @Column('bigint', {
    name: 'parent_id',
  })
  parent_id: number;

  @Column('varchar', {
    name: 'acc_type',
  })
  acc_type: string;

  @Column('text', {
    name: 'path',
  })
  path: string;

  @Column('varchar', {
    name: 'node_code_UK',
  })
  node_code_UK: string;

  @Column('varchar', {
    name: 'parent_code_UK',
  })
  parent_code_UK: string;

  @Column('varchar', {
    name: 'node_code_GM',
  })
  node_code_GM: string;

  @Column('varchar', {
    name: 'parent_code_GM',
  })
  parent_code_GM: string;

  @Column('bigint', {
    name: 'master_account_number',
  })
  master_account_number: string;

  @Column('varchar', {
    name: 'entity',
  })
  entity: string;

  @Column('varchar', {
    name: 'trade_system',
  })
  trade_system: string;
}
