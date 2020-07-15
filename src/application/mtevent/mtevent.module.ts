import { Module } from '@nestjs/common';
import { MtEventController } from './mtevent.controller';
import { MtEventService } from './mtevent.service';
import { Config } from 'nestjs-async-config';

@Module({
  controllers: [MtEventController],
  providers: [MtEventService, Config],
  exports: [MtEventService]
})
export class MteventModule {}
