import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateDeptDto {
  @ApiProperty({ description: '部门名称' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: '父级部门id', required: false })
  @IsInt()
  parentId: number;

  @ApiProperty({ description: '排序编号', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderNum: number;
}

export class UpdateDepDto extends CreateDeptDto {
  @ApiProperty({ description: '更新部门的id', required: true })
  @IsInt()
  id: number;
}

export class DeleteDepDto {
  @ApiProperty({ description: '删除部门的id', required: true })
  @IsInt()
  @Min(0)
  departmentId: number;
}

export class MoveDeptDto {
  @ApiProperty({ description: '当前部门id' })
  @IsInt()
  @Min(0)
  id: number;

  @ApiProperty({ description: '移动到的部门id' })
  @IsOptional()
  @IsInt()
  @Min(0)
  parentId: number;
}
