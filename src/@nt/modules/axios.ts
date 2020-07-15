import { Global, HttpModule } from '@nestjs/common';

@Global()
export class AxiosModule extends HttpModule {}
