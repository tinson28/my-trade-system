import { Column, Entity } from 'typeorm';

@Entity('client_RelationDB', { schema: 'datawarehouse_two' })
export class ClientRelationDb {
  @Column('int', { primary: true, name: 'MTlogin' })
  mTlogin: number;

  @Column('varchar', { name: 'Acc_Type', nullable: true, length: 45 })
  accType: string | null;

  @Column('varchar', { name: 'Entity', nullable: true, length: 45 })
  entity: string | null;

  @Column('varchar', { name: 'Agent', nullable: true, length: 45 })
  agent: string | null;

  @Column('varchar', { name: 'Sale', nullable: true, length: 45 })
  sale: string | null;

  @Column('varchar', { name: 'Manager', nullable: true, length: 45 })
  manager: string | null;

  @Column('varchar', { name: 'Office', nullable: true, length: 45 })
  office: string | null;

  @Column('varchar', { name: 'Region', nullable: true, length: 45 })
  region: string | null;

  @Column('varchar', { name: 'Nation', nullable: true, length: 45 })
  nation: string | null;

  @Column('varchar', { name: 'Mtstatus', nullable: true, length: 45 })
  mtstatus: string | null;
}
