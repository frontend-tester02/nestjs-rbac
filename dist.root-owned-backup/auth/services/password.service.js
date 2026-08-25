"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const util_1 = require("util");
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
const KEY_LENGTH = 64;
let PasswordService = class PasswordService {
    async hash(password) {
        const salt = (0, crypto_1.randomBytes)(16).toString('hex');
        const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH));
        return `${salt}:${derivedKey.toString('hex')}`;
    }
    async verify(password, passwordHash) {
        const [salt, storedKey] = passwordHash.split(':');
        if (!salt || !storedKey) {
            return false;
        }
        const storedKeyBuffer = Buffer.from(storedKey, 'hex');
        const derivedKey = (await scryptAsync(password, salt, storedKeyBuffer.length));
        return (storedKeyBuffer.length === derivedKey.length &&
            (0, crypto_1.timingSafeEqual)(storedKeyBuffer, derivedKey));
    }
};
exports.PasswordService = PasswordService;
exports.PasswordService = PasswordService = __decorate([
    (0, common_1.Injectable)()
], PasswordService);
//# sourceMappingURL=password.service.js.map