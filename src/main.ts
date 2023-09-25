import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  HttpStatus,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { setupSwagger } from './doc';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { BusinessExceptionFilter } from './common/filters/business-exception.filter';
import { LoggerService } from './common/logger/logger.service';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  app.useLogger(app.get(LoggerService));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 是否将验证后的数据转换为DTO对象。如果设置为true，则验证后的数据将被自动转换为DTO对象，否则将保持原始的请求数据格式
      whitelist: true, // 是否允许只验证DTO中定义的属性。如果设置为true，则只验证DTO中定义的属性，其他属性将被忽略。如果设置为false，则验证整个请求数据，包括DTO中未定义的属性
      forbidNonWhitelisted: true, // 是否禁止验证未定义的属性。如果设置为true，则验证时会检查请求数据中是否存在未定义的属性，如果存在则返回验证失败。如果设置为false，则允许请求数据中存在未定义的属性。
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // 验证失败时返回的HTTP状态码。如果设置为HttpStatus.UNPROCESSABLE_ENTITY，则返回422状态码。如果设置为其他状态码，则返回相应的状态码。
      exceptionFactory: (errors: ValidationError[]) => {
        // 自定义验证失败时返回的异常信息
        // 过滤掉没有约束条件的错误信息
        return new UnprocessableEntityException(
          errors
            .filter((e) => !!e.constraints)
            .flatMap((e) => Object.values(e.constraints))
            .join('; '),
        );
      },
    }),
  );
  app.useGlobalFilters(new BusinessExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  setupSwagger(app);

  await app.listen(8000);
}
bootstrap();
