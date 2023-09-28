import { nanoid, customAlphabet } from 'nanoid';
import md5 from 'crypto-js/md5';
import aes from 'crypto-js/aes';

const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDGFdk9jblkPCEic+0NlZNtb3VgjtVxWSNjsiNRE/4YQW3/EuNMLVLdL4Gy1Qvmei3sac19Ve/WRvI1HskioX+0TYKdvm7630trvzLgcSkKtNQSBkRKMYsEgERMbEdzsCpkNLPZfO8+3dJ7DVjdBnSObxFVt3fzW4ubkSjWjJ4BoQIDAQAB';
export class UtilService {
  constructor() {}

  public genterateUUID(): string {
    return nanoid();
  }

  public generateRandomValue(
    length: number,
    alphabet = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
  ) {
    return customAlphabet(alphabet, length)();
  }

  /**
   * md5加密
   * @param text
   */
  public md5(text: string): string {
    return md5(text).toString();
  }

  public decrypt(text: string): string {
    console.log(text);
    try {
      const res = aes.decrypt(text, publicKey).toString()
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
