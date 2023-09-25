import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ResponseDto } from '../class/response.class';
import { BusinessException } from '../exceptions/business.exception';
/**
 * 统一异常返回数据
 */
@Catch()
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.header('Content-Type', 'application/json; charset=utf-8');

    const code =
      exception instanceof BusinessException
        ? exception.getErrorCode()
        : status;
    const message =
      exception instanceof HttpException
        ? exception.message + ''
        : '服务器异常，请稍后再试';

    const result = new ResponseDto(code, null, message);
    response.status(status).send(result);
  }
}
