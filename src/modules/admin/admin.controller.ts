import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin模块')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiOperation({ summary: '测试' })
  @Get()
  findAll() {
    this.adminService.findAll();
  }
}
