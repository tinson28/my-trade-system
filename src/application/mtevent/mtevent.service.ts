import { Injectable, HttpService, Inject } from '@nestjs/common';
import { Config } from 'nestjs-async-config';
import * as qs from 'querystring';

@Injectable()
export class MtEventService {

  private mturl;
  constructor(
    private readonly axios: HttpService,
    @Inject(Config) readonly config: Config,
  ) {
    this.axios = axios;

    this.mturl = config.get('man2json');
    // this.mturl = {
    //   mt4: config.get('MT4_MAN2JSON_API_ENDPOINT'),
    //   mt4_demo: config.get('MT4DEMO_MAN2JSON_API_ENDPOINT'),
    //   mt5: config.get('MT5_MAN2JSON_API_ENDPOINT'),
    //   mt5_demo: config.get('MT5DEMO_MAN2JSON_API_ENDPOINT'),
    // };
  }

  resJson(code, data = '', message?) {
    return { code, data, message };
  }

  async findAccount(body: any): Promise<any> {
    try {
      //   const mttype = body.mttype?.toLowerCase() || 'mt4';
      const mtName = typeof body.mtName === 'undefined' ? 'mt4' : body.mtName.toLowerCase();
      const url = `${this.mturl[mtName]}/Accounts/Find?login=${body.login}`;
      const res = await this.axios.get(url).toPromise();
      return this.resJson(1001, res.data, 'success');
    } catch (err) {
      console.log('[MtEventService]findAccount error:' + JSON.stringify(err));
      return this.resJson(2001, '', 'MT服务器关闭、账号不存在、账号不在api经理权限范围');
    }
  }

  async groupList(body: any): Promise<any> {
    try {
      // const mttype = body.mttype?.toLowerCase() || 'mt4';
      const mtName = typeof body.mtName === 'undefined' ? 'mt4' : body.mtName.toLowerCase();
      const mtUrl = `${this.mturl[mtName]}/Groups/List?groups=*`;
      return await this.axios.get(mtUrl).toPromise();
    } catch (err) {
      console.log('[MtEventService]groupList error:' + JSON.stringify(err));
      return this.resJson(3000, '', err.message);
    }
  }

  async acquireLogin(body: any): Promise<any> {
    try {
      // const mttype = body.mttype?.toLowerCase() || 'mt4';
      const mtName = typeof body.mtName === 'undefined' ? 'mt4' : body.mtName.toLowerCase();
      const url = `${this.mturl[mtName]}/Accounts/AcquireLogin`;
      const res = await this.axios.get(url, {
        params: {
          begin: body.begin,
          length: body.length,
        },
      }).toPromise();
      const errorMessage = {
        0: '没有可用账号',
        2: '账号总长度大于10小于4、begin小于1',
        3: '获取异常',
        6: 'MT4服务器关闭',
      };

      if (typeof res.data.login !== 'undefined') {
        return this.resJson(1004, res.data, 'success');
      }
      return this.resJson(2004, '', errorMessage[res.data.error_code]);
    } catch (err) {
      console.log('[MtEventService]acquireLogin error:' + JSON.stringify(err));
      return this.resJson(3000, '', err.message);
    }
  }

  async groupInfos(body): Promise<any> {
    try {
      // const mttype = body.mttype?.toLowerCase() || 'mt4';
      const mtName = typeof body.mtName === 'undefined' ? 'mt4' : body.mtName.toLowerCase();
      const url = `${this.mturl[mtName]}/Groups/Infos?groups=${body.group}`;
      const res = await this.axios.get(url).toPromise();
      return this.resJson(1001, res.data[0], 'success');
    } catch (err) {
      console.log('[MtEventService]groupInfos error:' + JSON.stringify(err));
      return this.resJson(3000, '', err.message);
    }
  }

  async creditInOut(body: any): Promise<any> {
    try {
      // const mttype = body.mttype?.toLowerCase() || 'mt4';
      const mtName = typeof body.mtName === 'undefined' ? 'mt4' : body.mtName.toLowerCase();
      delete body.mtName;

      const url = `${this.mturl[mtName]}/Accounts/CreditInOut`;
      const res = await this.axios.get(`${url}?${qs.stringify(body)}`).toPromise();

      const errorMessage = {
        2: '账号不存在且金额为负数',
        3: '账号不存在、金额为0、必填参数没填、参数不规范',
        6: 'MT4服务器关闭',
        134: 'Credit不足',
      };

      if (typeof res.data.order !== 'undefined') {
        return this.resJson(1001, res.data.order, 'success');
      }
      return this.resJson(2001, '', errorMessage[res.data.error_code]);
    } catch (err) {
      console.log('[MtEventService]creditInOut error:' + JSON.stringify(err));
      return this.resJson(3000, '', err.message);
    }
  }

