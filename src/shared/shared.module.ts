import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigurationKeyPaths } from '@/config/configuration';
import { UtilService } from './services/util.service';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service'

/**
 * 全局共享模块
 */
@Global()
@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigurationKeyPaths>) => ({
        secret: configService.get<string>('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.register(),
    RedisModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigurationKeyPaths>) => ({
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        password: configService.get('redis.password'),
        db: configService.get('redis.db'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UtilService, RedisService],
  exports: [HttpModule, JwtModule, CacheModule, UtilService, RedisService],
})
export class SharedModule {}
