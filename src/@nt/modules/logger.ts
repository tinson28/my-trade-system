import { Module, Global } from '@nestjs/common';
import { LoggerService } from '../services/logger';

@Global()
@Module({
  providers: [
    {
      provide: LoggerService,
      useClass: LoggerService,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
