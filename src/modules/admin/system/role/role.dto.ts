import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PageOptionsDto } from '@/common/dto/page.dto';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: '角色唯一标识符' })
  @IsString()
  @Matches(/^[a-z0-9A-Z]+$/)
  label: string;

  @ApiProperty({ description: '角色备注' })
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty({ description: '关联菜单id集合', required: false })
  @IsOptional()
  @IsArray()
  menus: number[];

  @ApiProperty({ description: '关联部门id集合', required: false })
  @IsOptional()
  @IsArray()
  depts: number[];
}

export class UpdateRoleDto extends CreateRoleDto {
  @ApiProperty({ description: '更新的角色id' })
  @IsInt()
  @Min(0)
  roleId: number;
}

export class InfoRoleDto {
  @ApiProperty({ description: '查询的角色id' })
  @IsInt()
  @Min(0)
  @Type(() => Number) // 将属性值转换为数字类型。如果属性值无法转换为数字类型，将会抛出一个转换错误
  roleId: number;
}

export class PageSearchRoleDto extends PageOptionsDto {
  @ApiProperty({ description: '角色名称', required: false })
  @IsString()
  @IsOptional()
  name: string = '';

  @ApiProperty({ description: '角色唯一标识', required: false })
  @IsString()
  @IsOptional()
  label: string = '';

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  remark: string = '';
}
