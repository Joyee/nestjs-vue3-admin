import {
  DynamicModule,
  Inject,
  Module,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import IORedis, { Redis, Cluster } from 'ioredis';
import { isEmpty } from 'lodash';
import {
  RedisModuleOptions,
  RedisModuleAsyncOptions,
} from './redis-client.interface';
import {
  REDIS_CLIENT,
  REDIS_MODULE_OPTIONS,
  REDIS_DEFAULT_CLIENT_KEY,
} from './redis.constants';

@Module({})
export class RedisModule implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  public static regsiter(options: RedisModuleOptions): DynamicModule {
    const clientProvider = this.createAsyncProvider();
    return {
      module: RedisModule,
      imports: [],
      providers: [
        clientProvider,
        {
          provide: REDIS_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [clientProvider],
    };
  }

  public static registerAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const clientProvider = this.createAsyncProvider();
    return {
      module: RedisModule,
      imports: options.imports ?? [],
      providers: [clientProvider, this.createAsyncClientOptions(options)],
      exports: [clientProvider],
    };
  }

  private static createAsyncProvider(): Provider {
    return {
      provide: REDIS_CLIENT,
      useFactory: (
        options: RedisModuleOptions | RedisModuleOptions[],
      ): Map<string, Redis | Cluster> => {
        const clients = new Map<string, Redis | Cluster>();
        if (Array.isArray(options)) {
          options.forEach((op) => {
            const name = op.name ?? REDIS_DEFAULT_CLIENT_KEY;
            if (clients.has(name)) {
              throw new Error('Redis Init Error: name must unique');
            }
            clients.set(name, this.createClient(op));
          });
        } else {
          clients.set(REDIS_DEFAULT_CLIENT_KEY, this.createClient(options));
        }
        return clients;
      },
      inject: [REDIS_MODULE_OPTIONS],
    };
  }

  private static createClient(options: RedisModuleOptions): Redis | Cluster {
    const { url, cluster, nodes, clusterOptions, onClientReady, ...opts } = options;
    let client = null;
    if (!isEmpty(url)) {
      client = new IORedis(url);
    } else if (cluster) {
      client = new IORedis.Cluster(nodes, clusterOptions);
    } else {
      client = new IORedis(opts);
    }
    if (onClientReady) {
      onClientReady(client)
    }
    return client;
  }

  private static createAsyncClientOptions(
    options: RedisModuleAsyncOptions,
  ): Provider {
    return {
      provide: REDIS_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }
}
