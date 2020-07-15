import { Module } from '@nestjs/common';
import { LeadPrdService } from './leadPrd.service';
import { LeadPrdController } from './leadPrd.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LEADPRD } from '../../module/crm/leadPrd';

@Module({
  imports: [
    TypeOrmModule.forFeature([LEADPRD], 'crm'),
  ],

  providers: [LeadPrdService],
  controllers: [LeadPrdController],
})
export class LeadPrdModule {}
