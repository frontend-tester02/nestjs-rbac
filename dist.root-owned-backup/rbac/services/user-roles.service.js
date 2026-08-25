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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const permission_entity_1 = require("../entities/permission.entity");
const role_entity_1 = require("../entities/role.entity");
const user_permission_entity_1 = require("../entities/user-permission.entity");
const user_role_entity_1 = require("../entities/user-role.entity");
const audit_log_service_1 = require("./audit-log.service");
const cache_invalidation_service_1 = require("./cache-invalidation.service");
let UserRolesService = class UserRolesService {
    constructor(userRepository, roleRepository, permissionRepository, userPermissionRepository, userRoleRepository, cacheInvalidationService, auditLogService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.userPermissionRepository = userPermissionRepository;
        this.userRoleRepository = userRoleRepository;
        this.cacheInvalidationService = cacheInvalidationService;
        this.auditLogService = auditLogService;
    }
    async findUserRoles(userId) {
        await this.ensureUserExists(userId);
        const userRoles = await this.userRoleRepository.find({
            where: { user: { id: userId } },
            relations: { role: true },
            order: { assignedAt: 'DESC' },
        });
        return userRoles.map((userRole) => userRole.role);
    }
    async assignRoles(userId, dto, assignedByUserId) {
        const user = await this.findUserById(userId);
        const assignedByUser = await this.findUserById(assignedByUserId);
        const roles = await this.roleRepository.findBy({ id: (0, typeorm_2.In)(dto.role_ids) });
        if (roles.length !== dto.role_ids.length) {
            throw new common_1.NotFoundException('One or more roles were not found');
        }
        const existingUserRoles = await this.userRoleRepository.find({
            where: {
                user: { id: userId },
                role: { id: (0, typeorm_2.In)(dto.role_ids) },
            },
            relations: { role: true },
        });
        const existingRoleIds = new Set(existingUserRoles.map((userRole) => userRole.role.id));
        const newUserRoles = roles
            .filter((role) => !existingRoleIds.has(role.id))
            .map((role) => this.userRoleRepository.create({
            user,
            role,
            assignedByUser,
        }));
        if (newUserRoles.length > 0) {
            await this.userRoleRepository.save(newUserRoles);
            await Promise.all(newUserRoles.map((userRole) => this.auditLogService.logUserRoleChange({
                actorId: assignedByUserId,
                action: 'user_role.assigned',
                targetUserId: userId,
                roleId: userRole.role.id,
            })));
            await this.cacheInvalidationService.invalidateUserPermissions(userId);
        }
        return this.findUserRoles(userId);
    }
    async removeRole(userId, roleId, actorId) {
        await this.ensureUserExists(userId);
        const userRole = await this.userRoleRepository.findOne({
            where: {
                user: { id: userId },
                role: { id: roleId },
            },
        });
        if (!userRole) {
            throw new common_1.NotFoundException('User role not found');
        }
        await this.userRoleRepository.remove(userRole);
        await this.auditLogService.logUserRoleChange({
            actorId,
            action: 'user_role.removed',
            targetUserId: userId,
            roleId,
        });
        await this.cacheInvalidationService.invalidateUserPermissions(userId);
    }
    async upsertPermissionOverride(userId, dto) {
        const user = await this.findUserById(userId);
        const permission = await this.permissionRepository.findOneBy({
            id: dto.permission_id,
        });
        if (!permission) {
            throw new common_1.NotFoundException('Permission not found');
        }
        const existingOverride = await this.userPermissionRepository.findOne({
            where: {
                user: { id: userId },
                permission: { id: dto.permission_id },
            },
            relations: {
                permission: true,
                user: true,
            },
        });
        const userPermission = existingOverride ??
            this.userPermissionRepository.create({
                user,
                permission,
            });
        userPermission.isDenied = dto.is_denied;
        const savedOverride = await this.userPermissionRepository.save(userPermission);
        await this.cacheInvalidationService.invalidateUserPermissions(userId);
        return savedOverride;
    }
    async findEffectivePermissions(userId) {
        await this.ensureUserExists(userId);
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
        const userPermissionOverrides = await this.userPermissionRepository.find({
            where: { user: { id: userId } },
            relations: { permission: true },
        });
        const permissionsById = new Map();
        if (userRoles.some((userRole) => userRole.role.isSuperAdmin)) {
            return this.permissionRepository.find({
                order: { module: 'ASC', name: 'ASC' },
            });
        }
        for (const userRole of userRoles) {
            for (const rolePermission of userRole.role.rolePermissions) {
                permissionsById.set(rolePermission.permission.id, rolePermission.permission);
            }
        }
        for (const userPermission of userPermissionOverrides) {
            if (userPermission.isDenied) {
                permissionsById.delete(userPermission.permission.id);
            }
            else {
                permissionsById.set(userPermission.permission.id, userPermission.permission);
            }
        }
        return Array.from(permissionsById.values()).sort((left, right) => left.name.localeCompare(right.name));
    }
    async findUserById(id) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async ensureUserExists(id) {
        await this.findUserById(id);
    }
};
exports.UserRolesService = UserRolesService;
exports.UserRolesService = UserRolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(3, (0, typeorm_1.InjectRepository)(user_permission_entity_1.UserPermission)),
    __param(4, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cache_invalidation_service_1.CacheInvalidationService,
        audit_log_service_1.AuditLogService])
], UserRolesService);
//# sourceMappingURL=user-roles.service.js.map