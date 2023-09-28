import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Min, IsInt } from 'class-validator';

export class PageOptionsDto {
  @ApiProperty({
    description: '当前页包含数量',
    default: 10,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit: 10;

  @ApiProperty({ description: '当前页码', default: 1, required: false })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page = 1;
}
