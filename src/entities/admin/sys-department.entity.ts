import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'sys_department' })
export default class SysDepartment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ description: '父级菜单id' })
  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @ApiProperty({ description: '排序' })
  @Column({ name: 'order_num', type: 'int', default: 0, nullable: true })
  orderNum: number;
}
