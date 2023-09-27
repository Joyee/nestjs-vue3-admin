import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { isEmpty } from 'lodash';
import SysDepartment from '@/entities/admin/sys-department.entity';
import { DeleteDepDto, MoveDeptDto, UpdateDepDto } from './department.dto';
import { BusinessException } from '@/common/exceptions/business.exception';
import { DeptDetailInfo } from './department.interface';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(SysDepartment)
    private departmentRepository: Repository<SysDepartment>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  /**
   * 新增部门
   * @param name
   * @param parentId
   */
  async add(name: string, parentId: number): Promise<void> {
    await this.departmentRepository.insert({
      name,
      parentId: parentId === -1 ? null : parentId,
    });
  }

  /**
   * 更新部门信息
   * @param dto
   */
  async update(dto: UpdateDepDto): Promise<void> {
    const found = await this.departmentRepository.findOneBy({ id: dto.id });
    if (isEmpty(found)) {
      throw new BusinessException(10019);
    }
    await this.departmentRepository.update(dto.id, {
      name: dto.name,
      parentId: dto.parentId === -1 ? null : dto.parentId,
      orderNum: dto.orderNum,
    });
  }

  /**
   * 删除指定部门
   * @param dto
   */
  async delete(id: number): Promise<void> {
    await this.departmentRepository.delete(id);
  }

  /**
   * 查询指定部门信息
   */
  async info(id: number): Promise<DeptDetailInfo> {
    const department = await this.departmentRepository.findOneBy({ id });
    if (isEmpty(department)) {
      throw new BusinessException(10019);
    }
    // 如果 parentId不为null，则获取父级部门信息
    let parentDepartment = null;
    if (department.parentId) {
      parentDepartment = await this.departmentRepository.findOne({
        where: { id: department.parentId },
      });
    }

    return { department, parentDepartment };
  }

  async list(): Promise<SysDepartment[]> {
    return await this.departmentRepository.find({
      order: { orderNum: 'DESC' },
    });
  }

  async move(depts: MoveDeptDto[]): Promise<void> {
    await this.entityManager.transaction(async (transactionEntityManager) => {
      for (const dept of depts) {
        const queryBuilder = transactionEntityManager.createQueryBuilder(
          SysDepartment,
          'department',
        );
        const targetDepartment = await queryBuilder
          .where('department.id = :id', { id: dept.parentId })
          .getOne();
        if (!targetDepartment) {
          throw new BusinessException(10018);
        }
        const targetOrderNum = await this.getMaxOrderNumByParentId(
          targetDepartment.id,
          transactionEntityManager,
        );
        const sourceDepartment = await transactionEntityManager.findOne(
          SysDepartment,
          { where: { id: dept.id } },
        );
        if (sourceDepartment.parentId === dept.parentId) {
          if (sourceDepartment.orderNum !== targetOrderNum) {
            if (sourceDepartment.orderNum < targetOrderNum) {
              queryBuilder
                .update()
                .set({ orderNum: () => `order_num - 1` })
                .where(
                  'order_num > :sourceOrderNum AND order_num <= :targetOrderNum',
                  { sourceOrderNum: sourceDepartment.orderNum, targetOrderNum },
                );
            } else {
              queryBuilder
                .update()
                .set({ orderNum: () => `order_num + 1` })
                .where(
                  'order_num >= :targetOrderNum AND order_num < :sourceOrderNum',
                  { sourceOrderNum: sourceDepartment.orderNum, targetOrderNum },
                );
            }
            await queryBuilder.execute();
            sourceDepartment.orderNum = targetOrderNum + 1;
            await transactionEntityManager.save(sourceDepartment);
          }
        } else {
          const maxOrderNum = await this.getMaxOrderNumByParentId(
            dept.parentId,
            transactionEntityManager,
          );
          if (dept.parentId) {
            const newOrderNum = targetOrderNum + 1;
            if (newOrderNum <= maxOrderNum) {
              queryBuilder
                .update()
                .set({ orderNum: () => `order_num + 1` })
                .where('order_num >= :orderNum AND order_num <= :maxOrderNum', {
                  orderNum: newOrderNum,
                  maxOrderNum,
                });
              await queryBuilder.execute();
            }
            sourceDepartment.orderNum = newOrderNum;
          } else {
            const newOrderNum = maxOrderNum ? maxOrderNum + 1 : 1;
            sourceDepartment.orderNum = newOrderNum;
          }
          sourceDepartment.parentId = dept.parentId;
          await transactionEntityManager.save(sourceDepartment);
        }
      }
    });
  }

  async getMaxOrderNumByParentId(parentId: number, manager: EntityManager) {
    const queryBuilder = manager.createQueryBuilder(
      SysDepartment,
      'department',
    );
    const maxOrderNumDept = await queryBuilder
      .select('MAX(department.orderNum)', 'maxOrderNum')
      .where('department.parentId = :parentId', { parentId })
      .getRawOne();
    return maxOrderNumDept.orderNum || 0;
  }

  /**
   * 查询指定部门下的子部门数量
   * @param id
   */
  async countChildrenDept(id: number): Promise<number> {
    return await this.departmentRepository.count({ where: { parentId: id } });
  }
}
