import { Controller, Get, Post, Body } from '@nestjs/common';
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
import { CreateMenuDto } from './menu.dto';

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

  @ApiOperation({ summary: '新增菜单' })
  @Post('add')
  async add(@Body() dto: CreateMenuDto): Promise<void> {
    await this.menuService.add(dto);
  }
}
