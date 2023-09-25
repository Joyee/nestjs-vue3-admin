import { ModuleMetadata } from '@nestjs/common';

/**
 * 日志记录级别
 * verbose级别通常用于记录详细的调试信息，以便进行故障排查和问题分析。
 */
export type WinstonLogLevel = 'info' | 'error' | 'warn' | 'debug' | 'verbose';

export interface LoggerModuleOptions {
  /**
   * 日志文件输出等级
   * 默认输出log、warn、error的日志到文件中
   */
  level?: WinstonLogLevel | 'none';

  /**
   * 控制台打印的日志等级
   */
  consoleLevel?: WinstonLogLevel | 'none';

  /**
   * 如果启用，将打印当前和上一个日志消息之间的时间戳（时差）
   */
  timestamp?: boolean;

  /**
   * 生产环境下，默认会关闭终端日志输出，如有需要，可以设置为 false
   */
  disableConsoleAtProd?: boolean;

  /**
   * 对应 winston-daily-rotate-file 中 maxFileSize 配置
   * Maximum size of the file after which it will rotate. This can be a number of bytes, or units of kb, mb, and gb. If using the units, add 'k', 'm', or 'g' as the suffix. The units need to directly follow the number. (default: null)
   * 这里默认设置为 '2m'
   */
  maxFileSize?: string;

  /**
   * Maximum number of logs to keep. If not set, no logs will be removed. This can be a number of files or number of days. If using days, add 'd' as the suffix. It uses auditFile to keep track of the log files in a json format. It won't delete any file not contained in it. It can be a number of files or number of days (default: null)
   * 这里默认设置为 '15d'
   */
  maxFiles?: string;

  /**
   * 开发环境下日志在本地产出的目录(绝对路径)
   */
  dir?: string;

  /**
   * 任何 logger 的 .error() 调用输出的日志都会重定向到这里，重点通过查看此日志定位异常，默认文件名为 common-error.%DATE%.log
   * 注意：此文件名可以包含%DATE%占位符
   */
  errorLogName?: string;

  /**
   * 应用相关日志，供应用开发者使用的日志。我们在绝大数情况下都在使用它，默认文件名为 web.%DATE%.log
   * 注意：此文件名可以包含%DATE%占位符
   */
  appLogName?: string;
}

export interface LoggerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => LoggerModuleOptions;
  inject?: any[];
}
