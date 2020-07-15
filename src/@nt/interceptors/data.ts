import {
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import { json } from 'body-parser';

/**
 * 请求拦截器
 * 1.可转换数据, 2.可记录调用日志
 */
@Injectable()
export class DataInterceptor extends Logger implements NestInterceptor {
  intercept(
    context,
    next,
  ) {
    const time = new Date();
    const logName = context.getClass().name + '.' + context.handler.name;
    this.log(
      'start calling at: ' + time.toLocaleTimeString() + '.' + time.getMilliseconds(),
      logName,
    );

    return next.handle().pipe(
      map((data) => {
        this.log(
          'called, consuming time: ' + (new Date().getTime() - time.getTime()) + 'ms',
          logName,
        );
        if (typeof(data) === typeof(JSON)) {
          return data;
        }
        return { data, statusCode: 200, message: 'Success' };
      }),
      catchError((err) => {
        if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
          console.log(err);
        }
        this.error(err.message, err.stack, logName);
        throw err;
      }),
    );
  }
}
