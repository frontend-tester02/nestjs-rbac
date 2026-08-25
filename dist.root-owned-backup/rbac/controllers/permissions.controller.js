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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../dto");
const require_permissions_decorator_1 = require("../decorators/require-permissions.decorator");
const bearer_token_guard_1 = require("../guards/bearer-token.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const permissions_service_1 = require("../services/permissions.service");
let PermissionsController = class PermissionsController {
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    findAll(query) {
        return this.permissionsService.findAll(query);
    }
    create(dto) {
        return this.permissionsService.create(dto);
    }
    updateWithPut(id, dto) {
        return this.permissionsService.update(id, dto);
    }
    updateWithPatch(id, dto) {
        return this.permissionsService.update(id, dto);
    }
    remove(id) {
        return this.permissionsService.remove(id);
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get permissions, optionally filtered by module' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permissions list.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PermissionFilterQueryDto]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermission)('permissions.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a permission' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Permission created.' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'permissions.manage permission is required.',
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Permission name already exists.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePermissionDto]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermission)('permissions.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a permission' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Permission UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permission updated.' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'permissions.manage permission is required.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Permission not found.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Permission name already exists.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdatePermissionDto]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "updateWithPut", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permissions_decorator_1.RequirePermission)('permissions.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Patch a permission' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Permission UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permission updated.' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'permissions.manage permission is required.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Permission not found.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Permission name already exists.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdatePermissionDto]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "updateWithPatch", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermission)('permissions.manage'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a permission' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Permission UUID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Permission deleted.' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'permissions.manage permission is required.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Permission not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "remove", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, swagger_1.ApiTags)('RBAC Permissions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(bearer_token_guard_1.BearerTokenGuard, permissions_guard_1.PermissionGuard),
    (0, common_1.Controller)('api/v1/rbac/permissions'),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map