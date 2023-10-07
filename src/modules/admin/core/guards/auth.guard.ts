import { Reflector } from '@nestjs/core';
import { isEmpty } from 'lodash';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { BusinessException } from './../../../../common/exceptions/business.exception';
import { ADMIN_USER, IS_PUBLIC_KEY } from './../../admin.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

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
      const payload = await this.jwtService.verify(token);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request[ADMIN_USER] = payload;
    } catch {
      throw new BusinessException(11001);
    }

    return false;
  }
}
