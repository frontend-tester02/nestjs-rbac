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
exports.AuthTokenService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
let AuthTokenService = class AuthTokenService {
    constructor(configService) {
        this.configService = configService;
        this.expiresInSeconds = 60 * 60 * 24;
    }
    sign(payload) {
        const now = Math.floor(Date.now() / 1000);
        const tokenPayload = {
            ...payload,
            iat: now,
            exp: now + this.expiresInSeconds,
        };
        const encodedHeader = this.base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));
        const unsignedToken = `${encodedHeader}.${encodedPayload}`;
        const signature = this.signValue(unsignedToken);
        return `${unsignedToken}.${signature}`;
    }
    verify(token) {
        const [encodedHeader, encodedPayload, signature] = token.split('.');
        if (!encodedHeader || !encodedPayload || !signature) {
            throw new common_1.UnauthorizedException('Invalid bearer token');
        }
        const unsignedToken = `${encodedHeader}.${encodedPayload}`;
        const expectedSignature = this.signValue(unsignedToken);
        const signatureBuffer = Buffer.from(signature);
        const expectedSignatureBuffer = Buffer.from(expectedSignature);
        if (signatureBuffer.length !== expectedSignatureBuffer.length ||
            !(0, crypto_1.timingSafeEqual)(signatureBuffer, expectedSignatureBuffer)) {
            throw new common_1.UnauthorizedException('Invalid bearer token');
        }
        const payload = JSON.parse(this.base64UrlDecode(encodedPayload));
        if (!payload.sub || payload.exp < Math.floor(Date.now() / 1000)) {
            throw new common_1.UnauthorizedException('Invalid bearer token');
        }
        return payload;
    }
    signValue(value) {
        return (0, crypto_1.createHmac)('sha256', this.getSecret()).update(value).digest('base64url');
    }
    getSecret() {
        return this.configService.get('JWT_SECRET', 'dev-secret-change-me');
    }
    base64UrlEncode(value) {
        return Buffer.from(value).toString('base64url');
    }
    base64UrlDecode(value) {
        return Buffer.from(value, 'base64url').toString('utf8');
    }
};
exports.AuthTokenService = AuthTokenService;
exports.AuthTokenService = AuthTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthTokenService);
//# sourceMappingURL=auth-token.service.js.map