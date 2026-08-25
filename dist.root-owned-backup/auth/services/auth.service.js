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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const auth_token_service_1 = require("./auth-token.service");
const password_service_1 = require("./password.service");
let AuthService = class AuthService {
    constructor(userRepository, passwordService, authTokenService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.authTokenService = authTokenService;
    }
    async register(dto) {
        const email = dto.email.toLowerCase();
        const existingUser = await this.userRepository.findOneBy({ email });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const user = await this.userRepository.save(this.userRepository.create({
            email,
            fullName: dto.full_name,
            passwordHash: await this.passwordService.hash(dto.password),
            isActive: true,
        }));
        return this.buildAuthResponse(user);
    }
    async login(dto) {
        const user = await this.userRepository.findOneBy({
            email: dto.email.toLowerCase(),
        });
        if (!user?.passwordHash || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordIsValid = await this.passwordService.verify(dto.password, user.passwordHash);
        if (!passwordIsValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.buildAuthResponse(user);
    }
    async findMe(userId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    buildAuthResponse(user) {
        return {
            access_token: this.authTokenService.sign({
                sub: user.id,
                email: user.email ?? undefined,
            }),
            token_type: 'Bearer',
            user: {
                id: user.id,
                email: user.email,
                full_name: user.fullName,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        password_service_1.PasswordService,
        auth_token_service_1.AuthTokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map