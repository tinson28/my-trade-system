export class CreateAccountDto {
  readonly login: string;
  readonly name: string;
  readonly group: string;
  readonly leverage: number;
  readonly address: string;
  readonly country: string;
  readonly email: string;
  readonly isEnabled: boolean;
  readonly isEnabledChangePassword: boolean;
  readonly colorBlue: string;
  readonly colorGreen: string;
  readonly colorRed: string;
  readonly agentAccount: string;
  readonly phone: string;
  readonly sendReports: boolean;
  readonly status: any;
  readonly id: string;
  readonly language: number;
  readonly trailing: boolean; // Only MT5
  readonly expert: boolean; // Only MT5
  readonly webApi: boolean;  // Only MT5
  readonly resetPass: boolean;  // Only MT5
  readonly otpEnable: any;
  readonly password: string;
  readonly passwordInvestor: string;
  readonly tradeAccountType: string; // mt4 || mt4_demo || mt5 || mt5_demo
  readonly lowerBound: number;
  readonly upperBound: number;
}