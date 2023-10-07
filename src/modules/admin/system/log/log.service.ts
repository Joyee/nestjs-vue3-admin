import { LoginLogInfo } from './log.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { UAParser } from 'ua-parser-js'
import LoginLog from '@/entities/admin/sys-login-log.entity';
import { UtilService } from '@/shared/services/util.service';
import SysUser from '@/entities/admin/sys-user.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LoginLog)
    private loginLogRepository: Repository<LoginLog>,
    private readonly utilService: UtilService,
    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>,
  ) {}

  /**
   * 记录登录日志
   * @param uid
   * @param ip
   * @param ua
   */
  async saveLoginLog(uid: number, ip: string, ua: string): Promise<void> {
    const loginLocation = await this.utilService.getLocation(
      ip.split(',').at(-1).trim(),
    );
    await this.loginLogRepository.save({
      ip,
      userId: uid,
      ua,
      loginLocation,
    });
  }

  /**
   * 计算登录日志总数
   */
  async countLoginLog(): Promise<number> {
    const userIds = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id'])
      .getMany();
    return await this.loginLogRepository.count({
      where: { userId: In(userIds.map((n) => n.id)) },
    });
  }

  /**
   * 分页加载登录日志
   */
  async pageGetLoginLog(page: number, count: number): Promise<LoginLogInfo[]> {
    const result = await this.loginLogRepository
      .createQueryBuilder('login_log')
      .innerJoinAndSelect('sys_user', 'user', 'login_log.user_id = user.id')
      .orderBy('login_log.created_at', 'DESC')
      .offset(page * count)
      .limit(count)
      .getRawMany();
    const parser = new UAParser();
    return result.map((e) => {
      const ua = parser.setUA(e.login_log_ua).getResult();
      return {
        id: e.login_log_id,
        ip: e.login_log_ip,
        os: `${ua.os.name} ${ua.os.version}`,
        browser: `${ua.browser.name} ${ua.browser.version}`,
        time: e.login_log_created_at,
        username: e.user_username,
        loginLocation: e.login_log_login_location,
      }
    })
  }
}
