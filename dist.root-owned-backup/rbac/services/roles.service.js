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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("../entities/permission.entity");
const role_permission_entity_1 = require("../entities/role-permission.entity");
const role_entity_1 = require("../entities/role.entity");
const user_role_entity_1 = require("../entities/user-role.entity");
const cache_invalidation_service_1 = require("./cache-invalidation.service");
let RolesService = class RolesService {
    constructor(roleRepository, permissionRepository, rolePermissionRepository, userRoleRepository, cacheInvalidationService) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.userRoleRepository = userRoleRepository;
        this.cacheInvalidationService = cacheInvalidationService;
    }
    async findAll(query) {
        const [items, total] = await this.roleRepository.findAndCount({
            order: { createdAt: 'DESC' },
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        });
        return {
            items,
            meta: {
                total,
                page: query.page,
                limit: query.limit,
            },
        };
    }
    async create(dto) {
        await this.ensureRoleNameIsAvailable(dto.name);
        return this.roleRepository.save(this.roleRepository.create({
            name: dto.name,
            displayName: dto.display_name,
        }));
    }
    async findOne(id) {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: {
                rolePermissions: {
                    permission: true,
                },
            },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        return role;
    }
    async update(id, dto) {
        const role = await this.findRoleById(id);
        if (dto.name && dto.name !== role.name) {
            await this.ensureRoleNameIsAvailable(dto.name);
            role.name = dto.name;
        }
        if (dto.display_name !== undefined) {
            role.displayName = dto.display_name;
        }
        return this.roleRepository.save(role);
    }
    async remove(id) {
        const role = await this.findRoleById(id);
        const usersCount = await this.userRoleRepository.count({
            where: { role: { id } },
        });
        if (usersCount > 0) {
            throw new common_1.ConflictException('Role is assigned to users');
        }
        await this.roleRepository.remove(role);
    }
    async assignPermissions(id, dto) {
        const role = await this.findRoleById(id);
        const permissions = await this.permissionRepository.findBy({
            id: (0, typeorm_2.In)(dto.permission_ids),
        });
        if (permissions.length !== dto.permission_ids.length) {
            throw new common_1.NotFoundException('One or more permissions were not found');
        }
        for (const permission of permissions) {
            const exists = await this.rolePermissionRepository.findOne({
                where: {
                    role: { id: role.id },
                    permission: { id: permission.id },
                },
            });
            if (!exists) {
                await this.rolePermissionRepository.save(this.rolePermissionRepository.create({ role, permission }));
            }
        }
        await this.cacheInvalidationService.invalidateRoleUsersPermissions(id);
        return this.findOne(id);
    }
    async removePermission(id, permissionId) {
        await this.findRoleById(id);
        const rolePermission = await this.rolePermissionRepository.findOne({
            where: {
                role: { id },
                permission: { id: permissionId },
            },
        });
        if (!rolePermission) {
            throw new common_1.NotFoundException('Role permission not found');
        }
        await this.rolePermissionRepository.remove(rolePermission);
        await this.cacheInvalidationService.invalidateRoleUsersPermissions(id);
    }
    async findRoleById(id) {
        const role = await this.roleRepository.findOneBy({ id });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        return role;
    }
    async ensureRoleNameIsAvailable(name) {
        const existingRole = await this.roleRepository.findOneBy({ name });
        if (existingRole) {
            throw new common_1.ConflictException('Role name already exists');
        }
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(2, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermission)),
    __param(3, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cache_invalidation_service_1.CacheInvalidationService])
], RolesService);
//# sourceMappingURL=roles.service.js.map