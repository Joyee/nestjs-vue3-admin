import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager, In, Not, Like } from 'typeorm';
import { isEmpty, difference, filter, includes } from 'lodash';
import { CreateRoleDto, PageSearchRoleDto, UpdateRoleDto } from './role.dto';
import SysRoleMenu from '@/entities/admin/sys-role-menu.entity';
import SysRoleDepartment from '@/entities/admin/sys-role-department.entity';
import { CreateRoleId, RoleInfo } from './role.interface';
import SysRole from '@/entities/admin/sys-role.entity';
import { ROOT_ROLE_ID } from '../../admin.constants';
import SysUserRole from '@/entities/admin/sys-user-role.entity';
import { map } from 'lodash';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(SysRole) private roleRepository: Repository<SysRole>,
    @InjectRepository(SysRoleMenu)
    private roleMenuRepository: Repository<SysRoleMenu>,
    @InjectRepository(SysRoleDepartment)
    private roleDeptRepository: Repository<SysRoleDepartment>,
    @InjectEntityManager() private entityManager: EntityManager,
    @Inject(ROOT_ROLE_ID) private rootRoleId: number,
    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>,
  ) {}

  /**
   * 新增角色
   */
  async add(dto: CreateRoleDto, uid: number): Promise<CreateRoleId> {
    const { name, label, remark, menus, depts } = dto;
    const role = await this.roleRepository.insert({
      name,
      label,
      remark,
      userId: `${uid}`,
    });
    const roleId = parseInt(role.identifiers[0].id);
    if (menus && menus.length > 0) {
      const insertRows = menus.map((item) => ({ menuId: item, roleId }));
      await this.roleMenuRepository.insert(insertRows);
    }
    if (depts && depts.length > 0) {
      const insertRows = depts.map((item) => ({
        departmentId: item,
        roleId,
      })) as SysRoleDepartment[];
      await this.roleDeptRepository.insert(insertRows);
    }

    return { roleId };
  }

  async update(dto: UpdateRoleDto, uid: number): Promise<SysRole> {
    const foundRole = await this.roleRepository.findOneBy({ id: dto.roleId });
    if (isEmpty(foundRole)) {
      throw new Error('该角色不存在');
    }
    const { roleId, name, label, remark, depts, menus } = dto;
    const role = await this.roleRepository.save({
      id: roleId,
      name,
      label,
      remark,
    });
    const originDeptRows = await this.roleDeptRepository.find({
      where: { roleId },
    });
    const originDeptIds = originDeptRows.map((item) => item.departmentId);
    const originMenuRows = await this.roleMenuRepository.find({
      where: { roleId },
    });
    const originMenuIds = originMenuRows.map((item) => item.menuId);

    const insertDeptRowIds = difference(depts, originDeptIds);
    const deleteDeptRowIds = difference(originDeptIds, depts);

    const insertMenuRowIds = difference(menus, originMenuIds);
    const deleteMenuRowIds = difference(originMenuIds, menus);

    await this.entityManager.transaction(async (transcationManager) => {
      if (insertDeptRowIds.length > 0) {
        const insertDeptRows = insertDeptRowIds.map((item) => ({
          roleId,
          departmentId: item,
        })) as SysRoleDepartment[];
        await transcationManager.insert(SysRoleDepartment, insertDeptRows);
      }
      if (deleteDeptRowIds.length > 0) {
        const realDeleteRowIds = filter(originDeptRows, (e) =>
          includes(deleteDeptRowIds, e.departmentId),
        ).map((e) => e.id);
        await transcationManager.delete(SysRoleDepartment, realDeleteRowIds);
      }

      if (insertMenuRowIds.length > 0) {
        const insertMenuRows = insertMenuRowIds.map((item) => ({
          roleId,
          menuId: item,
        })) as SysRoleMenu[];
        await transcationManager.insert(SysRoleMenu, insertMenuRows);
      }
      if (deleteMenuRowIds.length > 0) {
        const realDeleteRowIds = filter(originMenuRows, (e) =>
          includes(originMenuIds, e.menuId),
        ).map((e) => e.id);
        await transcationManager.delete(SysRoleMenu, realDeleteRowIds);
      }
    });
    return role;
  }

  /**
   * 批量删除角色
   * @param roleIds
   */
  async delete(roleIds: number[]): Promise<void> {
    if (includes(roleIds, this.rootRoleId)) {
      throw new Error('不能删除超级管理员角色');
    }
    await this.entityManager.transaction(async (transactionManager) => {
      await transactionManager.delete(SysRole, roleIds);
      await transactionManager.delete(SysRoleMenu, { roleIds: In(roleIds) });
      await transactionManager.delete(SysRoleMenu, { roleIds: In(roleIds) });
    });
  }

  /**
   * 获取单个角色信息
   * @param roleId
   */
  async info(roleId: number): Promise<RoleInfo> {
    const roleInfo = await this.roleRepository.findOne({
      where: { id: roleId },
    });
    const menus = await this.roleMenuRepository.find({
      where: { roleId },
    });
    const departments = await this.roleDeptRepository.find({
      where: { roleId },
    });
    return { roleInfo, menus, depts: departments };
  }

  /**
   * 角色列表，不包括超级管理员
   */
  async list(): Promise<SysRole[]> {
    return await this.roleRepository.find({
      where: { id: Not(this.rootRoleId) },
    });
  }

  /**
   * 分页查询角色列表
   */
  async page(dto: PageSearchRoleDto): Promise<[SysRole[], number]> {
    return await this.roleRepository.findAndCount({
      where: {
        id: Not(this.rootRoleId),
        name: Like(`%${dto.name}%`),
        label: Like(`%${dto.label}%`),
        remark: Like(`%${dto.remark}%`),
      },
      order: { id: 'DESC' },
      take: dto.limit, // 指定查询结果的数量（分页，设置每一页返回多少）
      skip: (dto.page - 1) * dto.limit, // 指定查询结果的起始位置
    });
  }

  /**
   * 根据用户id查找角色id集合
   * @param uid
   */
  async getRoleIdByUser(uid: number): Promise<number[]> {
    const result = await this.userRoleRepository.find({
      where: { userId: uid },
    });
    if (!isEmpty(result)) {
      return map(result, (n) => n.roleId);
    }
    return [];
  }

  /**
   * 根据角色ID列表查找关联用户ID
   * @param roleIds
   */
  async countUserIdByRole(roleIds: number[]): Promise<number | never> {
    if (includes(roleIds, this.rootRoleId)) {
      throw new Error('不能删除超级管理员');
    }
    return await this.userRoleRepository.count({
      where: { roleId: In(roleIds) },
    });
  }
}
