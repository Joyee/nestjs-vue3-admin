import { Module } from '@nestjs/common';
import { SysUserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { MenuService } from './menu/menu.service';
import { DepartmentService } from './department/department.service';
import { DepartmentController } from './department/department.controller';
import SysUser from '@/entities/admin/sys-user.entity';
import SysRole from '@/entities/admin/sys-role.entity';
import SysUserRole from '@/entities/admin/sys-user-role.entity';
import SysMenu from '@/entities/admin/sys-menu.entity';
import SysDepartment from '@/entities/admin/sys-department.entity';
import SysRoleDepartment from '@/entities/admin/sys-role-department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SysUser,
      SysRole,
      SysUserRole,
      SysMenu,
      SysDepartment,
      SysRoleDepartment,
      SysRoleDepartment,
    ]),
  ],
  providers: [SysUserService, MenuService, DepartmentService],
  controllers: [UserController, DepartmentController],
})
export class SystemModule {}
