import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './modules/admin/admin.module';
import { LoggerModule } from './common/logger/logger.module';
import { SharedModule } from './shared/shared.module';
import {
  ConfigurationKeyPaths,
  getConfiguration,
} from './config/configuration';
import {
  LoggerModuleOptions,
  WinstonLogLevel,
} from './common/logger/logger.interface';
import { LOGGER_MODULE_OPTIONS } from './common/logger/logger.constants';
import { TypeORMLoggerService } from './common/logger/typeorm-logger.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [getConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      useFactory: (
        configService: ConfigService<ConfigurationKeyPaths>,
        loggerOptions: LoggerModuleOptions,
      ) => ({
        autoLoadEntities: true,
        type: configService.get<any>('database.type'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get('database.logging'),
        timezone: configService.get('database.timezone'), // 时区
        // 自定义日志
        logger: new TypeORMLoggerService(
          configService.get('database.logging'),
          loggerOptions,
        ),
      }),
      inject: [ConfigService, LOGGER_MODULE_OPTIONS],
    }),
    LoggerModule.forRootAsync(
      {
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return {
            level: configService.get('logger.level'),
            consoleLevel: configService.get<WinstonLogLevel>(
              'logger.consoleLevel',
            ),
            timestamp: configService.get<boolean>('logger.timestamp'),
            maxFiles: configService.get<string>('logger.maxFiles'),
            maxFileSize: configService.get<string>('logger.maxFileSize'),
            disableConsoleAtProd: configService.get<boolean>(
              'logger.disableConsoleAtProd',
            ),
            dir: configService.get<string>('logger.dir'),
            errorLogName: configService.get<string>('logger.errorLogName'),
            appLogName: configService.get<string>('logger.appLogName'),
          };
        },
        inject: [ConfigService],
      },
      true,
    ),
    SharedModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
