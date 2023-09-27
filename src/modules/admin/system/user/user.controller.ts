import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SysUserService } from './user.service';
import { CreateUserDto } from './user.dto';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: SysUserService) {}

  @ApiOperation({ summary: '添加系统用户' })
  @Post('add')
  async add(@Body() dto: CreateUserDto): Promise<void> {
    try {
      await this.userService.add(dto);
    } catch (error) {}
  }
}
