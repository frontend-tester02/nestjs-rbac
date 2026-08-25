import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthTokenService } from '../../auth/services/auth-token.service';

type RequestWithAuthorizationHeader = {
  headers: {
    authorization?: string;
  };
  user?: {
    id?: string;
  };
};

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(private readonly authTokenService: AuthTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithAuthorizationHeader>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token is required');
    }

    const token = authorization.slice('Bearer '.length).trim();

    if (!token) {
      throw new UnauthorizedException('Bearer token is required');
    }

    request.user = {
      id: this.authTokenService.verify(token).sub,
    };

    return true;
  }
}
