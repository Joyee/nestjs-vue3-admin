import { Controller, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { ADMIN_PREFIX } from '../../admin.constants';
import SysMenu from '@/entities/admin/sys-menu.entity';
import { AdminUser } from '../../core/decorators/admin-user.decorator';
import { IAdminUser } from '../../admin.interface';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('菜单权限模块')
@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @ApiOperation({ summary: '获取对应权限的菜单列表' })
  @ApiOkResponse({ type: [SysMenu] })
  @Get('list')
  async list(@AdminUser() user: IAdminUser): Promise<SysMenu[]> {
    return await this.menuService.getMenus(user.uid);
  }
}
