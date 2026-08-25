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
var AccessCheckService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessCheckService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_permission_entity_1 = require("../entities/user-permission.entity");
const user_role_entity_1 = require("../entities/user-role.entity");
const USER_PERMISSIONS_TTL_MS = 15 * 60 * 1000;
const SUPER_ADMIN_PERMISSION = '*';
const DENIED_PERMISSION_PREFIX = '!';
let AccessCheckService = AccessCheckService_1 = class AccessCheckService {
    constructor(cacheManager, userRoleRepository, userPermissionRepository) {
        this.cacheManager = cacheManager;
        this.userRoleRepository = userRoleRepository;
        this.userPermissionRepository = userPermissionRepository;
        this.logger = new common_1.Logger(AccessCheckService_1.name);
    }
    async hasAccess(userId, permission) {
        const results = await this.hasBulkAccess(userId, [permission]);
        return results[permission] ?? false;
    }
    async hasBulkAccess(userId, permissions) {
        const uniquePermissions = Array.from(new Set(permissions));
        const effectivePermissions = await this.getEffectivePermissionNames(userId);
        const deniedPermissions = new Set(effectivePermissions
            .filter((permission) => permission.startsWith(DENIED_PERMISSION_PREFIX))
            .map((permission) => permission.slice(DENIED_PERMISSION_PREFIX.length)));
        const grantedPermissions = new Set(effectivePermissions.filter((permission) => !permission.startsWith(DENIED_PERMISSION_PREFIX)));
        const isSuperAdmin = grantedPermissions.has(SUPER_ADMIN_PERMISSION);
        return Object.fromEntries(uniquePermissions.map((permission) => [
            permission,
            !deniedPermissions.has(permission) &&
                (isSuperAdmin || grantedPermissions.has(permission)),
        ]));
    }
    async getEffectivePermissionNames(userId) {
        const cachedPermissions = await this.getCachedPermissions(userId);
        if (cachedPermissions) {
            return cachedPermissions;
        }
        const permissionNames = await this.getEffectivePermissionNamesFromDb(userId);
        await this.cachePermissions(userId, permissionNames);
        return permissionNames;
    }
    async getEffectivePermissionNamesFromDb(userId) {
        const userRoles = await this.userRoleRepository.find({
            where: { user: { id: userId } },
            relations: {
                role: {
                    rolePermissions: {
                        permission: true,
                    },
                },
            },
        });
        const grantedPermissions = new Set();
        const deniedPermissions = new Set();
        const userPermissionOverrides = await this.userPermissionRepository.find({
            where: { user: { id: userId } },
            relations: { permission: true },
        });
        for (const userRole of userRoles) {
            for (const rolePermission of userRole.role.rolePermissions) {
                grantedPermissions.add(rolePermission.permission.name);
            }
        }
        for (const userPermission of userPermissionOverrides) {
            if (userPermission.isDenied) {
                deniedPermissions.add(userPermission.permission.name);
                grantedPermissions.delete(userPermission.permission.name);
            }
            else if (!deniedPermissions.has(userPermission.permission.name)) {
                grantedPermissions.add(userPermission.permission.name);
            }
        }
        if (userRoles.some((userRole) => userRole.role.isSuperAdmin)) {
            grantedPermissions.add(SUPER_ADMIN_PERMISSION);
        }
        return [
            ...Array.from(grantedPermissions),
            ...Array.from(deniedPermissions).map((permission) => `${DENIED_PERMISSION_PREFIX}${permission}`),
        ];
    }
    async getCachedPermissions(userId) {
        try {
            const cachedPermissions = await this.cacheManager.get(this.getUserPermissionsKey(userId));
            if (Array.isArray(cachedPermissions) &&
                cachedPermissions.every((permission) => typeof permission === 'string')) {
                return cachedPermissions;
            }
        }
        catch (error) {
            this.logger.warn(`Failed to read permissions cache for user "${userId}". Falling back to DB.`);
            this.logger.debug(error);
        }
        return null;
    }
    async cachePermissions(userId, permissions) {
        try {
            await this.cacheManager.set(this.getUserPermissionsKey(userId), permissions, USER_PERMISSIONS_TTL_MS);
        }
        catch (error) {
            this.logger.warn(`Failed to write permissions cache for user "${userId}". Continuing without cache.`);
            this.logger.debug(error);
        }
    }
    getUserPermissionsKey(userId) {
        return `user:${userId}:permissions`;
    }
};
exports.AccessCheckService = AccessCheckService;
exports.AccessCheckService = AccessCheckService = AccessCheckService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __param(1, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __param(2, (0, typeorm_1.InjectRepository)(user_permission_entity_1.UserPermission)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository])
], AccessCheckService);
//# sourceMappingURL=access-check.service.js.map