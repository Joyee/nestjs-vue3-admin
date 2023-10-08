import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { includes, isEmpty, concat, uniq } from 'lodash';
import SysMenu from '@/entities/admin/sys-menu.entity';
import { RoleService } from '../role/role.service';
import { ROOT_ROLE_ID } from '../../admin.constants';
import { CreateMenuDto, UpdateMenuDto } from './menu.dto';
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(SysMenu) private menuRepository: Repository<SysMenu>,
    private roleService: RoleService,
    @Inject(ROOT_ROLE_ID) private rootRoleId: number,
  ) {}

  /**
   * 根据用户角色获取所有菜单
   * @param uid
   */
  async getMenus(uid: number): Promise<SysMenu[]> {
    const roleIds = await this.roleService.getRoleIdByUser(uid);
    let menus: SysMenu[] = [];
    if (includes(roleIds, this.rootRoleId)) {
      menus = await this.menuRepository.find();
    } else {
      menus = await this.menuRepository
        .createQueryBuilder('menu')
        .innerJoinAndSelect(
          'sys_role_menu',
          'role_menu',
          'menu.id = role_menu.menu_id',
        )
        .andWhere('role_menu.role_id IN (:...roleIds)', { roleIds })
        .orderBy('menu.order_num', 'DESC')
        .getMany();
    }

    return menus;
  }

  /**
   * 根据用户uid获取所有权限
   */
  async getPermissions(uid: number): Promise<string[]> {
    // 先根据用户id获取角色id
    const roleIds = await this.roleService.getRoleIdByUser(uid);
    let perms: string[] = [];
    let result: SysMenu[] = [];
    // 根据角色获取菜单，如果角色是超级管理员 就直接获取全部权限
    if (includes(roleIds, this.rootRoleId)) {
      result = await this.menuRepository.find({
        where: { perms: Not(IsNull()), type: 2 },
      });
    } else {
      // 按条件查询
      result = await this.menuRepository
        .createQueryBuilder('menu')
        .innerJoinAndSelect(
          'sys_role_menu',
          'role_menu',
          'menu.id = role_menu.menu_id',
        )
        .andWhere('role_menu.role_id IN (:...roleIds)', { roleIds: roleIds })
        .andWhere('menu.type = 2')
        .andWhere('menu.perms IS NOT NULL')
        .getMany();
    }

    if (!isEmpty(result)) {
      result.forEach((e) => {
        perms = concat(perms, e.perms.split(','));
      });
      perms = uniq(perms);
    }

    return perms;
  }

  /**
   * 新增菜单
   * @param params
   */
  async add(params: CreateMenuDto): Promise<void> {
    await this.menuRepository.insert(params);
    // TODO 通知用户更新权限菜单
  }

  /**
   * 更新菜单
   * @param params
   */
  async update(params: UpdateMenuDto): Promise<void> {
    await this.menuRepository.save(params);
    // TODO 通知用户更新权限菜单
  }

  async delete() {}
}
