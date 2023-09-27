import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsEmail,
  IsOptional,
  Min,
  MinLength,
  Matches,
  MaxLength,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateIf,
  isEmpty,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '所属部门编号' })
  @IsInt()
  @Min(0)
  departmentId: number;

  @ApiProperty({ description: '用户姓名' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: '登录账号' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9A-Z]+$/)
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    description: '归属角色',
    type: [Number],
  })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  roles: number[];

  @ApiProperty({ description: '昵称', required: false })
  @IsOptional()
  @IsString()
  nickName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  headImg: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  @ValidateIf((o) => !isEmpty(o.email))
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  remark: string;

  @ApiProperty({ description: '状态' })
  @IsIn([0, 1])
  status: number;
}
