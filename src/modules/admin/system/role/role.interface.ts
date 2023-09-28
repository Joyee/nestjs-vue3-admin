import { ApiProperty } from '@nestjs/swagger';
import SysRoleDepartment from '@/entities/admin/sys-role-department.entity';
import SysRoleMenu from '@/entities/admin/sys-role-menu.entity';
import SysRole from '@/entities/admin/sys-role.entity';

export class CreateRoleId {
  roleId: number;
}

export class RoleInfo {
  @ApiProperty({ type: [SysRole] })
  roleInfo: SysRole;

  @ApiProperty({ type: [SysRoleMenu] })
  menus: SysRoleMenu[];

  @ApiProperty({ type: [SysRoleDepartment] })
  depts: SysRoleDepartment[];
}
