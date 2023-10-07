import { SysUserService } from './../system/user/user.service';
import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { isEmpty } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { ImageCaptchaDto } from './login.dto';
import { UtilService } from '@/shared/services/util.service';
import { RedisService } from '@/shared/redis/redis.service';
import { BusinessException } from '@/common/exceptions/business.exception';
import { LogService } from '../system/log/log.service';

@Injectable()
export class LoginService {
  constructor(
    private utilService: UtilService,
    private redisService: RedisService,
    private userService: SysUserService,
    private jwtService: JwtService,
    private logService: LogService,
  ) {}

  /**
   * 创建验证码
   * @param captcha
   */
  async createImageCaptcha(captcha: ImageCaptchaDto) {
    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: isEmpty(captcha.width) ? 100 : captcha.width,
      height: isEmpty(captcha.height) ? 50 : captcha.height,
      charPreset: '1234567890',
    });
    try {
      const result = {
        img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
          'base64',
        )}`, // data转换为base64编码格式的字符串
        id: this.utilService.genterateUUID(),
      };

      // 放入缓存并设置过期时间
      await this.redisService
        .getRedis()
        .set(`admin:captcha:img:${result.id}`, svg.text, 'EX', 60 * 5);
      return result;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  /**
   * 校验验证码
   * @param id 验证码对应的id
   * @param code 验证码
   */
  async checkImgCaptcha(id: string, code: string): Promise<void> {
    const result = await this.redisService
      .getRedis()
      .get(`admin:captcha:img:${id}`);
    if (isEmpty(result) || code.toLowerCase() !== result.toLowerCase()) {
      throw new BusinessException(10002);
    }
    await this.redisService.getRedis().del(`admin:captcha:img:${id}`);
  }

  /**
   * 获取登录jwt
   * @param username
   * @param password
   */
  async getLoginSign(
    username: string,
    password: string,
    ip: string,
    ua: string,
  ): Promise<string> {
    try {
      // 先查询库里是否有该用户
      const user = await this.userService.findUserByUserName(username);
      if (isEmpty(user)) {
        throw new BusinessException(10003);
      }
      // 检查密码是否正确
      const comparePassword = this.utilService.md5(`${password}${user.psalt}`);
      if (user.password !== comparePassword) {
        throw new BusinessException(10003);
      }

      const jwtSign = this.jwtService.sign({
        uid: parseInt(user.id.toString()),
        pv: 1,
      });
      // 设置token过期时间为24h
      await this.redisService
        .getRedis()
        .set(`admin:token:${user.id}`, jwtSign, 'EX', 60 * 60 * 24);
      // 保存登录日志
      await this.logService.saveLoginLog(user.id, ip, ua);
      return jwtSign;
    } catch (error) {
      console.log('出错了', error);
      throw new Error(error);
    }
  }
}
