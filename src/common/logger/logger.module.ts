import { DynamicModule, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import {
  LoggerModuleAsyncOptions,
  LoggerModuleOptions,
} from './logger.interface';
import { LOGGER_MODULE_OPTIONS } from './logger.constants';

@Module({})
export class LoggerModule {
  static forRoot(
    options: LoggerModuleOptions,
    isGlobal = false,
  ): DynamicModule {
    return {
      module: LoggerModule,
      global: isGlobal,
      exports: [LoggerService, LOGGER_MODULE_OPTIONS],
      providers: [
        LoggerService,
        {
          provide: LOGGER_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  static forRootAsync(
    options: LoggerModuleAsyncOptions,
    isGlobal = false,
  ): DynamicModule {
    return {
      module: LoggerModule,
      global: isGlobal,
      imports: options.imports,
      exports: [LoggerService, LOGGER_MODULE_OPTIONS],
      providers: [
        LoggerService,
        {
          provide: LOGGER_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
    };
  }
}
