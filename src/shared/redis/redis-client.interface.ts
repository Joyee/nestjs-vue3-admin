import { ModuleMetadata } from '@nestjs/common/interfaces';
import { ClusterNode, ClusterOptions, Redis, RedisOptions } from 'ioredis';

export interface RedisModuleOptions extends RedisOptions {
  name?: string;
  url?: string;
  cluster?: boolean;
  // cluster node, using cluster is true
  nodes?: ClusterNode[];
  clusterOptions?: ClusterOptions;
  onClientReady?(client: Redis): void;
}

export interface RedisModuleOptionsFactory {
  createRedisModuleOptions(): Promise<RedisModuleOptions> | RedisModuleOptions;
}

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (
    ...args: any[]
  ) =>
    | RedisModuleOptions
    | RedisModuleOptions[]
    | Promise<RedisModuleOptions>
    | Promise<RedisModuleOptions[]>;
}
