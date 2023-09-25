import { getConfig } from '../utils/config';

const { LOGGER_CONFIG, JWT_CONFIG, REDIS_CONFIG } = getConfig();

export const getConfiguration = () => ({
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
});

export type ConfigurationType = ReturnType<typeof getConfiguration>;

export type ConfigurationKeyPaths = Record<NestedKeyOf<ConfigurationType>, any>;
