import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { isEmpty } from 'lodash';
import { CreateUserDto } from './user.dto';
import { BusinessException } from '@/common/exceptions/business.exception';
import { UtilService } from '@/shared/services/util.service';
import SysUser from '@/entities/admin/sys-user.entity';
import SysUserRole from '@/entities/admin/sys-user-role.entity';

@Injectable()
export class SysUserService {
  constructor(
    @InjectRepository(SysUser)
    private readonly userRepository: Repository<SysUser>,
    @InjectEntityManager() private entityManager: EntityManager,
    private readonly utilService: UtilService,
  ) {}

  /**
   * 添加用户
   * @param dto
   */
  async add(dto: CreateUserDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (!isEmpty(user)) {
      throw new BusinessException(10001);
    }
    // 初始化密码为123456 (先写死，之后写到 参数配置模块再改成动态获取)
    await this.entityManager.transaction(async (manager) => {
      // 生成一个盐值
      const salt = this.utilService.generateRandomValue(32);
      const initPassword = '123456';

      const password = this.utilService.md5(initPassword + salt);
      const user = manager.create(SysUser, {
        departmentId: dto.departmentId,
        name: dto.name,
        username: dto.username,
        password,
        nickName: dto.nickName,
        email: dto.email,
        phone: dto.phone,
        remark: dto.remark,
        status: dto.status,
        psalt: salt,
      });
      const result = await manager.save(user);
      // 分配角色
      const insertRoles = dto.roles.map((item) => ({
        roleId: item,
        userId: result.id,
      }));
      await this.entityManager.insert(SysUserRole, insertRoles);
    });
  }

  async findUserByUserName(username: string): Promise<SysUser | undefined> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }
}
