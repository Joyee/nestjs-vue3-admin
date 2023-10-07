import { Module } from '@nestjs/common';
import { SysUserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { MenuService } from './menu/menu.service';
import { DepartmentService } from './department/department.service';
import { DepartmentController } from './department/department.controller';
import { RoleService } from './role/role.service';
import SysUser from '@/entities/admin/sys-user.entity';
import SysRole from '@/entities/admin/sys-role.entity';
import SysUserRole from '@/entities/admin/sys-user-role.entity';
import SysMenu from '@/entities/admin/sys-menu.entity';
import SysDepartment from '@/entities/admin/sys-department.entity';
import SysRoleDepartment from '@/entities/admin/sys-role-department.entity';
import SysRoleMenu from '@/entities/admin/sys-role-menu.entity';
import { rootRoleIdProvider } from '../core/provider/root-role-id.provider';
import { RoleController } from './role/role.controller';
import { LogService } from './log/log.service';
import { LogController } from './log/log.controller';
import LoginLog from '@/entities/admin/sys-login-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SysUser,
      SysRole,
      SysUserRole,
      SysMenu,
      SysDepartment,
      SysRoleDepartment,
      SysRoleMenu,
      LoginLog,
    ]),
  ],
  providers: [
    rootRoleIdProvider(),
    SysUserService,
    MenuService,
    DepartmentService,
    RoleService,
    LogService,
  ],
  controllers: [
    UserController,
    DepartmentController,
    RoleController,
    LogController,
  ],
  exports: [SysUserService, LogService],
})
export class SystemModule {}
