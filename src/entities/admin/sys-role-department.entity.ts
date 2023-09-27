import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'sys_role_department' })
export default class SysRoleDepartment extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'role_id' })
  roleId: number;

  @ApiProperty()
  @Column({ name: 'department_id' })
  departmentId: number;
}
