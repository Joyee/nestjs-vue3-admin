import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';
import { BusinessException } from '@/common/exceptions/business.exception';
import {
  ADMIN_PREFIX,
  ADMIN_USER,
  IS_PUBLIC_KEY,
  PERMISSION_OPTIONAL_KEY_METADATA,
} from './../../admin.constants';
import { LoginService } from '../../login/login.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private loginService: LoginService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    // 放行
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = request.headers['authorization'] as string;
    if (isEmpty(token)) {
      throw new BusinessException(11001);
    }
    // In the node.js world, it's common practice to attach the authorized user to the request object.
    try {
      const payload = this.jwtService.verify(token);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request[ADMIN_USER] = payload;
    } catch {
      throw new BusinessException(11001);
    }
    if (isEmpty(request[ADMIN_USER])) {
      throw new BusinessException(11001);
    }

    // 注册该注解，Api则放行检测
    const notNeedPerm = this.reflector.get<boolean>(
      PERMISSION_OPTIONAL_KEY_METADATA,
      context.getHandler(),
    );
    // Token校验身份通过，判断是否需要权限的url，不需要权限则pass
    if (notNeedPerm) {
      return true;
    }

    const perms: string = await this.loginService.getRedisPermsById(
      request[ADMIN_USER].uid,
    );

    if (isEmpty(perms)) {
      throw new BusinessException(11001);
    }
    // "sys:user:add" => sys/user/add
    const permArray: string[] = (JSON.parse(perms) as string[]).map((e) =>
      e.replace(/:/g, '/'),
    );
    const path = request.url.split('?')[0]; // /admin/sys/role/page
    // 遍历权限是否包含该url，不包含则无访问权限
    if (!permArray.includes(path.replace(`/${ADMIN_PREFIX}/`, ''))) {
      throw new BusinessException(11003);
    }
    return true;
  }
}
