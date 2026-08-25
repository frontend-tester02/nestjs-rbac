"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const user_entity_1 = require("../users/entities/user.entity");
const access_check_controller_1 = require("./controllers/access-check.controller");
const example_controller_1 = require("./controllers/example.controller");
const permissions_controller_1 = require("./controllers/permissions.controller");
const roles_controller_1 = require("./controllers/roles.controller");
const user_roles_controller_1 = require("./controllers/user-roles.controller");
const audit_log_entity_1 = require("./entities/audit-log.entity");
const permission_entity_1 = require("./entities/permission.entity");
const role_permission_entity_1 = require("./entities/role-permission.entity");
const role_entity_1 = require("./entities/role.entity");
const user_permission_entity_1 = require("./entities/user-permission.entity");
const user_role_entity_1 = require("./entities/user-role.entity");
const bearer_token_guard_1 = require("./guards/bearer-token.guard");
const permissions_guard_1 = require("./guards/permissions.guard");
const audit_log_service_1 = require("./services/audit-log.service");
const cache_invalidation_service_1 = require("./services/cache-invalidation.service");
const roles_service_1 = require("./services/roles.service");
const permissions_service_1 = require("./services/permissions.service");
const user_roles_service_1 = require("./services/user-roles.service");
const access_check_service_1 = require("./services/access-check.service");
let RbacModule = class RbacModule {
};
exports.RbacModule = RbacModule;
exports.RbacModule = RbacModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            typeorm_1.TypeOrmModule.forFeature([
                permission_entity_1.Permission,
                role_entity_1.Role,
                role_permission_entity_1.RolePermission,
                audit_log_entity_1.AuditLog,
                user_entity_1.User,
                user_permission_entity_1.UserPermission,
                user_role_entity_1.UserRole,
            ]),
        ],
        controllers: [
            roles_controller_1.RolesController,
            permissions_controller_1.PermissionsController,
            user_roles_controller_1.UserRolesController,
            access_check_controller_1.AccessCheckController,
            example_controller_1.ExampleController,
        ],
        providers: [
            roles_service_1.RolesService,
            permissions_service_1.PermissionsService,
            user_roles_service_1.UserRolesService,
            access_check_service_1.AccessCheckService,
            audit_log_service_1.AuditLogService,
            cache_invalidation_service_1.CacheInvalidationService,
            bearer_token_guard_1.BearerTokenGuard,
            permissions_guard_1.PermissionGuard,
        ],
        exports: [
            roles_service_1.RolesService,
            permissions_service_1.PermissionsService,
            user_roles_service_1.UserRolesService,
            access_check_service_1.AccessCheckService,
            audit_log_service_1.AuditLogService,
            cache_invalidation_service_1.CacheInvalidationService,
        ],
    })
], RbacModule);
//# sourceMappingURL=rbac.module.js.map