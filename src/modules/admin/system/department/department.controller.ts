import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDeptDto, DeleteDepDto, UpdateDepDto } from './department.dto';
import { DepartmentService } from './department.service';
import SysDepartment from '@/entities/admin/sys-department.entity';
import { DeptDetailInfo } from './department.interface';

@ApiTags('部门模块')
@Controller('dept')
export class DepartmentController {
  constructor(private deptService: DepartmentService) {}

  @ApiOperation({ summary: '新增部门' })
  @Post('add')
  async add(@Body() dto: CreateDeptDto): Promise<void> {
    await this.deptService.add(dto.name, dto.parentId);
  }

  @ApiOperation({ summary: '删除部门' })
  @Post('delete')
  async delete(@Body() dto: DeleteDepDto): Promise<void> {
    await this.deptService.delete(dto.departmentId);
  }

  @ApiOperation({ summary: '部门列表' })
  @Get('list')
  async list(): Promise<SysDepartment[]> {
    return await this.deptService.list();
  }

  @ApiOperation({ summary: '更新部门' })
  @Post('update')
  async update(@Body() dto: UpdateDepDto): Promise<void> {
    await this.deptService.update(dto);
  }

  @ApiOperation({ summary: '查询指定部门信息' })
  @Get(':id')
  async info(@Param('id') id: string): Promise<DeptDetailInfo> {
    console.log(id);
    return await this.deptService.info(+id);
  }
}
