import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'sys_role_menu' })
export default class SysRoleMenu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'role_id' })
  roleId: number;

  @ApiProperty()
  @Column({ name: 'menu_id' })
  menuId: number;
}
