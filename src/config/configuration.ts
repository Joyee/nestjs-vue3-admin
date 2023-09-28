import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { getConfig } from '../utils/config';

const { LOGGER_CONFIG, JWT_CONFIG, REDIS_CONFIG, MYSQL_CONFIG, ROOT_ROLE_ID } = getConfig();

export const getConfiguration = () => ({
  rootRoleId: ROOT_ROLE_ID || 1,
  logger: {
    timestamp: false,
    dir: LOGGER_CONFIG.dir,
    maxFileSize: LOGGER_CONFIG.maxFileSize,
    maxFiles: LOGGER_CONFIG.maxFiles,
    errorLogName: LOGGER_CONFIG.errorLogName,
    appLogName: LOGGER_CONFIG.appLogName,
  },
  jwt: {
    secret: JWT_CONFIG.secret || '123456',
  },
  redis: {
    host: REDIS_CONFIG.host,
    port: REDIS_CONFIG.port,
    password: REDIS_CONFIG.auth,
    db: REDIS_CONFIG.db,
  },
  database: {
    type: MYSQL_CONFIG.type,
    ...MYSQL_CONFIG,
    entities: [__dirname + '/../**/entities/*.entity.{ts,js}'],
    synchronize: true,
    logging: ['error'],
    timezone: '+08:00', // 东八区
  } as MysqlConnectionOptions
});

export type ConfigurationType = ReturnType<typeof getConfiguration>;

export type ConfigurationKeyPaths = Record<NestedKeyOf<ConfigurationType>, any>;
