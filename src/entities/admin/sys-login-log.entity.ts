import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'sys_login_log' })
export default class LoginLog extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ApiProperty()
  @Column()
  ip: string;

  @ApiProperty()
  @Column({ length: 500, nullable: true })
  ua: string;

  @ApiProperty({ description: '登录地点' })
  @Column({ name: 'login_location', nullable: true, default: '' })
  loginLocation: string;

  @ApiProperty()
  @Column({ type: 'datetime', nullable: true })
  time: Date;
}
