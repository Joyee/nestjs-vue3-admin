import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationKeyPaths } from '@/config/configuration';

import { ROOT_ROLE_ID } from '../../admin.constants';

/**
 * 提供 rootRoleId
 */
export const rootRoleIdProvider = (): Provider => {
  return {
    provide: ROOT_ROLE_ID,
    useFactory: (configService: ConfigService<ConfigurationKeyPaths>) => configService.get('rootRoleId'),
    inject: [ConfigService],
  };
};
