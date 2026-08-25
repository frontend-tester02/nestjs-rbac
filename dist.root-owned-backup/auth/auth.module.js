"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bearer_token_guard_1 = require("../rbac/guards/bearer-token.guard");
const user_entity_1 = require("../users/entities/user.entity");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./services/auth.service");
const auth_token_service_1 = require("./services/auth-token.service");
const password_service_1 = require("./services/password.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, auth_token_service_1.AuthTokenService, password_service_1.PasswordService, bearer_token_guard_1.BearerTokenGuard],
        exports: [auth_token_service_1.AuthTokenService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map