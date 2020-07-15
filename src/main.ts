import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import * as bodyParser from 'body-parser';
import { LoggerService } from './@nt/services/logger';
import { initConfig } from 'nestjs-async-config';
import * as httpContext from 'express-http-context';

const TRACE_HEADERS = [
  'x-request-id',
  'x-b3-traceid',
  'x-b3-spanid',
  'x-b3-parentspanid',
];

async function bootstrap() {
  await initConfig();
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new LoggerService(),
  });

  app.use(httpContext.middleware);
  app.use((req, res, next) => {
    const traceHeader = {};
    Object.keys(req.headers).map((key, index) => {
      if (TRACE_HEADERS.indexOf(key) !== -1) {
        traceHeader[key] = req.headers[key];
      }
    });
    httpContext.set('trace-headers', traceHeader);
    next();
  });

  app.use(bodyParser.json({ limit: '256mb' }));
  app.use(bodyParser.urlencoded({ limit: '256mb', extended: true }));
  app.setGlobalPrefix('v1');
  await app.listen(3000);
}
bootstrap();
