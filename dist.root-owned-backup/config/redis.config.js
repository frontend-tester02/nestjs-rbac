"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisConfig = getRedisConfig;
function getRedisConfig(configService) {
    return {
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        password: configService.get('REDIS_PASSWORD', ''),
        db: configService.get('REDIS_DB', 0),
        ttl: configService.get('REDIS_TTL', 3600),
    };
}
//# sourceMappingURL=redis.config.js.map