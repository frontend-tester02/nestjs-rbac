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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const require_permissions_decorator_1 = require("../decorators/require-permissions.decorator");
const access_check_service_1 = require("../services/access-check.service");
let PermissionGuard = class PermissionGuard {
    constructor(reflector, accessCheckService) {
        this.reflector = reflector;
        this.accessCheckService = accessCheckService;
    }
    async canActivate(context) {
        const requiredPermission = this.reflector.getAllAndOverride(require_permissions_decorator_1.REQUIRED_PERMISSION_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermission) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id;
        if (!userId) {
            throw new common_1.UnauthorizedException('Current user id is required');
        }
        const hasAccess = await this.accessCheckService.hasAccess(userId, requiredPermission);
        if (!hasAccess) {
            throw new common_1.ForbiddenException({
                error: 'forbidden',
                message: "Ushbu amal uchun ruxsat yo'q",
                required_permission: requiredPermission,
            });
        }
        return true;
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        access_check_service_1.AccessCheckService])
], PermissionGuard);
//# sourceMappingURL=permissions.guard.js.map