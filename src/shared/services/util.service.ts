import { Injectable } from '@nestjs/common';
import { nanoid, customAlphabet } from 'nanoid';
import * as CryptoJs from 'crypto-js';
import { HttpService } from '@nestjs/axios';
import { FastifyRequest } from 'fastify';

@Injectable()
export class UtilService {
  constructor(private readonly httpService: HttpService) {}

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
    return CryptoJs.MD5(text).toString();
  }

  /**
   * 获取ip
   */
  getReqIP(req: FastifyRequest): string {
    return (
      // 判断是否有反向代理 IP
      (
        (req.headers['x-forwarded-for'] as string) ||
        // 判断后端的 socket 的 IP
        req.socket.remoteAddress
      ).replace('::ffff:', '')
    );
  }

  /**
   * 判断IP是不是内网
   */
  IsLAN(ip: string) {
    ip.toLowerCase();
    if (ip === 'localhost') return true;
    let a_ip = 0;
    if (ip === '') return false;
    const aNum = ip.split('.');
    if (aNum.length != 4) return false; // 如果aNum的长度不等于4，返回false。因为一个有效的IP地址应该由4个数字组成
    // 将IP地址的每一部分转换为整数，然后左移相应的位数，然后累加到a_ip上。这样，a_ip就存储了IP地址的二进制表示
    a_ip += parseInt(aNum[0]) << 24;
    a_ip += parseInt(aNum[1]) << 16;
    a_ip += parseInt(aNum[2]) << 8;
    a_ip += parseInt(aNum[3]) << 0;
    a_ip = (a_ip >> 16) & 0xffff; // 将a_ip右移16位，然后与0xffff进行位与运算。这样，a_ip就只保留了最后16位
    // a_ip是否满足局域网IP地址的条件
    return (
      a_ip >> 8 == 0x7f ||
      a_ip >> 8 == 0xa ||
      a_ip == 0xc0a8 ||
      (a_ip >= 0xac10 && a_ip <= 0xac1f)
    );
  }

  /**
   * 通过IP获取地理位置
   * @param ip IP
   */
  async getLocation(ip: string) {
    if (this.IsLAN(ip)) return '内网IP';
    // {
    //   "ip": "122.240.181.217",
    //   "pro": "浙江省",
    //   "proCode": "330000",
    //   "city": "温州市",
    //   "cityCode": "330300",
    //   "region": "",
    //   "regionCode": "0",
    //   "addr": "浙江省温州市 电信",
    //   "regionNames": "",
    //   "err": ""
    // }
    let { data } = await this.httpService.axiosRef.get(
      `http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`,
      {
        responseType: 'arraybuffer',
      },
    );
    data = JSON.parse(new TextDecoder('gbk').decode(data))
      .addr.trim()
      .split(' ')
      .at(0);
    return data;
  }
}
