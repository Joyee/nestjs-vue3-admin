import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Controller, Get, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ADMIN_PREFIX } from '../admin.constants';
import { SysUserService } from '../system/user/user.service';
import { AdminUser } from '../core/decorators/admin-user.decorator';
import { IAdminUser } from '../admin.interface';
import { AccountInfo } from '../system/user/user.class';
import { UtilService } from '@/shared/services/util.service';
import { PermissionOptional } from '../core/decorators/permission-optional.decorator';
import { PermissionMenuInfo } from '../login/login.interface';
import { LoginService } from '../login/login.service';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('账户模块')
@Controller('')
export class AccountController {
  constructor(
    private userService: SysUserService,
    private utilService: UtilService,
    private loginService: LoginService,
  ) {}

  @ApiOperation({ summary: '获取管理员资料' })
  @ApiOkResponse({ type: AccountInfo })
  @PermissionOptional()
  @Get('info')
  async info(
    @AdminUser() user: IAdminUser,
    @Req() req: FastifyRequest,
  ): Promise<AccountInfo> {
    return await this.userService.getAccountInfo(
      user.uid,
      this.utilService.getReqIP(req),
    );
  }

  @ApiOperation({ summary: '获取菜单列表及权限列表' })
  @ApiOkResponse({ type: PermissionMenuInfo })
  @PermissionOptional()
  @Get('permmenu')
  async permmenu(@AdminUser() user: IAdminUser): Promise<PermissionMenuInfo> {
    return await this.loginService.getPermissionMenu(user.uid);
  }
}
