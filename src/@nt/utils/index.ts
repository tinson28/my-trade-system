import uuid from './uuid';
import { arrayBufferToBase64, bufferToStream } from './convert';
import { getAreaByIdCard } from './idcard.area';
import { encrypt, decrypt } from './secret';

export default {
  uuid,
  arrayBufferToBase64,
  bufferToStream,
  getAreaByIdCard,
  encrypt,
  decrypt,
};
