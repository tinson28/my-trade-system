import * as winston from 'winston';
import * as httpContext from 'express-http-context';
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  stdLogger;
  constructor() {
    const formatter = winston.format.printf(({ level, message, timestamp, service }) => {
      return `${timestamp} ${level}: [${service}] ${message}`;
    });
    winston.loggers.add('standard', {
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.ms(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json(),
          ),
        }),
      ],
    });
    this.stdLogger = winston.loggers.get('standard');
  }

  writeLog(level, message, meta = {}) {
    if (process.env.NODE_ENV && process.env.NODE_ENV === 'prod') {
      this.stdLogger.log(
        level, message, Object.assign({}, meta, (httpContext.get('trace-headers') || {})));
    } else {
      Logger.log(message, meta['service'], true);
    }
  }

  log(message: string, context) {
    const headers = httpContext.get('trace-headers') || {};
    const meta = Object.assign({}, headers, { service: context });
    this.writeLog('info', message, meta);
  }

  error(message: string, trace: string, context) {
    this.writeLog('error', message, { service: context, trace });
  }

  warn(message: string, context) {
    this.writeLog('warn', message, { service: context });
  }

  debug(message: string, context) {
    this.writeLog('debug', message, { service: context });
  }

  verbose(message: string, context) {
    this.writeLog('verbose', message, { service: context });
  }
}
