import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../base.entity';

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class SysUser extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'department_id' })
  departmentId: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty({ description: '盐值' })
  @Column({ length: 32 })
  psalt: string;

  @ApiProperty()
  @Column({ name: 'nick_name', nullable: true })
  nickName: string;

  @ApiProperty()
  @Column({ name: 'head_img', nullable: true, default: '' })
  headImg: string;

  @ApiProperty()
  @Column({ nullable: true, default: '' })
  email: string;

  @ApiProperty()
  @Column({ nullable: true, default: '' })
  phone: string;

  @ApiProperty()
  @Column({ nullable: true, default: '' })
  remark: string;

  @ApiProperty()
  @Column({ nullable: true, default: 1, type: 'tinyint' })
  status: number;
}