  async fundAdjust(body: any): Promise<any> {
    try {
      // const mttype = body.mttype?.toLowerCase() || 'mt4';
      const mtName = typeof body.mtName === 'undefined' ? 'mt4' : body.mtName.toLowerCase();
      delete body.mtName;

      // mean2json comment最多31位數
      body.comment = body.comment.substring(0, 31);

      const url = `${this.mturl[mtName]}/Accounts/FundWithdraw`;
      const res = await this.axios.get(`${url}?${qs.stringify(body)}`).toPromise();

      const errorMessage = {
        2: '账号不存在且金额为负数',
        3: '账号不存在、金额为0、必填参数没填、参数不规范',
        6: 'MT4服务器关闭',
        134: '余额不足',
      };

      if (typeof res.data.order !== 'undefined') {
        return this.resJson(1001, res.data.order, 'success');
      }
      return this.resJson(2001, res.data.error_code, errorMessage[res.data.error_code]);

    } catch (err) {
      console.log('[MtEventService]fundAdjust error:' + JSON.stringify(err));
      return this.resJson(3000, '', err.message);
    }
  }

  async accountRegister(body: any): Promise<any> {
    try {
      // const mttype = body.mttype?.toLowerCase() || 'mt4';
      const mtName = typeof body.mtName === 'undefined' ? 'mt4' : body.mtName.toLowerCase();
      delete body.mtName;
      let reqData = body;

      if (mtName === 'mt5' || mtName === 'mt5_demo') {
        reqData = Object.assign(reqData, {
          trailing: true,
          expert: true,
          webApi: true,
          otpEnable: true,
        });
      }

      const url = `${this.mturl[mtName]}/Accounts/Register`;
      const res = await this.axios.post(`${url}`, qs.stringify(reqData), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      }).toPromise();
      return this.resJson(1001, res.data, 'success');
    } catch (err) {
      console.log('[MtEventService]accountRegister error:' + JSON.stringify(err));
      return this.resJson(2001, '', 'MT4服务器关闭、账户已存在、必填参数没填、组别不存在、密码不是数字字母组合');
    }
  }

  async accountModify(body: any): Promise<any> {
    try {

      // const mttype = body.mttype?.toLowerCase() || 'mt4';
      const mtName = typeof body.mtName === 'undefined' ? 'mt4' : body.mtName.toLowerCase();
      delete body.mtName;
      body.login = parseInt(body.login, 10);

      const url = `${this.mturl[mtName]}/Accounts/Modify`;
      const res = await this.axios.post(url, body).toPromise();
      return this.resJson(1002, '', 'OK');

    } catch (error) {
      console.log('[MtEventService]accountModify error:' + JSON.stringify(error));
      return this.resJson(2002, '', 'MT4服务器关闭、参数只有login、组别有误');
    }
  }

  async multipleAcitvateTd(body: any): Promise<any> {
    let success = [];
    let failure = []; 
    try {
      let {tradeAccountList} = body;
      let allRes = [];
      for(let mtName of Object.keys(tradeAccountList)) {
        const updated: any = {};
        updated['isEnabled'] = mtName.split('_')[0] === 'mt4' ? 1 : true;
        updated['isReadOnly'] = mtName.split('_')[0] === 'mt4' ? 0 : false;
        for (let td of tradeAccountList[mtName]) {
          const res: any = this.axios.post(
            `${this.mturl[mtName]}/Accounts/Modify`,
            Object.assign({login: td}, updated)
          ).toPromise()
          allRes.push(res)
        }
      };
      const result = await Promise.all(allRes)
      result.map(r => {
        if (r.data.status === 'successful') {
          success.push(r.data.login)
        }
        else {
          failure.push(r.data.login)
        }
      });
      return this.resJson(1002, JSON.stringify({success, failure}), 'OK');
    } catch (error) {
      console.log('[MtEventService]accountModify error:' + JSON.stringify(error));
      return this.resJson(2002, '', 'MT4服务器关闭、参数只有login、组别有误');
    } 
  }

  async getMtTimezone() {
    try {
      const mtName = 'mt4';
      const url = `${this.mturl[mtName]}/Common/Timezone`;
      const res = await this.axios.get(url).toPromise();
      return this.resJson(1001, res.data, 'success');
    } catch (err) {
      return this.resJson(2001, '', 'MT服务器关闭、获取MT时区失败');
    }
  }

  async accountChangePassword(body: any): Promise<any> {
    try {
      const mtName = typeof body.mtName === 'undefined' ? 'mt4' : body.mtName.toLowerCase();
      delete body.mtName;
      body.login = parseInt(body.login, 10);
      const url = `${this.mturl[mtName]}/Accounts/ChangePassword`;
      const res = await this.axios.post(url, body).toPromise();
      if (res.data.status !== 0) {
        return this.resJson(2002, '', 'MT4服务器关闭、参数只有login、组别有误');
      }
      return this.resJson(1002, res.data, 'OK');
    } catch (e) {
      return this.resJson(2002, '', 'MT4服务器关闭、参数只有login、组别有误');
    }
  }
}
