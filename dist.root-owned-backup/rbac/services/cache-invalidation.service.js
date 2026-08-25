"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CacheInvalidationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInvalidationService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_role_entity_1 = require("../entities/user-role.entity");
let CacheInvalidationService = CacheInvalidationService_1 = class CacheInvalidationService {
    constructor(cacheManager, userRoleRepository) {
        this.cacheManager = cacheManager;
        this.userRoleRepository = userRoleRepository;
        this.logger = new common_1.Logger(CacheInvalidationService_1.name);
    }
    async invalidateUserPermissions(userId) {
        await this.deleteCacheKey(this.getUserPermissionsKey(userId));
    }
    async invalidateRoleUsersPermissions(roleId) {
        const userRoles = await this.userRoleRepository.find({
            where: { role: { id: roleId } },
            relations: { user: true },
        });
        await Promise.all(userRoles.map((userRole) => this.invalidateUserPermissions(userRole.user.id)));
    }
    getUserPermissionsKey(userId) {
        return `user:${userId}:permissions`;
    }
    async deleteCacheKey(key) {
        try {
            await this.cacheManager.del(key);
        }
        catch (error) {
            this.logger.warn(`Failed to delete cache key "${key}". Continuing without cache invalidation.`);
            this.logger.debug(error);
        }
    }
};
exports.CacheInvalidationService = CacheInvalidationService;
exports.CacheInvalidationService = CacheInvalidationService = CacheInvalidationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __param(1, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository])
], CacheInvalidationService);
//# sourceMappingURL=cache-invalidation.service.js.map