import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { getTypeOrmConfig } from './config/typeorm.config';
import { getRedisConfig } from './config/redis.config';
import { AuthModule } from './auth/auth.module';
import { RbacModule } from './rbac/rbac.module';

const logger = new Logger('CacheModule');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redis = getRedisConfig(configService);

        try {
          return {
            store: await redisStore({
              socket: {
                host: redis.host,
                port: redis.port,
              },
              password: redis.password || undefined,
              database: redis.db,
              ttl: redis.ttl * 1000,
            }),
          };
        } catch (error) {
          logger.warn(
            'Redis cache is unavailable. Falling back to in-memory cache.',
          );
          logger.debug(error);

          return {};
        }
      },
    }),
    AuthModule,
    RbacModule,
  ],
})
export class AppModule {}
