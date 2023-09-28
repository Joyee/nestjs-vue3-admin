import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { ImageCaptchaDto, LoginInfoDto, DecryptDto } from './login.dto';
import { ImageCaptcha, LoginToken } from './login.interface';
import { UtilService } from '@/shared/services/util.service';

@ApiTags('登录模块')
@Controller()
export class LoginController {
  constructor(
    private loginService: LoginService,
    private utilService: UtilService,
  ) {}

  @ApiOperation({ summary: '获取登录图片验证码' })
  @Get('captcha/img')
  async getCaptchaByImg(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
    return await this.loginService.createImageCaptcha(dto);
  }

  @ApiOperation({ summary: '登录' })
  @Post('login')
  async login(@Body() dto: LoginInfoDto): Promise<LoginToken> {
    // 先校验验证码
    await this.loginService.checkImgCaptcha(dto.captchaId, dto.verifyCode);
    const token = await this.loginService.getLoginSign(
      dto.username,
      dto.password,
    );
    return { token: '' };
  }
}
