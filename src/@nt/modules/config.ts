import { Module, Global } from '@nestjs/common';
import { ConfigService } from '../services/config';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useClass: ConfigService,
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
