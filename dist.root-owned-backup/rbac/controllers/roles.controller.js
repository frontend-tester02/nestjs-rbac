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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../dto");
const require_permissions_decorator_1 = require("../decorators/require-permissions.decorator");
const bearer_token_guard_1 = require("../guards/bearer-token.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const roles_service_1 = require("../services/roles.service");
let RolesController = class RolesController {
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    findAll(query) {
        return this.rolesService.findAll(query);
    }
    create(dto) {
        return this.rolesService.create(dto);
    }
    findOne(id) {
        return this.rolesService.findOne(id);
    }
    updateWithPut(id, dto) {
        return this.rolesService.update(id, dto);
    }
    updateWithPatch(id, dto) {
        return this.rolesService.update(id, dto);
    }
    remove(id) {
        return this.rolesService.remove(id);
    }
    assignPermissions(id, dto) {
        return this.rolesService.assignPermissions(id, dto);
    }
    removePermission(id, permissionId) {
        return this.rolesService.removePermission(id, permissionId);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get roles with pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Roles list with total count.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermission)('roles.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a role' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Role created.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'roles.manage permission is required.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Role name already exists.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateRoleDto]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get role by id with permissions' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role with assigned permissions.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermission)('roles.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a role' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role updated.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'roles.manage permission is required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Role name already exists.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateRoleDto]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "updateWithPut", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permissions_decorator_1.RequirePermission)('roles.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Patch a role' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role updated.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'roles.manage permission is required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Role name already exists.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateRoleDto]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "updateWithPatch", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermission)('roles.manage'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a role' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role UUID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Role deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'roles.manage permission is required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Role is assigned to users.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/permissions'),
    (0, require_permissions_decorator_1.RequirePermission)('roles.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign permissions to a role' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role UUID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Permissions assigned.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'roles.manage permission is required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role or permission not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AssignRolePermissionsDto]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "assignPermissions", null);
__decorate([
    (0, common_1.Delete)(':id/permissions/:permission_id'),
    (0, require_permissions_decorator_1.RequirePermission)('roles.manage'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove one permission from a role' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role UUID' }),
    (0, swagger_1.ApiParam)({ name: 'permission_id', description: 'Permission UUID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Permission removed from role.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'roles.manage permission is required.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role permission not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('permission_id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "removePermission", null);
exports.RolesController = RolesController = __decorate([
    (0, swagger_1.ApiTags)('RBAC Roles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(bearer_token_guard_1.BearerTokenGuard, permissions_guard_1.PermissionGuard),
    (0, common_1.Controller)('api/v1/rbac/roles'),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map