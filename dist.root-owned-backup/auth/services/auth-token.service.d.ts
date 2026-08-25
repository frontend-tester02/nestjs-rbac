import { ConfigService } from '@nestjs/config';
export type JwtPayload = {
    sub: string;
    email?: string;
    iat: number;
    exp: number;
};
export declare class AuthTokenService {
    private readonly configService;
    private readonly expiresInSeconds;
    constructor(configService: ConfigService);
    sign(payload: {
        sub: string;
        email?: string;
    }): string;
    verify(token: string): JwtPayload;
    private signValue;
    private getSecret;
    private base64UrlEncode;
    private base64UrlDecode;
}
