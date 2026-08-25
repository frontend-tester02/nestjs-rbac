import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_PERMISSION_KEY } from '../decorators/require-permissions.decorator';
import { AccessCheckService } from '../services/access-check.service';

type RequestWithUser = {
  user?: {
    id?: string;
  };
};

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessCheckService: AccessCheckService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      REQUIRED_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Current user id is required');
    }

    const hasAccess = await this.accessCheckService.hasAccess(
      userId,
      requiredPermission,
    );

    if (!hasAccess) {
      throw new ForbiddenException({
        error: 'forbidden',
        message: "Ushbu amal uchun ruxsat yo'q",
        required_permission: requiredPermission,
      });
    }

    return true;
  }
}
