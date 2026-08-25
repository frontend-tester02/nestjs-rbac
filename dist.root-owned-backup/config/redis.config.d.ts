import { ConfigService } from '@nestjs/config';
export interface RedisConfig {
    host: string;
    port: number;
    password: string;
    db: number;
    ttl: number;
}
export declare function getRedisConfig(configService: ConfigService): RedisConfig;
