import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly envConfig;

  constructor() {
    dotenv.config();
    const filePath = '.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '.dev');

    if (fs.existsSync(filePath)) {
      this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    } else {
      console.log('config serivce constructor file not exists:' + filePath);
    }
  }

  // Docker 变量或系统变量覆盖 env 配置文件
  get(key) {
    // console.log('env  key:' + key + ' value:' + process.env[key]);
    // console.log('file key:' + key + ' value:' + this.envConfig[key]);
    return process.env[key] || this.envConfig[key];
  }
}
