import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';

export type JwtPayload = {
  sub: string;
  email?: string;
  iat: number;
  exp: number;
};

@Injectable()
export class AuthTokenService {
  private readonly expiresInSeconds = 60 * 60 * 24;

  constructor(private readonly configService: ConfigService) {}

  sign(payload: { sub: string; email?: string }): string {
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload: JwtPayload = {
      ...payload,
      iat: now,
      exp: now + this.expiresInSeconds,
    };
    const encodedHeader = this.base64UrlEncode(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    );
    const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    const signature = this.signValue(unsignedToken);

    return `${unsignedToken}.${signature}`;
  }

  verify(token: string): JwtPayload {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      throw new UnauthorizedException('Invalid bearer token');
    }

    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = this.signValue(unsignedToken);
    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedSignatureBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
    ) {
      throw new UnauthorizedException('Invalid bearer token');
    }

    const payload = JSON.parse(this.base64UrlDecode(encodedPayload)) as JwtPayload;

    if (!payload.sub || payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Invalid bearer token');
    }

    return payload;
  }

  private signValue(value: string): string {
    return createHmac('sha256', this.getSecret()).update(value).digest('base64url');
  }

  private getSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'dev-secret-change-me');
  }

  private base64UrlEncode(value: string): string {
    return Buffer.from(value).toString('base64url');
  }

  private base64UrlDecode(value: string): string {
    return Buffer.from(value, 'base64url').toString('utf8');
  }
}
