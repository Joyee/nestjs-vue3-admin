import SysDepartment from '@/entities/admin/sys-department.entity';
import { ApiProperty } from '@nestjs/swagger';

export class DeptDetailInfo {
  @ApiProperty({ description: '当前查询的部门信息' })
  department?: SysDepartment;

  @ApiProperty({ description: '所属父级部门' })
  parentDepartment?: SysDepartment;
}
