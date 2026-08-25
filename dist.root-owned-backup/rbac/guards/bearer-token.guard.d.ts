import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthTokenService } from '../../auth/services/auth-token.service';
export declare class BearerTokenGuard implements CanActivate {
    private readonly authTokenService;
    constructor(authTokenService: AuthTokenService);
    canActivate(context: ExecutionContext): boolean;
}
