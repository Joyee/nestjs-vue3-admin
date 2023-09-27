import { nanoid, customAlphabet } from 'nanoid';
import CryptoJS from 'crypto-js';

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
    return CryptoJS.MD5(text).toString();
  }
}
