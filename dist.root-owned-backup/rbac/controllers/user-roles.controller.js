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
exports.UserRolesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_id_decorator_1 = require("../decorators/current-user-id.decorator");
const require_permissions_decorator_1 = require("../decorators/require-permissions.decorator");
const dto_1 = require("../dto");
const bearer_token_guard_1 = require("../guards/bearer-token.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const access_check_service_1 = require("../services/access-check.service");
const user_roles_service_1 = require("../services/user-roles.service");
let UserRolesController = class UserRolesController {
    constructor(userRolesService, accessCheckService) {
        this.userRolesService = userRolesService;
        this.accessCheckService = accessCheckService;
    }
    findUserRoles(userId) {
        return this.userRolesService.findUserRoles(userId);
    }
    assignRoles(userId, dto, currentUserId) {
        if (!currentUserId) {
            throw new common_1.UnauthorizedException('Current user id is required');
        }
        return this.userRolesService.assignRoles(userId, dto, currentUserId);
    }
    removeRole(userId, roleId, currentUserId) {
        if (!currentUserId) {
            throw new common_1.UnauthorizedException('Current user id is required');
        }
        return this.userRolesService.removeRole(userId, roleId, currentUserId);
    }
    upsertPermissionOverride(userId, dto) {
        return this.userRolesService.upsertPermissionOverride(userId, dto);
    }
    async findEffectivePermissions(userId, currentUserId) {
        await this.ensureCanViewAccess(userId, currentUserId);
        return this.userRolesService.findEffectivePermissions(userId);
    }
    async ensureCanViewAccess(targetUserId, currentUserId) {
        if (targetUserId === currentUserId) {
            return;
        }
        if (!currentUserId) {
            throw new common_1.UnauthorizedException('Current user id is required');
        }
        const canViewAccess = await this.accessCheckService.hasAccess(currentUserId, 'users.view_access');
        if (!canViewAccess) {
            throw new common_1.ForbiddenException('users.view_access permission is required');
        }
    }
};
exports.UserRolesController = UserRolesController;
__decorate([
    (0, common_1.Get)('roles'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all roles assigned to a user' }),
    (0, swagger_1.ApiParam)({ name: 'user_id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User roles list.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserRolesController.prototype, "findUserRoles", null);
__decorate([
    (0, common_1.Post)('roles'),
    (0, require_permissions_decorator_1.RequirePermission)('roles.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign roles to a user' }),
    (0, swagger_1.ApiParam)({ name: 'user_id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Roles assigned to user.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Current user id missing in JWT.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User or role not found.' }),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_id_decorator_1.CurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AssignUserRolesDto, String]),
    __metadata("design:returntype", void 0)
], UserRolesController.prototype, "assignRoles", null);
__decorate([
    (0, common_1.Delete)('roles/:role_id'),
    (0, require_permissions_decorator_1.RequirePermission)('roles.manage'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove one role from a user' }),
    (0, swagger_1.ApiParam)({ name: 'user_id', description: 'User UUID' }),
    (0, swagger_1.ApiParam)({ name: 'role_id', description: 'Role UUID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Role removed from user.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User role not found.' }),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('role_id', common_1.ParseUUIDPipe)),
    __param(2, (0, current_user_id_decorator_1.CurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], UserRolesController.prototype, "removeRole", null);
__decorate([
    (0, common_1.Post)('permissions/override'),
    (0, require_permissions_decorator_1.RequirePermission)('permissions.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update a user permission override' }),
    (0, swagger_1.ApiParam)({ name: 'user_id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Permission override saved.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User or permission not found.' }),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpsertUserPermissionOverrideDto]),
    __metadata("design:returntype", void 0)
], UserRolesController.prototype, "upsertPermissionOverride", null);
__decorate([
    (0, common_1.Get)('permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all effective permissions for a user' }),
    (0, swagger_1.ApiParam)({ name: 'user_id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Distinct effective permissions collected from user roles.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    __param(0, (0, common_1.Param)('user_id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_id_decorator_1.CurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserRolesController.prototype, "findEffectivePermissions", null);
exports.UserRolesController = UserRolesController = __decorate([
    (0, swagger_1.ApiTags)('RBAC User Roles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(bearer_token_guard_1.BearerTokenGuard, permissions_guard_1.PermissionGuard),
    (0, common_1.Controller)('api/v1/rbac/users/:user_id'),
    __metadata("design:paramtypes", [user_roles_service_1.UserRolesService,
        access_check_service_1.AccessCheckService])
], UserRolesController);
//# sourceMappingURL=user-roles.controller.js.map