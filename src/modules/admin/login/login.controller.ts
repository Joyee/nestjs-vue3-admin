import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { Query } from '@nestjs/common';
import { ImageCaptchaDto } from './login.dto';
import { ImageCaptcha } from './login.class';

@ApiTags('登录模块')
@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @ApiOperation({ summary: '获取登录图片验证码' })
  @Get('captcha/img')
  async getCaptchaByImg(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
    return await this.loginService.createImageCaptcha(dto);
  }
}
