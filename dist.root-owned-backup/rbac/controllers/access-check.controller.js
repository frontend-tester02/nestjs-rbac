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
exports.AccessCheckController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_id_decorator_1 = require("../decorators/current-user-id.decorator");
const dto_1 = require("../dto");
const bearer_token_guard_1 = require("../guards/bearer-token.guard");
const access_check_service_1 = require("../services/access-check.service");
let AccessCheckController = class AccessCheckController {
    constructor(accessCheckService) {
        this.accessCheckService = accessCheckService;
    }
    async checkAccess(query, currentUserId) {
        const targetUserId = this.resolveTargetUserId(query.user_id, currentUserId);
        await this.ensureCanCheckTargetUser(targetUserId, currentUserId);
        return {
            user_id: targetUserId,
            permission: query.permission,
            has_access: await this.accessCheckService.hasAccess(targetUserId, query.permission),
        };
    }
    async checkBulkAccess(dto, currentUserId) {
        const targetUserId = this.resolveTargetUserId(dto.user_id, currentUserId);
        await this.ensureCanCheckTargetUser(targetUserId, currentUserId);
        return {
            user_id: targetUserId,
            results: await this.accessCheckService.hasBulkAccess(targetUserId, dto.permissions),
        };
    }
    resolveTargetUserId(requestedUserId, currentUserId) {
        const targetUserId = requestedUserId ?? currentUserId;
        if (!targetUserId) {
            throw new common_1.UnauthorizedException('Current user id is required');
        }
        return targetUserId;
    }
    async ensureCanCheckTargetUser(targetUserId, currentUserId) {
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
exports.AccessCheckController = AccessCheckController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check one permission for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Single access check result.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Current user id missing in JWT.' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'users.view_access is required for another user.',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_id_decorator_1.CurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CheckAccessQueryDto, String]),
    __metadata("design:returntype", Promise)
], AccessCheckController.prototype, "checkAccess", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Check multiple permissions for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bulk access check result.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Current user id missing in JWT.' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'users.view_access is required for another user.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_id_decorator_1.CurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BulkCheckAccessDto, String]),
    __metadata("design:returntype", Promise)
], AccessCheckController.prototype, "checkBulkAccess", null);
exports.AccessCheckController = AccessCheckController = __decorate([
    (0, swagger_1.ApiTags)('RBAC Access Check'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(bearer_token_guard_1.BearerTokenGuard),
    (0, common_1.Controller)('api/v1/rbac/check-access'),
    __metadata("design:paramtypes", [access_check_service_1.AccessCheckService])
], AccessCheckController);
//# sourceMappingURL=access-check.controller.js.map