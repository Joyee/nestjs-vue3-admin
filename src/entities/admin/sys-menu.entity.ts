import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Entity({ name: 'sys_menu' })
export default class SysMenu extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ name: '菜单名称' })
  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({ required: false })
  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @ApiProperty({ description: '菜单地址' })
  @Column({ nullable: true, default: '' })
  router: string;

  @ApiProperty({ description: '对应vue文件' })
  @IsString()
  @Column({ name: 'view_path', nullable: true, default: true })
  viewPath: string;

  @ApiProperty({ description: '类型', default: 0 })
  @IsIn([0, 1, 2])
  @Column({
    type: 'tinyint',
    width: 1,
    default: 0,
    comment: '类型: 0-目录 1-菜单 2-按钮',
  })
  type: number;

  @ApiProperty({ description: '图标' })
  @IsString()
  @Column({ nullable: true, default: '' })
  icon: string;

  @ApiProperty({ description: '排序' })
  @IsNumber()
  @Column({ name: 'order_num', type: 'int', default: 0, nullable: true })
  orderNum: number;

  @ApiProperty()
  @Column({ type: 'boolean', nullable: true, default: true })
  keepalive: boolean;

  @ApiProperty()
  @Column({ name: 'is_show', type: 'boolean', nullable: true, default: true })
  isShow: boolean;

  @ApiProperty({ description: '权限标识' })
  @Column({ nullable: true, default: '' })
  perms: string;

  @ApiProperty({ description: '是否是外链', required: false, default: false })
  @Column({ type: 'boolean', nullable: true, default: false })
  isExt: boolean;

  @ApiProperty({ description: '外链打开方式' })
  @Column({ name: 'open_mode', nullable: true, default: 1 })
  openMode: number;
}
