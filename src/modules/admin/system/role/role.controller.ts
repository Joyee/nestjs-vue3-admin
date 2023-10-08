import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import {
  CreateRoleDto,
  DeleteRoleDto,
  InfoRoleDto,
  PageSearchRoleDto,
  UpdateRoleDto,
} from './role.dto';
import SysRole from '@/entities/admin/sys-role.entity';
import {
  ApiOkResponsePaginated,
  PaginatedResponseDto,
} from '@/common/class/response.class';
import { BusinessException } from '@/common/exceptions/business.exception';
import { AdminUser } from '../../core/decorators/admin-user.decorator';
import { IAdminUser } from '../../admin.interface';
import { ADMIN_PREFIX } from '../../admin.constants';
import { RoleInfo } from './role.interface';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('角色模块')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({ summary: '添加角色' })
  @Post('add')
  async add(
    @Body() dto: CreateRoleDto,
    @AdminUser() user: IAdminUser,
  ): Promise<void> {
    await this.roleService.add(dto, user.uid);
  }

  @ApiOperation({ summary: '角色列表' })
  @ApiOkResponse({ type: [SysRole] })
  @Get('list')
  async list(): Promise<SysRole[]> {
    return await this.roleService.list();
  }

  @ApiOperation({ summary: '分页查询角色列表' })
  @ApiOkResponsePaginated(SysRole)
  @Get('page')
  async page(
    @Query() dto: PageSearchRoleDto,
  ): Promise<PaginatedResponseDto<SysRole>> {
    const [list, total] = await this.roleService.page(dto);
    return {
      list,
      pagination: {
        total,
        size: dto.limit,
        page: dto.page,
      },
    };
  }

  @ApiOperation({ summary: '更新角色' })
  @Post('update')
  async update(
    @Body() dto: UpdateRoleDto,
    @AdminUser() user: IAdminUser,
  ): Promise<void> {
    await this.roleService.update(dto, user.uid);
    // TODO 更新在线用户的权限菜单
  }

  @ApiOperation({ summary: '批量删除角色' })
  @Post('delete')
  async delete(@Body() dto: DeleteRoleDto): Promise<void> {
    // 先查询角色下是否有关联用户
    const userCount = await this.roleService.countUserIdByRole(dto.roleIds);
    if (userCount > 0) {
      throw new BusinessException(10008);
    }
    await this.roleService.delete(dto.roleIds);
    // TODO 更新在线用户权限
  }

  @ApiOperation({ summary: '获取角色信息' })
  @Get('info')
  async info(@Query() dto: InfoRoleDto): Promise<RoleInfo> {
    return await this.roleService.info(dto.roleId);
  }
}
