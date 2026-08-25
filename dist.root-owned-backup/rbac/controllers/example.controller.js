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
exports.ExampleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const require_permissions_decorator_1 = require("../decorators/require-permissions.decorator");
const bearer_token_guard_1 = require("../guards/bearer-token.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
let ExampleController = class ExampleController {
    protectedEndpoint() {
        return {
            message: 'Protected endpoint works.',
            required_permission: 'loans.approve',
        };
    }
};
exports.ExampleController = ExampleController;
__decorate([
    (0, common_1.Get)('protected'),
    (0, common_1.UseGuards)(bearer_token_guard_1.BearerTokenGuard, permissions_guard_1.PermissionGuard),
    (0, require_permissions_decorator_1.RequirePermission)('loans.approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Example protected endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Access granted.' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Required permission is missing.",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExampleController.prototype, "protectedEndpoint", null);
exports.ExampleController = ExampleController = __decorate([
    (0, swagger_1.ApiTags)('RBAC Example'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/rbac/example')
], ExampleController);
//# sourceMappingURL=example.controller.js.map