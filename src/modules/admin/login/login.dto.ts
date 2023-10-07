import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class ImageCaptchaDto {
  @ApiProperty({ description: '验证码宽度' })
  @Type(() => Number) // width属性的类型转换为数字类型
  @IsInt() // width属性进行验证，确保其为整数类型，并且可以是可选的。
  @IsOptional() // 可以是可选的。
  readonly width: number = 100; // 默认值为100。

  @ApiProperty({ description: '验证码高度' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly height: number = 50;
}

export class LoginInfoDto {
  @ApiProperty({ description: '管理员用户名' })
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty({ description: '管理员密码' })
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({ description: '验证码标识' })
  @IsString()
  captchaId: string;

  @ApiProperty({ description: '用户输入的验证码' })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  verifyCode: string;
}
