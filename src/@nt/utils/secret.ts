import * as cryptojs from 'crypto-js';

const secretKey = '254e5504778ccbf9a3c19127643faa9a';

export function encrypt(ePassword) {
  const key = cryptojs.enc.Utf8.parse(secretKey);
  const srcs = cryptojs.enc.Utf8.parse(ePassword);
  const encryptCode = cryptojs.AES.encrypt(
    srcs,
    key,
    { mode: cryptojs.mode.ECB, padding: cryptojs.pad.Pkcs7 },
  );

  return encryptCode.toString();
}

export function decrypt(dPassword) {
  const key = cryptojs.enc.Utf8.parse(secretKey);
  const decryptCode = cryptojs.AES.decrypt(
    dPassword,
    key,
    { mode: cryptojs.mode.ECB, padding: cryptojs.pad.Pkcs7 },
  );

  return cryptojs.enc.Utf8.stringify(decryptCode).toString();
}
