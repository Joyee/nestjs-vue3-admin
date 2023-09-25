import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as packageConfig from '../package.json';
import { ADMIN_PREFIX } from './modules/admin/admin.constants';

export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle(packageConfig.name)
    .setDescription(packageConfig.description)
    .setVersion(packageConfig.version)
    // JWT鉴权
    .addSecurity(ADMIN_PREFIX, {
      description: '后台管理系统接口授权',
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    })
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger-api', app, doc);
};
