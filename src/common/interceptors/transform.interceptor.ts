import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { FastifyReply } from 'fastify';

import { TRANSFORM_KEEP_KEY_METADATA } from '../constants/decorator.constants';
import { ResponseDto } from '../class/response.class';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflator: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const keep = this.reflator.get<boolean>(
          TRANSFORM_KEEP_KEY_METADATA,
          context.getHandler(),
        );
        if (keep) {
          return data;
        }
        // 统一格式
        const response = context.switchToHttp().getResponse<FastifyReply>();
        response.header('Content-Type', 'application/json; charset=utf-8');
        return new ResponseDto(200, data);
      }),
    );
  }
}
