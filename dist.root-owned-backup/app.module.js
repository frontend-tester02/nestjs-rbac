"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const typeorm_config_1 = require("./config/typeorm.config");
const redis_config_1 = require("./config/redis.config");
const auth_module_1 = require("./auth/auth.module");
const rbac_module_1 = require("./rbac/rbac.module");
const logger = new common_1.Logger('CacheModule');
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: typeorm_config_1.getTypeOrmConfig,
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const redis = (0, redis_config_1.getRedisConfig)(configService);
                    try {
                        return {
                            store: await (0, cache_manager_redis_yet_1.redisStore)({
                                socket: {
                                    host: redis.host,
                                    port: redis.port,
                                },
                                password: redis.password || undefined,
                                database: redis.db,
                                ttl: redis.ttl * 1000,
                            }),
                        };
                    }
                    catch (error) {
                        logger.warn('Redis cache is unavailable. Falling back to in-memory cache.');
                        logger.debug(error);
                        return {};
                    }
                },
            }),
            auth_module_1.AuthModule,
            rbac_module_1.RbacModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map