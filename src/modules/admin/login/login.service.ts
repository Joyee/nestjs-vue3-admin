import { Injectable } from '@nestjs/common';
import * as svgCaptcah from 'svg-captcha';
import { isEmpty } from 'lodash';
import { ImageCaptchaDto } from './login.dto';
import { UtilService } from '@/shared/services/util.service';
import { RedisService } from '@/shared/redis/redis.service';

@Injectable()
export class LoginService {
  constructor(
    private utilService: UtilService,
    private redisService: RedisService,
  ) {}

  async createImageCaptcha(captcha: ImageCaptchaDto) {
    const svg = svgCaptcah.create({
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
      this.redisService.getRedis().set(`admin:captcha:img:${result.id}`, svg.text, 'EX', 60 * 5);
      return result;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
