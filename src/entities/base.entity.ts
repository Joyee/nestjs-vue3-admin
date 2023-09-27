import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' }) // name属性用于指定数据库表中对应的列名。如果不指定name属性，则TypeORM默认会将属性名转换为下划线分隔的列名。例如，如果属性名为createdAt，则默认列名为created_at。如果指定了name属性，则TypeORM会将该属性映射到指定的列名。
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;
}
