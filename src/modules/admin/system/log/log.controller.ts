import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { LoginLogInfo } from './log.interface';
import { ADMIN_PREFIX } from '../../admin.constants';
import { PaginatedResponseDto } from '@/common/class/response.class';
import { PageOptionsDto } from '@/common/dto/page.dto';
import { ApiOkResponsePaginated } from '@/common/class/response.class';

@ApiSecurity(ADMIN_PREFIX)
@ApiTags('日志模块')
@Controller('log')
export class LogController {
  constructor(private logService: LogService) {}

  @ApiOperation({ summary: '分页查询登录日志' })
  @ApiOkResponsePaginated(LoginLogInfo)
  @Get('login/page')
  async loginLogPage(
    @Query() dto: PageOptionsDto,
  ): Promise<PaginatedResponseDto<LoginLogInfo>> {
    const list = await this.logService.pageGetLoginLog(dto.page, dto.limit);
    const count = await this.logService.countLoginLog();
    return {
      list,
      pagination: {
        total: count,
        size: dto.limit,
        page: dto.page,
      },
    };
  }
}
